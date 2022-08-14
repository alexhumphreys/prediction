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
    moveFromRow ([Num, Num, Num, Str, Str, Str, Num]) ([x, y, z, str, status, mes, w]) =
      Just $ MkMove (cast x) (cast y) (cast z) (cast str) (cast status) (cast mes) (cast w)
    moveFromRow _ _ = Nothing

fetchMoves : Pool -> Promise NodeError IO (List Move)
fetchMoves pool = do
  resId <- query pool "SELECT id,gameId,participantId,moveType,status,message,stockId FROM moves WHERE status='pending';"
  Just res <- succeed $ getMoves resId | Nothing => reject $ "couldn't parse list of moves"
  pure res

updateMove : Pool -> String -> String -> Int -> Promise NodeError IO ()
updateMove pool str message id = do
  _ <- query pool "UPDATE moves SET status = '\{str}',message = '\{message}' WHERE id=\{show id};"
  pure ()

printSucceded : Show x => x -> IO ()
printSucceded x = do
  putStrLn "success"
  putStrLn $ show x

printFailed : NodeError -> IO ()
printFailed x = do putStrLn "Failure: "

processMove : Pool -> Move -> Promise NodeError IO ()
processMove pool m@(MkMove id gameId participantId moveType status message stockId) = do
  game <- fetchGame pool gameId
  case moveType of
    "buy" => do
      doUpdate $ validBuyMove m game
    "sell" => do
      doUpdate $ validSellMove m game
    x => do
      putStrLn "invalid move type: \{x}"
where
  doUpdate : Either String () -> Promise NodeError IO ()
  doUpdate res =
    case res of
         (Left x) => do
           updateMove pool "failed" x id
         (Right x) => do
           putStrLn "TODO update game state"
           updateMove pool "completed" "succeeded" id
           putStrLn "TODO update as move succeeded"
  validSellMove : Move -> GameState -> Either String ()
  validSellMove _ _ = Left "not implemented yet"
  validBuyMove : Move -> GameState -> Either String ()
  validBuyMove (MkMove i gi pi mt s m si) (MkGameState y title stockState participatns) =
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
  ignore $ traverse (processMove pool) moves

processMoves : IO ()
processMoves = do
  pool <- getPool'
  moves <- runPromise {m=IO} printSucceded printFailed $ processMoves' pool
  putStrLn "done"

loop : IO ()
loop = do
  setInterval processMoves 1000
