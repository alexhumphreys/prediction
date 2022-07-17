module Main

import Data.Buffer
import Data.Buffer.Ext
import Control.Monad.Trans
import Control.Monad.Either
import Control.Monad.Maybe
import Node.HTTP.Client
import Node.HTTP.Server
import TyTTP.Adapter.Node.HTTP
import TyTTP.Adapter.Node.URI
import TyTTP.HTTP
import TyTTP.HTTP.Consumer
import TyTTP.HTTP.Consumer.JSON
import TyTTP.HTTP.Producer.JSON
import TyTTP.HTTP.Producer
import TyTTP.HTTP.Routing
import TyTTP.URL
import TyTTP.URL.Path
import TyTTP.URL.Search

import PG.Postgres
import PG.Promise
import PG.Util
import Debug.Trace

import Data.List.Quantifiers
import Generics.Derive
import JSON

%foreign """
node:lambda: (str) => { return {message: str, code: str, stack:""} }
"""
prim__from_string : String -> IO NodeError

-- TODO many many hacks
FromString NodeError where
  fromString x = unsafePerformIO $ prim__from_string x

%language ElabReflection

%runElab derive "Universe" [Generic, Meta, Eq]

record Participant where
  constructor MkParticipant
  id : Int
  gameId : Int
  userId : Int
  money : Int

%runElab derive "Participant" [Generic, Meta, Show, Eq, RecordToJSON]

record Stock where
  constructor MkStock
  id : Int
  gameId : Int
  description : String

%runElab derive "Stock" [Generic, Meta, Show, Eq, RecordToJSON]

record GameStock where
  constructor MkGameStock
  id : Int
  gameId : Int
  stockId : Int
  amount : Int

%runElab derive "GameStock" [Generic, Meta, Show, Eq, RecordToJSON]

record StockState where
  constructor MkStockState
  stockId : Int
  description : String
  amount : Int

%runElab derive "StockState" [Generic, Meta, Show, Eq, RecordToJSON]

record GameState where
  constructor MkGameState
  id : Int
  title : String
  stockState : List StockState
  participatns : List Participant

%runElab derive "GameState" [Generic, Meta, Show, Eq, RecordToJSON]

record GameShort where
  constructor MkGameShort
  id : Int
  title : String

%runElab derive "GameShort" [Generic, Meta, Show, Eq, RecordToJSON]

record GamePayload where
  constructor MkGamePayload
  startingParticipantId : Int
  title : String
  stocks : List String

%runElab derive "GamePayload" [Generic, Meta, Show, Eq, RecordToJSON, RecordFromJSON]

data Country =
  MkCountry String Nat
Show Country where
  show (MkCountry x k) = "MkCountry \{x} \{show k}"

countryFromRow : (us : List Universe) -> (RowU us) -> Maybe Country
countryFromRow ([Str, Num]) ([v, x]) = Just $ MkCountry v (cast x)
countryFromRow (x :: _) _ = Nothing
countryFromRow ([]) _ = Nothing

tryCountry : Maybe (us ** Table us) -> Maybe (List Country)
tryCountry Nothing = Nothing
tryCountry (Just (MkDPair fst snd)) = traverse (countryFromRow fst) snd

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

createParticipants : FromString e => Pool -> Int -> PG.Promise.Promise e IO ()
createParticipants pool gameId = do
  _ <- query pool "INSERT INTO participants(gameId, userId, money) VALUES (\{show gameId},1,100) RETURNING id;"
  _ <- query pool "INSERT INTO participants(gameId, userId, money) VALUES (\{show gameId},2,100) RETURNING id;"
  pure ()

createGameStocks : FromString e => Pool -> Int -> List String -> PG.Promise.Promise e IO ()
createGameStocks pool gameId [] = pure ()
createGameStocks pool gameId (x :: xs) = do
  resId <- query pool "INSERT INTO stocks(gameId, description) VALUES (\{show gameId}, '\{x}') RETURNING id;"
  Just stockId <- lift $ getId resId | Nothing => reject $ fromString "no stock id for \{show x}"
  ignore $ query pool "INSERT INTO gameStocks(gameId, stockId, amount) VALUES (\{show gameId}, \{show stockId}, 10) RETURNING id;"
  createGameStocks pool gameId xs

createGame : FromString e => Pool -> GamePayload -> PG.Promise.Promise e IO (Int)
createGame pool (MkGamePayload startingParticipantId title stocks) = do
  -- BAD: vulnerable to SQL injection
  -- need to work out how to pass a HList to the FFI
  -- TODO wrap this in a transaction
  resId <- query pool "INSERT INTO games(title) VALUES ('\{title}') RETURNING id;"
  Just id <- lift $ getId resId | Nothing => reject $ fromString "no game id for game titled: \{title}"
  createGameStocks pool id stocks
  createParticipants pool id
  pure $ trace "created game \{show id}" id


try : ((us : List Universe) -> (RowU us) -> Maybe z)
    -> (us : List Universe ** List (Row (RowTypes us))) -> Maybe (List z)
try f (fst ** []) = Just []
try f (fst ** (y :: xs)) = Just $ !(f fst y) :: !(try f (fst ** xs))

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

fetchStocks : FromString e =>  Pool -> List GameStock -> PG.Promise.Promise e IO (List Stock)
fetchStocks pool [] = pure []
fetchStocks pool ((MkGameStock id gameId stockId amount) :: xs) = do
  resStock <- query pool "SELECT * FROM stocks WHERE id=\{show id};"
  Just stock <- lift $ getStock resStock | Nothing => reject $ fromString "couldn't parse stock \{show id}"
  pure $ stock :: !(fetchStocks pool xs)

fetchParticipants : FromString e =>  Pool -> GameShort -> PG.Promise.Promise e IO (List Participant)
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
  case Data.List.find (\y => Main.Stock.id y == stockId) ys of
       Nothing => mkStockStates xs ys
       (Just stock) => MkStockState stockId (description stock) amount :: mkStockStates xs ys

mkGameState : GameShort -> List GameStock -> List Stock -> List Participant -> GameState
mkGameState (MkGameShort id title) xs ys zs = MkGameState id title (mkStockStates xs ys) zs

fetchGame : FromString e => Pool -> Int -> PG.Promise.Promise e IO (GameState)
fetchGame pool i = do
  resGame <- query pool "SELECT id,title FROM games WHERE id=\{show i};"
  Just game <- lift $ getGame resGame | Nothing => reject $ fromString "couldn't parse game \{show i}"
  resGameStocks <- query pool "SELECT * FROM gameStocks WHERE gameId=\{show i};"
  Just gameStocks <- lift $ getGameStocks resGameStocks | Nothing => reject $ fromString "couldn't parse gameStocks for gameId: \{show i}"
  stocks <- fetchStocks pool gameStocks
  participants <- fetchParticipants pool game
  pure $ mkGameState game gameStocks stocks participants

fetchGames : FromString e => Pool -> PG.Promise.Promise e IO (List GameShort)
fetchGames pool = do
  resId <- query pool "SELECT id,title FROM games;"
  Just games <- lift $ getGames resId | Nothing => reject $ fromString "couldn't parse list of games"
  pure games

getCountries : FromString e => Pool -> PG.Promise.Promise e IO (List Country)
getCountries pool = do
  b <- query pool "SELECT country,total FROM board"
  countries <- lift $ getAll b
  ls <- lift $ tryCountry countries
  case ls of
       Nothing => reject "Error: got nothing"
       (Just cs) => pure $ trace (show cs) cs

transform : PG.Promise.Promise e m a -> Core.Promise.Promise e m a
transform x = MkPromise $ \cb => do
  resolve x
    (\a => cb.onSucceded a)
    (\e => cb.onFailed e)

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
  pool <- getPool
  http <- HTTP.require
  ignore $ HTTP.listen {e = NodeError} http options $
      decodeUri' (text "URI decode has failed" >=> status BAD_REQUEST)
      :> parseUrl' (const $ text "URL has invalid format" >=> status BAD_REQUEST)
      :> routes' (text "Resource could not be found" >=> status NOT_FOUND)
          [ get $ path "/query" $ \ctx =>
              text ctx.request.url.search ctx >>= status OK
          , get $ path "/parsed" $ Simple.search $ \ctx =>
              text (show ctx.request.url.search) ctx >>= status OK
          , get $ path "/db" :> \ctx => do
              putStrLn "querying db"
              let cs = getCountries pool
              x <- transform cs
              text (show x) ctx >>= status OK
          , post
              $ TyTTP.URL.Path.path "/games/newGame"
              $ consumes' [JSON]
                  (\ctx => text "Content cannot be parsed: \{ctx.request.body}" ctx >>= status BAD_REQUEST)
              $ \ctx => do
                let foo = ctx.request.body
                let q = createGame pool foo
                gameId <- transform q
                text (show gameId) ctx >>= status CREATED
          , get $ path "/games" :> \ctx => do
              let games = fetchGames pool
              ret <- transform games
              json ret ctx >>= status OK
          , get $ path "/games/*" :> \ctx => do
            let id = stringToMaybeNat ctx.request.url.path.rest
            case id of
                 Nothing => text "invalid id" ctx >>= status BAD_REQUEST
                 (Just n) => do
                   let game = fetchGame pool (cast n)
                   ret <- transform game
                   json ret ctx >>= status OK
          , get $ path "/request" :> \ctx => do
              putStrLn "Calling http"
              res <- MkPromise $ \cb =>
                ignore $ http.get "http://localhost:3000/parsed?q=from-request" cb.onSucceded
              if res.statusCode == 200
                then
                  pure $
                    { response.status := OK
                    , response.headers := [("Content-Type", "text/plain")]
                    , response.body := MkPublisher $ \s => do
                        onData res s.onNext
                        onEnd res s.onSucceded
                        onError res s.onFailed
                    } ctx
                else
                  text "HTTP call failed with status code \{show res.statusCode}" ctx >>= status INTERNAL_SERVER_ERROR
          ]
