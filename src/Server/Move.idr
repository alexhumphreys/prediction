module Move

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

getMoves : Result -> Maybe (List Move)
getMoves x = try moveFromRow $ !(getAll x)
  where
    moveFromRow : (us : List Universe) -> (RowU us) -> Maybe Move
    moveFromRow ([Num, Num, Num, Str, Num]) ([x, y, z, str, w]) =
      Just $ MkMove (cast x) (cast y) (cast z) (cast str) (cast w)
    moveFromRow _ _ = Nothing

fetchMoves : Pool -> Promise NodeError IO (List Move)
fetchMoves pool = do
  resId <- query pool "SELECT id,gameId,participantId,moveType,stockId FROM moves;"
  Just res <- succeed $ getMoves resId | Nothing => reject $ "couldn't parse list of moves"
  pure res

printSucceded : List Move -> IO ()
printSucceded x = do
  putStrLn "success"
  putStrLn $ show x

printFailed : NodeError -> IO ()
printFailed x = do putStrLn "Failure: "

processMoves : IO ()
processMoves = do
  pool <- getPool'
  games <- runPromise {m=IO} printSucceded printFailed $ fetchMoves pool
  putStrLn "done"

loop : IO ()
loop = do
  setInterval processMoves 1000
