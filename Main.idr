module Main
import Data.Fin
import Data.List
import Data.List.Elem

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

-- checks
-- player exists
-- country exists
-- player has enough funds
-- board has enough cards remaining
buyCard : PlayerName -> Country -> Game -> Game
buyCard playerName country g@(MkGame b@(MkBoard xs) players) =
  let remainingCards = lookup country xs
      playerStuff = lookup playerName players
  in
  case (playerStuff, remainingCards) of
       (Nothing, _) => g
       (_, Nothing) => g
       (_, (Just 0)) => g
       (Just ps, (Just p@(S k))) =>
          let newBoard = boardSell (country, p) k country b
              mPrice = buyPrice validPrices p
              newPlayerStuff = case mPrice of
                                    Nothing => ps
                                    (Just price) => playerBuy price country ps

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

-- checks
-- player exists
-- country exists
-- player has enough cards
sellCard : PlayerName -> Country -> Game -> Game
sellCard playerName country g@(MkGame b@(MkBoard xs) players) =
  let remainingCards = lookup country xs
      playerStuff = lookup playerName players
  in
  case (playerStuff, remainingCards) of
       (Nothing, _) => g
       (_, Nothing) => g
       ((Just ps), (Just rc)) =>
          let newBoard = boardBuy (country, rc) (S rc) country b
              mPrice = sellPrice validPrices rc
              newPlayerStuff : PlayerStuff = case mPrice of
                                    Nothing => ps
                                    (Just price) =>
                                      playerSell price country ps

          in
          MkGame newBoard $ replaceOn (playerName, ps) (playerName, newPlayerStuff) players
where
  findFirst : Eq a => a -> List a -> Maybe a
  findFirst x [] = Nothing
  findFirst x (y :: xs) =
    case x == y of
         False => findFirst x xs
         True => Just x

  playerSell : Nat -> Country -> PlayerStuff -> PlayerStuff
  playerSell k x ps@(MkPlayerStuff j ys) =
    case findFirst x ys of
         Nothing => ps
         (Just y) => MkPlayerStuff (k + j) $ deleteFirstsBy (==) ys [x]

  boardBuy : (Country, Nat) -> Nat -> Country -> Board -> Board
  boardBuy current newBalance country (MkBoard ys) =
    let new = (country, newBalance) in
    MkBoard $ replaceOn current new ys

      -- mPrice = sellPrice validPrices !remainingCards in

aBuyMove : Game -> Game
aBuyMove = buyCard (MkPlayerName "player A") (MkCountry "hungary")

aSellMove : Game -> Game
aSellMove = sellCard (MkPlayerName "player A") (MkCountry "hungary")

miniGame : Game
miniGame =
  let t1 = aBuyMove game
      t2 = aBuyMove t1
      t3 = aBuyMove t2
      t4 = aSellMove t3
  in t4

main : IO ()
main = do putStrLn $ show miniGame
