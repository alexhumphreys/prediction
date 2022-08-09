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
    moveFromRow ([Num, Num, Num, Str, Str, Num]) ([x, y, z, str, status, w]) =
      Just $ MkMove (cast x) (cast y) (cast z) (cast str) (cast status) (cast w)
    moveFromRow _ _ = Nothing

fetchMoves : Pool -> Promise NodeError IO (List Move)
fetchMoves pool = do
  resId <- query pool "SELECT id,gameId,participantId,moveType,status,stockId FROM moves WHERE status='pending';"
  Just res <- succeed $ getMoves resId | Nothing => reject $ "couldn't parse list of moves"
  pure res

updateMove : Pool -> String -> Int -> Promise NodeError IO ()
updateMove pool str id = do
  _ <- query pool "UPDATE moves SET status = '\{str}' WHERE id=\{show id};"
  pure ()

printSucceded : Show x => x -> IO ()
printSucceded x = do
  putStrLn "success"
  putStrLn $ show x

printFailed : NodeError -> IO ()
printFailed x = do putStrLn "Failure: "

executeMoves : Pool -> List Move -> IO ()
executeMoves pool [] = putStrLn "no moves"
executeMoves pool (x :: xs) = do
  go x
  executeMoves pool xs
where
  go : Move -> IO ()
  go (MkMove id gameId participantId moveType status stockId) = do
    putStrLn "moveId: \{show id}"
    runPromise {m=IO} printSucceded printFailed $ updateMove pool "completed" id

processMoves : IO ()
processMoves = do
  pool <- getPool'
  moves <- runPromise {m=IO} (executeMoves pool) printFailed $ fetchMoves pool
  putStrLn "done"

loop : IO ()
loop = do
  setInterval processMoves 1000
