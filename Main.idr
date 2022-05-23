module Main
import Data.Fin
import Data.List

data Country = MkCountry String
Eq Country where
  (==) (MkCountry x) (MkCountry y) = x == y
Show Country where
  show x = ?foo1

data Board = MkBoard (List (Country, Nat))
Show Board where
  show x = ?foo2

data PlayerName = MkPlayerName String
Eq PlayerName where
  (==) (MkPlayerName x) (MkPlayerName y) = x == y
Show PlayerName where
  show x = ?foo3

data PlayerStuff = MkPlayerStuff Nat (List Country)
Eq PlayerStuff where
  (==) (MkPlayerStuff x w) (MkPlayerStuff y z) = x == y && w == z
Show PlayerStuff where
  show x = ?foo4

Players : Type
Players = (List (PlayerName, PlayerStuff))

data Game = MkGame Board Players
Show Game where
  show x = ?foo5

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

board : Board
board = MkBoard [(MkCountry "canada", 7), (MkCountry "hungary", 7)]

players : Players
players =
  [ ((MkPlayerName "player A"), (MkPlayerStuff 100 []))
  , ((MkPlayerName "player B"), (MkPlayerStuff 100 []))]

game : Game
game = MkGame board players

buyCard : PlayerName -> Country -> Game -> Game
buyCard playerName country g@(MkGame b@(MkBoard xs) players) =
  let remainingCards = lookup country xs
      playerStuff = lookup playerName players
  in
  case (playerStuff, remainingCards) of
       (Nothing, _) => g
       (_, Nothing) => g
       (_, (Just 0)) => g
       (Just ps, (Just (S k))) =>
          let newBoard = boardSell (country, (S k)) k country b
              newPlayerStuff = playerBuy 5 country ps
          in
              MkGame newBoard $ replaceOn (playerName, ps) (playerName, newPlayerStuff) players
where
  playerBuy : Nat -> Country -> PlayerStuff -> PlayerStuff
  playerBuy k x ps@(MkPlayerStuff j ys) =
    case k < j of
         False => ps
         True => MkPlayerStuff (minus j k) (x :: ys)

  boardSell : (Country, Nat) -> Nat -> Country -> Board -> Board
  boardSell current newBalance country (MkBoard ys) =
    let new = (country, newBalance) in
    MkBoard $ replaceOn current new ys

aMove : Game
aMove = buyCard (MkPlayerName "player A") (MkCountry "hungary") game

main : IO ()
main = do putStrLn $ show aMove
