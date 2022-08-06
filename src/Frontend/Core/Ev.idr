module Core.Ev

import Generics.Derive
import JSON

import Types

%default total

%language ElabReflection

public export
data Ev : Type where
  ||| Initial event
  Init'     : Ev

  ParticipantsLoaded : List Participant -> Ev
  GameLoaded : GameState -> Ev
  GamesLoaded : List GameShort -> Ev
  GameChanged : Nat -> Ev

  ||| A single item in the todo list was selected
  Selected' : Nat -> Ev

  ||| A single item in the todo list was selected
  ClickAdd' : Ev
  ClickBuy : Nat -> Ev
  ClickSell : Nat -> Ev
  ClickCreate : Ev

  ||| Error
  Err' : String -> Ev
  Info : String -> Ev

  ||| Form
  NewTitle : Ev
  NewStocks : Ev

%runElab derive "Ev" [Generic,Meta,Show,Eq]
