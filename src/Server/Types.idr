module Server.Types

import Data.Buffer
import Control.Monad.Trans
import Control.Monad.Either
import Control.Monad.Maybe
import Debug.Trace

import Data.List.Quantifiers
import Generics.Derive
import JSON

%language ElabReflection

public export
record Participant where
  constructor MkParticipant
  id : Int
  gameId : Int
  userId : Int
  money : Int

%runElab derive "Participant" [Generic, Meta, Show, Eq, RecordToJSON]

public export
record Stock where
  constructor MkStock
  id : Int
  gameId : Int
  description : String

%runElab derive "Stock" [Generic, Meta, Show, Eq, RecordToJSON]

public export
record GameStock where
  constructor MkGameStock
  id : Int
  gameId : Int
  stockId : Int
  amount : Int

%runElab derive "GameStock" [Generic, Meta, Show, Eq, RecordToJSON]

public export
record StockState where
  constructor MkStockState
  stockId : Int
  description : String
  amount : Int

%runElab derive "StockState" [Generic, Meta, Show, Eq, RecordToJSON]

public export
record GameState where
  constructor MkGameState
  id : Int
  title : String
  stockState : List StockState
  participatns : List Participant

%runElab derive "GameState" [Generic, Meta, Show, Eq, RecordToJSON]

public export
record GameShort where
  constructor MkGameShort
  id : Int
  title : String

%runElab derive "GameShort" [Generic, Meta, Show, Eq, RecordToJSON]

public export
record GamePayload where
  constructor MkGamePayload
  startingParticipantId : Int
  title : String
  stocks : List String

%runElab derive "GamePayload" [Generic, Meta, Show, Eq, RecordToJSON, RecordFromJSON]

