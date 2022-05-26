module Main
import Data.Fin
import Data.List
import Data.List1
import Data.List.Elem
import Data.SortedMap

data Country = MkCountry String
Eq Country where
  (==) (MkCountry x) (MkCountry y) = x == y
Show Country where
  show x = ?foo1
Ord Country where
  (<) (MkCountry x) (MkCountry y) = x < y

data Board = MkBoard (SortedMap Country Nat)
Show Board where
  show x = ?foo2

data PlayerName = MkPlayerName String
Eq PlayerName where
  (==) (MkPlayerName x) (MkPlayerName y) = x == y
Show PlayerName where
  show x = ?foo3
Ord PlayerName where
  (<) (MkPlayerName x) (MkPlayerName y) = x < y

data PlayerStuff = MkPlayerStuff Nat (SortedMap Country Nat)
Eq PlayerStuff where
  (==) (MkPlayerStuff x w) (MkPlayerStuff y z) = x == y && w == z
Show PlayerStuff where
  show x = ?foo4

Players : Type
Players = SortedMap PlayerName PlayerStuff

data Game = MkGame Board Players
Show Game where
  show x = ?foo5

data Action
  = Buy PlayerName Country
  | Sell PlayerName Country

validPrices : List Nat
validPrices = [5, 10, 30, 50, 80, 90, 100]

sellPrice : List Nat -> Nat -> Either String Nat
sellPrice xs k = go (reverse xs) k
where
  go : List Nat -> Nat -> Either String Nat
  go [] k = Left "No sell price available"
  go (x :: xs) 0 = pure x
  go (x :: xs) (S k) = go xs k

buyPrice : List Nat -> Nat -> Either String Nat
buyPrice xs 0 = Left "No buy price available"
buyPrice xs (S k) = go (reverse xs) (k)
where
  go : List Nat -> Nat -> Either String Nat
  go [] k = Left "No buy price available"
  go (x :: xs) 0 = pure x
  go (x :: xs) (S k) = go xs k

board : Board
board = MkBoard $ fromList [(MkCountry "canada", 7), (MkCountry "hungary", 7)]

players : Players
players = fromList
  [ ((MkPlayerName "player A"), (MkPlayerStuff 100 $ fromList []))
  , ((MkPlayerName "player B"), (MkPlayerStuff 100 $ fromList []))]

game : Game
game = MkGame board players

playerExists : PlayerName -> Game -> Either String PlayerStuff
playerExists x (MkGame _ players) =
  case lookup x players of
       Nothing => Left "Player \{show x} not in game"
       (Just ps) => pure ps

countryExists : Country -> Game -> Either String Nat
countryExists x (MkGame (MkBoard countries) _) =
  case lookup x countries of
       Nothing => Left "Country \{show x} not in game"
       (Just cardsRemaining) => pure cardsRemaining

playerHasEnoughFunds : Nat -> PlayerStuff -> Either String ()
playerHasEnoughFunds price (MkPlayerStuff k _) =
  case k > price of
       True => pure ()
       False => Left "Player does not have enough cash"

boardHasEnoughCards : Country -> Board -> Either String Nat
boardHasEnoughCards x (MkBoard cs) =
  let errorMsg = Left "Board does not have any country \{show x}"
  in
  case lookup x cs of
       Nothing => errorMsg
       (Just 0) => errorMsg
       (Just leftOnBoard@(S j)) => pure leftOnBoard

playerHasEnoughCards : Country -> PlayerStuff -> Either String Nat
playerHasEnoughCards x (MkPlayerStuff k xs) =
  let errorMsg = Left "Player does not have any country \{show x}"
  in
  case lookup x xs of
       Nothing => errorMsg
       (Just 0) => errorMsg
       (Just playerOwned@(S j)) => pure playerOwned

data Increment = Add | Substract

adjustPlayerCards : Increment -> Country -> SortedMap Country Nat -> SortedMap Country Nat
adjustPlayerCards i x cs =
  case i of
       Add => go (+)
       Substract => go (minus)
where
  go : (Nat -> Nat -> Nat) -> SortedMap Country Nat
  go fun = mergeWith fun cs $ fromList [(x, 1)]

takeCard : Country -> SortedMap Country Nat -> SortedMap Country Nat
takeCard = adjustPlayerCards Substract

giveCard : Country -> SortedMap Country Nat -> SortedMap Country Nat
giveCard = adjustPlayerCards Add

buyCard : PlayerName -> Country -> Game
          -> Either String Game
buyCard pn c g@(MkGame b@(MkBoard bs) pl) = do
  ps <- playerExists pn g
  cardsRemaining <- countryExists c g
  _ <- boardHasEnoughCards c b
  curPrice <- buyPrice validPrices cardsRemaining
  playerHasEnoughFunds curPrice ps
  pure $ doBuy curPrice c ps g
where
  -- take money from player
  -- give card to player
  -- take card from board
  doBuy : Nat -> Country -> PlayerStuff -> Game -> Game
  doBuy price x (MkPlayerStuff k cs) (MkGame (MkBoard b) w) =
    let newPlayerStuff = MkPlayerStuff (minus k price) $ giveCard c cs
        newBoard = MkBoard $ takeCard c b
    in
    MkGame newBoard $ insert pn newPlayerStuff pl

sellCard : PlayerName -> Country -> Game
          -> Either String Game
sellCard pn c g = do
  ps <- playerExists pn g
  cardsRemaining <- countryExists c g
  curPrice <- sellPrice validPrices cardsRemaining
  playerCards <- playerHasEnoughCards c ps
  pure $ doSale curPrice c ps g
where
  -- give money to player
  -- take card from player
  -- give card to board
  doSale : Nat -> Country -> PlayerStuff -> Game -> Game
  doSale price c ps@(MkPlayerStuff k cs) (MkGame (MkBoard b) pl) =
    let newPlayerStuff = MkPlayerStuff (k + price) $ takeCard c cs
        newBoard = MkBoard $ giveCard c b
    in
    MkGame newBoard $ insert pn newPlayerStuff pl

buy : Game -> Either String Game
buy = buyCard (MkPlayerName "player A") (MkCountry "hungary")

sell : Game -> Either String Game
sell = sellCard (MkPlayerName "player A") (MkCountry "hungary")

minigame : Either String Game
minigame =
  let moves =
    [buy, buy, sell]
  in foldlM {m=Either String} (\a,fun => fun a) game moves

main : IO ()
main = do putStrLn $ show minigame
