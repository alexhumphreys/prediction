module Main
import Data.Fin

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
data Board3 = MkBoard3 (List (Country3, Nat))
data Player = MkPlayer String Nat (List Country3)

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

main : IO ()
main = do
  putStrLn $ show board
  putStrLn $ show board2
