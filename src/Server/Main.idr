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

record GameState where

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

gamePayloadToQuery : GameState -> String
gamePayloadToQuery x = trace "?gamePayloadToQuery" "empty string"

idFromRow : (us : List Universe) -> (RowU us) -> Maybe Int
idFromRow ([Num]) ([x]) = Just $ cast x
idFromRow (x :: _) _ = Nothing
idFromRow ([]) _ = Nothing

tryId : Maybe (us : List Universe ** List (Row (RowTypes us))) -> Maybe Int
tryId Nothing = Nothing
tryId (Just ((fst ** []))) = Nothing
tryId (Just ((fst ** (x :: [])))) = idFromRow fst x
tryId (Just ((fst ** (x :: y)))) = Nothing

stocksToSQL : Int -> List String -> String
stocksToSQL gameId strs = concat $ intersperse ", " $
                          map (\s => "(\{show gameId}, '\{s}')") strs

createGame : FromString e => Pool -> GamePayload -> PG.Promise.Promise e IO (Int)
createGame pool (MkGamePayload startingParticipantId title stocks) = do
  -- BAD: vulnerable to SQL injection
  -- need to work out how to pass a HList to the FFI
  -- TODO wrap this in a transaction
  id_ <- query pool "INSERT INTO games(title) VALUES ('\{title}') RETURNING id;"
  id__ <- lift $ getAll id_
  id___ <- lift $ tryId id__
  case id___ of
       Nothing => reject "Error: got nothing"
       (Just id____) => do
         _ <- query pool "INSERT INTO stocks(gameId, description) VALUES \{stocksToSQL id____ stocks} RETURNING id;"
         pure $ trace (show id____) id____

{-
getFoos : FromString e => Pool -> PG.Promise.Promise e IO (List Foo)
getFoos pool = do
  b <- query pool "SELECT bar,baz FROM foo"
  foos <- lift $ getAll b
  ls <- lift $ tryFoo foos
  case ls of
       Nothing => reject "Error: got nothing"
       (Just cs) => pure $ trace (show cs) cs
       -}

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
                text (show gameId) ctx >>= status OK
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
