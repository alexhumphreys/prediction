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

main : IO ()
main = do
  putStrLn $ show board
  putStrLn $ show board2
