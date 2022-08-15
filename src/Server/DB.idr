module DB

import Data.List
import Promise
import PG.Postgres
import TyTTP.Adapter.Node.HTTP
import TyTTP.Adapter.Node.URI
import TyTTP.HTTP

import Types
import Util

export
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

fetchStuff : Pool -> String -> String -> ((us : List Universe) -> (RowU us) -> Maybe a) -> Promise NodeError IO (List a)
fetchStuff pool q mes f = do
  res <- query pool q
  Just x <- succeed $ get res | Nothing => reject $ fromString mes
  pure x
where
  get : Result -> Maybe (List a)
  get x = try f $ !(getAll x)

fetchStuff1 : Pool -> String -> String -> ((us : List Universe) -> (RowU us) -> Maybe a) -> Promise NodeError IO a
fetchStuff1 pool q mes f = do
  one <- fetchStuff pool q mes f
  case one of
       [] => reject $ fromString "No results"
       (x :: []) => pure x
       (x :: _) => reject $ fromString "Too many results"

export
fetchStocks : FromString e =>  Pool -> List GameStock -> Promise e IO (List Stock)
fetchStocks pool [] = pure []
fetchStocks pool ((MkGameStock id gameId stockId amount) :: xs) = do
  resStock <- query pool "SELECT * FROM stocks WHERE id=\{show id};"
  Just stock <- succeed $ getStock resStock | Nothing => reject $ fromString "couldn't parse stock \{show id}"
  pure $ stock :: !(fetchStocks pool xs)
where
  stockFromRow : (us : List Universe) -> (RowU us) -> Maybe Stock
  stockFromRow ([Num, Num, Str]) ([x, y, z]) = Just $ MkStock (cast x) (cast y) (cast z)
  stockFromRow _ _ = Nothing
  getStock : Result -> Maybe Stock
  getStock x = head' $ !(try stockFromRow $ !(getAll x))

export
fetchParticipants : FromString e =>  Pool -> GameShort -> Promise e IO (List Participant)
fetchParticipants pool (MkGameShort id title) = do
  resParticipants <- query pool "SELECT * FROM participants WHERE gameId=\{show id};"
  Just participants <- succeed $ getParticipants resParticipants | Nothing => reject $ fromString "couldn't parse participants for gameId: \{show id}"
  pure participants
where
  participantFromRow : (us : List Universe) -> (RowU us) -> Maybe Participant
  participantFromRow ([Num, Num, Num, Num]) ([x, y, z, w]) = Just $ MkParticipant (cast x) (cast y) (cast z) (cast w)
  participantFromRow _ _ = Nothing
  getParticipants : Result -> Maybe (List Participant)
  getParticipants x = try participantFromRow $ !(getAll x)

fetchParticipantStock : Pool -> Int -> Promise NodeError IO (List ParticipantStock)
fetchParticipantStock pool id = do
  pure !(fetchStuff pool query "couldn't parse ParticipantStock" psFromRow)
where
  query : String
  query = "SELECT * FROM participantStock WHERE participantId=\{show id};"
  psFromRow : (us : List Universe) -> (RowU us) -> Maybe ParticipantStock
  psFromRow ([Num, Num, Num, Num]) ([x, y, z, w]) = Just $ MkParticipantStock (cast x) (cast y) (cast z) (cast w)
  psFromRow _ _ = Nothing

fetchGameStocks : Pool -> Int -> Promise NodeError IO (List GameStock)
fetchGameStocks pool i = do
  resGameStocks <- query pool "SELECT * FROM gameStocks WHERE gameId=\{show i};"
  Just gameStocks <- succeed $ getGameStocks resGameStocks | Nothing => reject $ fromString "couldn't parse gameStocks for gameId: \{show i}"
  pure gameStocks
where
  getGameStocks : Result -> Maybe (List GameStock)
  getGameStocks x = try gameStockFromRow $ !(getAll x)
    where
      gameStockFromRow : (us : List Universe) -> (RowU us) -> Maybe GameStock
      gameStockFromRow ([Num, Num, Num, Num]) ([x, gi, si, amount]) = Just $ MkGameStock (cast x) (cast gi) (cast si) (cast amount)
      gameStockFromRow _ _ = Nothing

export
fetchJustGame : Pool -> Int -> Promise NodeError IO (GameShort)
fetchJustGame pool i = do
  resGame <- query pool "SELECT id,title FROM games WHERE id=\{show i};"
  Just game <- succeed $ getGame resGame | Nothing => reject $ fromString "couldn't parse game \{show i}"
  pure game
where
  getGame : Result -> Maybe (GameShort)
  getGame x = head' !(try gameFromRow $ !(getAll x))
    where
      gameFromRow : (us : List Universe) -> (RowU us) -> Maybe GameShort
      gameFromRow ([Num, Str]) ([x, str]) = Just $ MkGameShort (cast x) (cast str)
      gameFromRow _ _ = Nothing

export
fetchGame : Pool -> Int -> Promise NodeError IO (GameState)
fetchGame pool i = do
  game <- fetchJustGame pool i
  gameStocks <- fetchGameStocks pool i
  stocks <- fetchStocks pool gameStocks
  participants <- fetchParticipants pool game
  -- TODO return participant stocks
  pure $ mkGameState game gameStocks stocks participants
where
  getGame : Result -> Maybe (GameShort)
  getGame x = head' !(try gameFromRow $ !(getAll x))
    where
      gameFromRow : (us : List Universe) -> (RowU us) -> Maybe GameShort
      gameFromRow ([Num, Str]) ([x, str]) = Just $ MkGameShort (cast x) (cast str)
      gameFromRow _ _ = Nothing
  mkStockStates : List GameStock -> List Stock -> List StockState
  mkStockStates [] ys = []
  mkStockStates ((MkGameStock id gameId stockId amount) :: xs) ys =
    case Data.List.find (\y => Stock.id y == stockId) ys of
         Nothing => mkStockStates xs ys
         (Just stock) => MkStockState stockId (description stock) amount :: mkStockStates xs ys
  mkGameState : GameShort -> List GameStock -> List Stock -> List Participant -> GameState
  mkGameState (MkGameShort id title) xs ys zs = MkGameState id title (mkStockStates xs ys) zs
