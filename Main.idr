module Main
import Data.Fin
import Data.List

data Country = MkCountry String

Show Country where
  show (MkCountry x) = x

data Card = MkCard Country

Show Card where
  show (MkCard x) = "MkCard \{show x}"

Column : Type
Column = List (Nat, Maybe Card)

Board : Type
Board = List Column

data Column2 = MkColumn2 (Fin 11) Nat
Show Column2 where
  show (MkColumn2 x k) = "(MkColumn2 \{show x} \{show k})"

data Board2 = MkBoard (List (Country, Column2))
Show Board2 where
  show (MkBoard x) = "(MkBoard \{show x})"

cards : List Card
cards = map (MkCard . MkCountry) ["Hungary", "canada"]

column : Card -> Column
column x = map (\n => MkPair n (Just x)) [1..4]

board : Board
board = map column cards

startColumn2 : Column2
startColumn2 = MkColumn2 10 10

board2 : Board2
board2 = let countries = map MkCountry ["Hungary", "canada"] in
  MkBoard $ map (\x => (x, startColumn2)) countries

data Country3 = MkCountry3 String
Eq Country3 where
  (==) (MkCountry3 x) (MkCountry3 y) = x == y

data Board3 = MkBoard3 (List (Country3, Nat))
data Player = MkPlayer String Nat (List Country3)
data Game = MkGame Board3 (List Player)

validPrices : List Nat
validPrices = [5, 10, 30, 50, 80, 90, 100]

sellPrice : List Nat -> Nat -> Maybe Nat
sellPrice xs k = go (reverse xs) k
where
  go : List Nat -> Nat -> Maybe Nat
  go [] k = Nothing
  go (x :: xs) 0 = Just x
  go (x :: xs) (S k) = go xs k

buyPrice : List Nat -> Nat -> Maybe Nat
buyPrice xs 0 = Nothing
buyPrice xs (S k) = go (reverse xs) (k)
where
  go : List Nat -> Nat -> Maybe Nat
  go [] k = Nothing
  go (x :: xs) 0 = Just x
  go (x :: xs) (S k) = go xs k

board3 : Board3
board3 = MkBoard3 [(MkCountry3 "canada", 7), (MkCountry3 "hungary", 7)]

players : List Player
players =
  [ MkPlayer "player A" 100 []
  , MkPlayer "player B" 100 []]

game : Game
game = MkGame board3 players

buyCard : String -> Country3 -> Game -> Game
buyCard playerName country g@(MkGame b@(MkBoard3 xs) players) =
  let remainingCards = lookup country xs
      player = findPlayer playerName players
  in
  case (player, remainingCards) of
       (Nothing, _) => g
       (_, Nothing) => g
       (_, (Just 0)) => g
       (Just pl, (Just (S k))) =>
          let newBoard = boardSell (country, (S k)) k country b
              newPlayer = playerBuy 5 country pl
          in
              MkGame newBoard $ replacePlayer newPlayer players
where
  playerBuy : Nat -> Country3 -> Player -> Player
  playerBuy n c (MkPlayer x k ys) =
    MkPlayer x (minus k n) (c :: ys)

  boardSell : (Country3, Nat) -> Nat -> Country3 -> Board3 -> Board3
  boardSell current newBalance country (MkBoard3 ys) =
    let new = (country, newBalance) in
    MkBoard3 $ replaceOn current new ys

  findPlayer : String -> List Player -> Maybe Player
  findPlayer _ [] = Nothing
  findPlayer playerName (b@(MkPlayer y _ _) :: xs) =
    case playerName == y of
         False => findPlayer playerName xs
         True => Just b

  replacePlayer : Player -> List Player -> List Player
  replacePlayer _ [] = []
  replacePlayer a@(MkPlayer x _ _) (b@(MkPlayer y _ _) :: xs) =
    case x == y of
         False => b :: replacePlayer a xs
         True => a :: xs

main : IO ()
main = do
  putStrLn $ show board
  putStrLn $ show board2
