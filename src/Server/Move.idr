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
import DB

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

processMoves'' : Pool -> List Move -> Promise NodeError IO ()
processMoves'' pool [] = pure ()
processMoves'' pool (m@(MkMove id gameId participantId moveType status stockId) :: xs) = do
  game <- fetchGame pool gameId
  case validBuyMove m game of
       (Left x) => do
         updateMove pool "failed" id
         processMoves'' pool xs
       (Right x) => do
         putStrLn "TODO update game state"
         updateMove pool "completed" id
         putStrLn "TODO update as move succeeded"
         processMoves'' pool xs
where
  validSellMove : Move -> GameState -> Either String ()
  validSellMove _ _ = Left "not implemented yet"
  validBuyMove : Move -> GameState -> Either String ()
  validBuyMove (MkMove i gi pi mt s si) (MkGameState y title stockState participatns) =
    let participant = Data.List.find (\p => Types.Participant.id p == pi) (participatns)
        stock = Data.List.find (\p => Types.StockState.stockId p == pi) (stockState)
    in
        case (participant, stock) of
             (Nothing, Nothing) => Left "participant and stock not found"
             (Nothing, (Just x)) => Left "participant not found"
             ((Just x), Nothing) => Left "stock not found"
             ((Just (MkParticipant x w userId money)), (Just (MkStockState z description amount))) => do
               enoughMoney money
               enoughStock amount
               pure ()
    where
      enoughMoney : Int -> Either String ()
      enoughMoney x =
        case x > 0 of -- TODO pricing
             False => Left "Not enough money"
             True => pure ()
      enoughStock : Int -> Either String ()
      enoughStock x =
        case x > 0 of
             False => Left "Not enough stock"
             True => pure ()

processMoves' : Pool -> Promise NodeError IO ()
processMoves' pool = do
  moves <- fetchMoves pool
  processMoves'' pool moves

processMoves : IO ()
processMoves = do
  pool <- getPool'
  moves <- runPromise {m=IO} printSucceded printFailed $ processMoves' pool
  putStrLn "done"

loop : IO ()
loop = do
  setInterval processMoves 1000
