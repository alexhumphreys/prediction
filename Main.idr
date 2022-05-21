data Country = MkCountry String

Show Country where
  show (MkCountry x) = x

data Card = MkCard Country Nat

Show Card where
  show (MkCard x k) = show x ++ " " ++ show k

Board : Type
Board = List (List Card)

countries : List Country
countries = map MkCountry ["Hungary", "canada"]

card : Country -> List Card
card c = let prices = [1..10] in
           map (MkCard c) prices

board : Board
board = map card countries

main : IO ()
main = putStrLn $ show board
