module Main

import Data.Buffer.Ext
import Promise

import Node.HTTP.Client
import Node.HTTP.Server
import TyTTP.Adapter.Node.HTTP
import TyTTP.Adapter.Node.URI
import TyTTP.HTTP
import TyTTP.HTTP.Consumer.JSON
import TyTTP.HTTP.Producer.JSON
import TyTTP.URL

import PG.Postgres
import Debug.Trace

import Generics.Derive
import JSON

import Util
import Types

%language ElabReflection

%runElab derive "Universe" [Generic, Meta, Eq]

getId : Result -> Maybe Int
getId x = tryId $ getAll x
  where
    idFromRow : (us : List Universe) -> (RowU us) -> Maybe Int
    idFromRow ([Num]) ([x]) = Just $ cast x
    idFromRow _ _ = Nothing
    tryId : Maybe (us : List Universe ** List (Row (RowTypes us))) -> Maybe Int
    tryId Nothing = Nothing
    tryId (Just ((fst ** (x :: [])))) = idFromRow fst x
    tryId (Just _) = Nothing

-- stocksToGameStocksSQL : Int -> List String -> List String
-- stocksToGameStocksSQL gameId strs = concat $ intersperse ", " $
                          -- map (\s => "(\{show gameId}, '\{s}')") strs
stocksToSQL : Int -> List String -> String
stocksToSQL gameId strs = concat $ intersperse ", " $
                          map (\s => "(\{show gameId}, '\{s}')") strs

createParticipants : FromString e => Pool -> Int -> Promise e IO ()
createParticipants pool gameId = do
  _ <- query pool "INSERT INTO participants(gameId, userId, money) VALUES (\{show gameId},1,100) RETURNING id;"
  _ <- query pool "INSERT INTO participants(gameId, userId, money) VALUES (\{show gameId},2,100) RETURNING id;"
  pure ()

export
lift : a -> Promise e m a
lift = succeed

createGameStocks : FromString e => Pool -> Int -> List String -> Promise e IO ()
createGameStocks pool gameId [] = pure ()
createGameStocks pool gameId (x :: xs) = do
  resId <- query pool "INSERT INTO stocks(gameId, description) VALUES (\{show gameId}, '\{x}') RETURNING id;"
  Just stockId <- lift $ getId resId | Nothing => reject $ fromString "no stock id for \{show x}"
  ignore $ query pool "INSERT INTO gameStocks(gameId, stockId, amount) VALUES (\{show gameId}, \{show stockId}, 10) RETURNING id;"
  createGameStocks pool gameId xs

createGame : FromString e => Pool -> GamePayload -> Promise e IO (Int)
createGame pool (MkGamePayload startingParticipantId title stocks) = do
  -- BAD: vulnerable to SQL injection
  -- need to work out how to pass a HList to the FFI
  -- TODO wrap this in a transaction
  resId <- query pool "INSERT INTO games(title) VALUES ('\{title}') RETURNING id;"
  Just id <- lift $ getId resId | Nothing => reject $ fromString "no game id for game titled: \{title}"
  createGameStocks pool id stocks
  createParticipants pool id
  pure $ trace "created game \{show id}" id

createMove : FromString e => Pool -> MovePayload -> Promise e IO (Int)
createMove pool (MkMovePayload gameId participantId moveType stockId) = do
  -- BAD: vulnerable to SQL injection
  -- need to work out how to pass a HList to the FFI
  -- TODO wrap this in a transaction
  resId <- query pool "INSERT INTO moves(gameId, participantId, moveType, stockId) VALUES ('\{show gameId}','\{show participantId}','\{moveType}','\{show stockId}') RETURNING id;"
  Just id <- lift $ getId resId | Nothing => reject $ fromString "failed to create move"
  pure $ trace "created move \{show id}" id

getGames : Result -> Maybe (List GameShort)
getGames x = try gameFromRow $ !(getAll x)
  where
    gameFromRow : (us : List Universe) -> (RowU us) -> Maybe GameShort
    gameFromRow ([Num, Str]) ([x, str]) = Just $ MkGameShort (cast x) (cast str)
    gameFromRow _ _ = Nothing

getGame : Result -> Maybe (GameShort)
getGame x = head' !(try gameFromRow $ !(getAll x))
  where
    gameFromRow : (us : List Universe) -> (RowU us) -> Maybe GameShort
    gameFromRow ([Num, Str]) ([x, str]) = Just $ MkGameShort (cast x) (cast str)
    gameFromRow _ _ = Nothing

getGameStocks : Result -> Maybe (List GameStock)
getGameStocks x = try gameStockFromRow $ !(getAll x)
  where
    gameStockFromRow : (us : List Universe) -> (RowU us) -> Maybe GameStock
    gameStockFromRow ([Num, Num, Num, Num]) ([x, gi, si, amount]) = Just $ MkGameStock (cast x) (cast gi) (cast si) (cast amount)
    gameStockFromRow _ _ = Nothing

getStock : Result -> Maybe Stock
getStock x = head' $ !(try stockFromRow $ !(getAll x))
where
  stockFromRow : (us : List Universe) -> (RowU us) -> Maybe Stock
  stockFromRow ([Num, Num, Str]) ([x, y, z]) = Just $ MkStock (cast x) (cast y) (cast z)
  stockFromRow _ _ = Nothing

fetchStocks : FromString e =>  Pool -> List GameStock -> Promise e IO (List Stock)
fetchStocks pool [] = pure []
fetchStocks pool ((MkGameStock id gameId stockId amount) :: xs) = do
  resStock <- query pool "SELECT * FROM stocks WHERE id=\{show id};"
  Just stock <- lift $ getStock resStock | Nothing => reject $ fromString "couldn't parse stock \{show id}"
  pure $ stock :: !(fetchStocks pool xs)

fetchParticipants : FromString e =>  Pool -> GameShort -> Promise e IO (List Participant)
fetchParticipants pool (MkGameShort id title) = do
  resParticipants <- query pool "SELECT * FROM participants WHERE gameId=\{show id};"
  Just participants <- lift $ getParticipants resParticipants | Nothing => reject $ fromString "couldn't parse participants for gameId: \{show id}"
  pure participants
where
  participantFromRow : (us : List Universe) -> (RowU us) -> Maybe Participant
  participantFromRow ([Num, Num, Num, Num]) ([x, y, z, w]) = Just $ MkParticipant (cast x) (cast y) (cast z) (cast w)
  participantFromRow _ _ = Nothing
  getParticipants : Result -> Maybe (List Participant)
  getParticipants x = try participantFromRow $ !(getAll x)

mkStockStates : List GameStock -> List Stock -> List StockState
mkStockStates [] ys = []
mkStockStates ((MkGameStock id gameId stockId amount) :: xs) ys =
  case Data.List.find (\y => Stock.id y == stockId) ys of
       Nothing => mkStockStates xs ys
       (Just stock) => MkStockState stockId (description stock) amount :: mkStockStates xs ys

mkGameState : GameShort -> List GameStock -> List Stock -> List Participant -> GameState
mkGameState (MkGameShort id title) xs ys zs = MkGameState id title (mkStockStates xs ys) zs

fetchGame : Pool -> Int -> Promise NodeError IO (GameState)
fetchGame pool i = do
  resGame <- query pool "SELECT id,title FROM games WHERE id=\{show i};"
  Just game <- lift $ getGame resGame | Nothing => reject $ fromString "couldn't parse game \{show i}"
  resGameStocks <- query pool "SELECT * FROM gameStocks WHERE gameId=\{show i};"
  Just gameStocks <- lift $ getGameStocks resGameStocks | Nothing => reject $ fromString "couldn't parse gameStocks for gameId: \{show i}"
  stocks <- fetchStocks pool gameStocks
  participants <- fetchParticipants pool game
  pure $ mkGameState game gameStocks stocks participants

fetchGames : Pool -> Promise NodeError IO (List GameShort)
fetchGames pool = do
  resId <- query pool "SELECT id,title FROM games;"
  Just games <- lift $ getGames resId | Nothing => reject $ "couldn't parse list of games"
  pure games

options : Error e => Options e
options = MkOptions
  { serverOptions = HTTP.Server.defaultOptions
  , listenOptions =
    { port := Just 3000
    , host := Just "0.0.0.0"
    } Listen.defaultOptions
  , errorHandler = \e =>
    let body = trace (message e) "Sorry, an error has occurred" in
    MkResponse
    { status = INTERNAL_SERVER_ERROR
    , headers =
      [ ("Content-Type", "text/plain")
      , ("Content-Length", show $ length $ body)
      ]
    , body = singleton $ fromString $ body
    }
  }

stringToMaybeNat : String -> Maybe Nat
stringToMaybeNat "0" = Just 0
stringToMaybeNat str =
  let try = the Nat $ cast str in
  case try of
       0 => Nothing
       x => Just x

main : IO ()
main = eitherT putStrLn pure $ do
  pool <- getPool'
  http <- HTTP.require
  putStrLn "starting server on port \{show $ port . listenOptions $ options {e=NodeError}}"
  ignore $ HTTP.listen {e=NodeError} http options
      -- $ (\next, ctx => mapFailure Node.Error.message (next ctx))
      $ decodeUri' (sendText "URI decode has failed" >=> status BAD_REQUEST)
      $ parseUrl' (const $ sendText "URL has invalid format" >=> status BAD_REQUEST)
      :> routes' (sendText "Resource could not be found" >=> status NOT_FOUND)
          [ post
              $ pattern "/games/newGame"
              $ consumes' [JSON]
                  (\ctx => sendText "Content cannot be parsed: \{ctx.request.body}" ctx >>= status BAD_REQUEST)
              $ \ctx => do
                let body = ctx.request.body
                gameId <- liftPromise $ createGame pool body
                sendText (show gameId) ctx >>= status CREATED
          , post
              $ pattern "/moves"
              $ consumes' [JSON]
                  (\ctx => sendText "Content cannot be parsed: \{ctx.request.body}" ctx >>= status BAD_REQUEST)
              $ \ctx => do
                let body = ctx.request.body
                moveId <- liftPromise $ createMove pool body
                sendText (show moveId) ctx >>= status CREATED
          ,  get $ pattern "/games" :> \ctx => do
              games <- liftPromise $ fetchGames pool
              sendJSON games ctx >>= status OK
          , get $ pattern "/games/*" :> \ctx => do
            let id = stringToMaybeNat ctx.request.url.path.rest
            case id of
                 Nothing => sendText "invalid id" ctx >>= status BAD_REQUEST
                 (Just n) => do
                   game <- liftPromise $ fetchGame pool (cast n)
                   sendJSON game ctx >>= status OK
          ]
