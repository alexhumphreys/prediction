module Main

import Rhone.JS
import Control.Applicative.Syntax
import Data.List1
import Data.String
import Data.MSF.Switch
import Text.CSS
import Generics.Derive
import JSON

import Types
import Core.Ev

%default total

%language ElabReflection

server : String
server = "localhost:8080"

record FetchResponse where
  constructor MkFetchResponse
  url : Nat
  status : Nat
  statusText : String
  redirected : Bool
  ok : Bool

%runElab derive "FetchResponse" [Generic, Meta, Show, RecordToJSON, RecordFromJSON]

%foreign """
browser:lambda:(url,h,w,e,y)=>{
  fetch(url)
    .then(response => {
       if (!response.ok) {
        w(JSON.stringify({
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          redirected: response.redirected,
          ok: response.ok,
        }))(e);
        throw new Error('Network response was not OK');
       } else {
         return response.json();
       }
    })
    .then(json => {
      h(JSON.stringify(json))(e);
    })
    .catch(error => {
      w(error.message)(e)
      console.error(error)
    })
}
"""
prim__fetch : String -> (String -> IO ()) -> (String -> IO ()) -> PrimIO ()

%foreign """
browser:lambda:(url,body,h,w,e,y)=>{
  fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
       if (!response.ok) {
        w(JSON.stringify({
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          redirected: response.redirected,
          ok: response.ok,
        }))(e);
        throw new Error('Network response was not OK');
       } else {
         return response.json();
       }
    })
    .then(json => {
      h(JSON.stringify(json))(e);
    })
    .catch(error => {
      w(error.message)(e)
      console.error(error)
    })
}
"""
prim__fetchpost : String -> String -> (String -> IO ()) -> (String -> IO ()) -> PrimIO ()

fetch : HasIO io => String -> (String -> JSIO ()) -> (String -> JSIO ()) -> io ()
fetch url run err = primIO $ prim__fetch url (runJS . run) (runJS . err)

fetchPost : HasIO io => ToJSON x => String -> x -> (String -> JSIO ()) -> (String -> JSIO ()) -> io ()
fetchPost url body run err = primIO $ prim__fetchpost url (encode body) (runJS . run) (runJS . err)

-- wait n milliseconds before running the given action
%foreign "browser:lambda:(n,h,w)=>setTimeout(() => h(w),n)"
prim__setTimeout : Bits32 -> IO () -> PrimIO ()

setTimeout' : HasIO io => Bits32 -> JSIO () -> io ()
setTimeout' millis run = primIO $ prim__setTimeout millis (runJS run)

-- wait n milliseconds before running the given action
setTimeout : HasIO io => Nat -> JSIO () -> io ()
setTimeout n run = setTimeout' (cast n) run

appStyle : ElemRef HTMLStyleElement
appStyle = Id Style "appstyle"

public export
contentDiv : ElemRef HTMLBodyElement
contentDiv = Id Body "content"

aPrefix : String
aPrefix = "somePrefix"

out : ElemRef HTMLDivElement
out = Id Div "\{aPrefix}_out"

errorDiv : ElemRef HTMLDivElement
errorDiv = Id Div "\{aPrefix}_errorDiv"

infoDiv : ElemRef HTMLDivElement
infoDiv = Id Div "\{aPrefix}_infoDiv"

createGameDiv : ElemRef HTMLDivElement
createGameDiv = Id Div "\{aPrefix}_createGame"

createFooDiv : ElemRef HTMLDivElement
createFooDiv = Id Div "\{aPrefix}_createFooDiv"

userDiv : ElemRef HTMLDivElement
userDiv = Id Div "\{aPrefix}_user"

btn : ElemRef HTMLButtonElement
btn = Id Button "my_button"

coreCSS : List (Rule 1)
coreCSS =
  [ elem Html !! [ Height .= perc 100]
  , class "l-flex" !! [Display .= Flex]
  , class "l-flex-row" !! [FlexDirection .= Row]
  , class "l-flex-column" !! [FlexDirection .= Column]
  , class "l-flex-grow1" !! [FlexGrow .= 1]
  , class "l-flex-flow-row" !! [FlexFlow .= [Row]]
  ]

allRules : String
allRules = fastUnlines . map Text.CSS.Render.render
         $ coreCSS

record User where
  constructor MkUser
  id   : Nat
  name : String
  username : String
  email : String

%runElab derive "User" [Generic, Meta, Show, Eq, RecordToJSON, RecordFromJSON]

M' : Type -> Type
M' = DomIO Ev JSIO

fireEv' : Nat -> Ev -> M' ()
fireEv' n ev = do
  h <- handler <$> env
  setTimeout n (h ev)
  pure ()

||| fire off random Ev
fireEv : Ev -> M' ()
fireEv ev = fireEv' 0 ev

handleError : String -> Ev
handleError str =
  case decode {a=FetchResponse} str of
       (Left x) =>  Err' "Fetch err: \{str}"
       (Right x) => Err' "Fetch err: \{show x}"

parseType : FromJSON t => String -> (t -> Ev) -> Ev
parseType str ev =
  case decode {a=t} str of
       (Left x) => Err' "failed to parse json: \{str}"
       (Right x) => ev x

data ReqMethod : Type where
  GetReq : ReqMethod
  PostReq : ToJSON t => t -> ReqMethod

errorF : (Ev -> EitherT JSErr IO ()) -> (String -> EitherT JSErr IO ())
errorF h = \e => h $ handleError e

fetchForget : ReqMethod -> String -> M' ()
fetchForget method url = do
    h <- handler <$> env
    case method of
         GetReq =>
            ignore $ fetch url (forget h "get request: \{url}") (errorF h)
         (PostReq x) =>
            ignore $ fetchPost url x (forget h "post request: \{url}") (errorF h)
where
  forget : (Ev -> EitherT JSErr IO ()) -> String -> (String -> JSIO ())
  forget h str = (\s => h (Info str))

fetchParseEvent : FromJSON t => ReqMethod -> String -> (t -> Ev) -> M' ()
fetchParseEvent method url ev = do
    h <- handler <$> env
    case method of
         GetReq =>
            ignore $ fetch url (\s => h (parseType {t=t} s ev)) (errorF h)
         (PostReq x) =>
            ignore $ fetchPost url x (\s => h (parseType {t=t} s ev)) (errorF h)

loadGame : MSF M' (NP I [Nat]) ()
loadGame = do
  arrM $ \[i] => do
    ignore $ fetchParseEvent GetReq {t=GameState} "http://\{server}/games/\{show i}" GameLoaded

loadGames : MSF M' _ ()
loadGames = do
  arrM $ \_ => do
    ignore $ fetchParseEvent GetReq {t=List GameShort} "http://\{server}/games" GamesLoaded

onGameChanged : MSF M' (NP I [Nat]) ()
onGameChanged = arrM (\[i] => do
  fetchParseEvent GetReq {t=GameState} "http://\{server}/games/\{show i}" GameLoaded)
  >>> loadGames

-- below, I define some dummy MSFs for handling each of the
-- events in question:
onInit : MSF M' (NP I []) ()
onInit = arrM $ \_ => do
  fetchParseEvent GetReq {t=List GameShort} "http://\{server}/games" GamesLoaded
  fetchParseEvent GetReq {t=GameState} "http://\{server}/games/1" GameLoaded

renderJson : ToJSON x => x -> Node Ev
renderJson y = let json = encode y in
  div []
    [Text json]

renderListJson : ToJSON x => List x -> Node Ev
renderListJson y = let ls = map encode y in
  div [] $ map (\s => div [] [Text s]) ls

listMoveDiv : ElemRef HTMLDivElement
listMoveDiv = Id Div "\{aPrefix}_listMove"

onMovesLoaded : MSF M' (NP I [List Move]) ()
onMovesLoaded = do
  arrM $ \[ms] => do
    innerHtmlAt listMoveDiv $ renderListJson ms

listParticipantDiv : ElemRef HTMLDivElement
listParticipantDiv = Id Div "\{aPrefix}_listParticipant"

onParticipantsLoaded : MSF M' (NP I [List Participant]) ()
onParticipantsLoaded = do
  arrM $ \[ms] => do
    innerHtmlAt listParticipantDiv $ renderListJson ms

listGamesDiv : ElemRef HTMLDivElement
listGamesDiv = Id Div "\{aPrefix}_listGames"

onGamesLoaded : MSF M' (NP I [List GameShort]) ()
onGamesLoaded = do
  arrM $ \[gs] => do
    innerHtmlAt listGamesDiv $ renderGames gs
where
  renderGameShort : GameShort -> Node Ev
  renderGameShort (MkGameShort id title) =
    div [onClick $ Selected' $ cast id]
      [ Text $ show id
      , Text $ title
      ]
  renderGames : List GameShort -> Node Ev
  renderGames ls =
    div [] $ map renderGameShort ls

gameDiv : ElemRef HTMLDivElement
gameDiv = Id Div "\{aPrefix}_game"

onGameLoaded : MSF M' (NP I [GameState]) ()
onGameLoaded = do
  arrM $ \[game] => do
    innerHtmlAt gameDiv gameContainer
    innerHtmlAt gameStateDiv $ renderGameState $ game
    -- innerHtmlAt boardDiv $ renderBoard $ board game
    -- innerHtmlAt participantsDiv' $ renderParticipants $ participants game
    -- innerHtmlAt cardsDiv $ renderCards $ cards $ board game
where
  gameStateDiv : ElemRef HTMLDivElement
  gameStateDiv = Id Div "\{aPrefix}_gameState"
  boardDiv : ElemRef HTMLDivElement
  boardDiv = Id Div "\{aPrefix}_board"
  participantsDiv' : ElemRef HTMLDivElement
  participantsDiv' = Id Div "\{aPrefix}_participants"
  cardsDiv : ElemRef HTMLDivElement
  cardsDiv = Id Div "\{aPrefix}_cards"
  gameContainer : Node Ev
  gameContainer =
    div [classes ["game", "l-flex"]]
      [ div [ref boardDiv] []
      , div [ref gameStateDiv] []
      , div [ref participantsDiv'] []
      , div [] []
      ]
  btnBuy : Nat -> ElemRef HTMLButtonElement
  btnBuy n = Id Button "\{aPrefix}_buyCard\{show n}"
  btnSell : Nat -> ElemRef HTMLButtonElement
  btnSell n = Id Button "\{aPrefix}_sellCard\{show n}"
  renderStockState : StockState -> List $ Node Ev
  renderStockState (MkStockState stockId description amount) =
    [ div [] [ Text $ show stockId]
    , div [] [ Text $ description]
    , div [] [ Text $ show amount]
    , button [ref $ btnBuy $ cast stockId, onClick $ ClickBuy $ cast stockId] ["Buy"]
    , button [ref $ btnSell $ cast stockId, onClick $ ClickSell $ cast stockId] ["Sell"]
    ]
  renderParticipants : List Participant -> Node Ev
  renderParticipants ls = renderListJson ls
  renderGameState : GameState -> Node Ev
  renderGameState (MkGameState id title stocks participants) =
    div [classes ["l-flex", "l-flex-row", "l-flex-flow-row"]]
      [ div [classes ["l-flex", "l-flex-grow1"]] [ div [] [Text $ show id], div [] [Text title]]
      , div [classes ["l-flex", "l-flex-column", "l-flex-grow1"]]
        $ map (\s => div [classes ["l-flex", "l-flex-row", "l-flex-grow1"]] $ renderStockState s) stocks
      , div [classes ["l-flex", "l-flex-grow1"]] [ renderParticipants participants]
      ]

onUserLoaded : MSF M' (NP I [User]) ()
onUserLoaded = arrM $ (\[u] => innerHtmlAt userDiv $ renderUser u)
where
  renderUser : User -> Node Ev
  renderUser u = div []
    [Text $ User.name u, Text $ username u, Text $ email u]

onSelected : MSF M' (NP I [Nat]) ()
onSelected = arrM $ \[n] =>
  fetchParseEvent GetReq {t=GameState} "http://\{server}/games/\{show n}" GameLoaded

onErr : MSF M' (NP I [String]) ()
onErr = arrM $ \[s] => innerHtmlAt errorDiv $ renderErr' s
where
  renderErr' : String -> Node Ev
  renderErr' x = div [] [Text x]

onInfo : MSF M' (NP I [String]) ()
onInfo = arrM $ \[s] => innerHtmlAt errorDiv $ renderInfo s
where
  renderInfo : String -> Node Ev
  renderInfo x = div [] [Text x]

txtTitle : ElemRef HTMLInputElement
txtTitle = Id Input "\{aPrefix}_newTitle"

txtStocks : ElemRef HTMLInputElement
txtStocks = Id Input "\{aPrefix}_newStocks"

onClickAdd : MSF M' (NP I []) ()
onClickAdd = arrM $ \_ => do
  innerHtmlAt createGameDiv renderForm
where
  btnCreate : ElemRef HTMLButtonElement
  btnCreate = Id Button "\{aPrefix}_createGameButton"
  lbl : (text: String) -> (class : String) -> Node ev
  lbl txt cl = label [] [Text txt]

  renderForm : Node Ev
  renderForm =
    div []
      [ lbl "Title:" ""
      , input [ ref txtTitle
              , placeholder "game title"
              ] []
      , lbl "Title:" ""
      , input [ ref txtStocks
              , placeholder "comma separated stocks"
              ] []
      , button [ref btnCreate, onClick ClickCreate] ["Create Game"]
      ]

read' : String -> Either String String
read' "" = Left "Empty title string"
read' s = Right s

readList : String -> Either String (List String)
readList "" = Left "Empty stocks string"
readList s = Right [s]

readAll : MSF M' (NP_ Type I []) (Either String GamePayload)
readAll = MkGamePayload 1
  <$$> getInput [] read' txtTitle
  <**> getInput [] readList txtStocks

onClickCreate : MSF M' (NP_ Type I []) ()
onClickCreate = readAll >>> postGame >>> clearForm
where
  postGame : MSF M' (Either String GamePayload) ()
  postGame = arrM $ \x => do
  case x of
       (Left y) => fireEv (Err' y)
       (Right y) => do
         fetchParseEvent (PostReq y) {t=Nat} "http://\{server}/games/newGame" GameChanged
  clearForm : MSF M' _ ()
  clearForm = arrM $ \_ => do innerHtmlAt createGameDiv $ div [] []
  reloadGames : MSF M' _ ()
  reloadGames = do
    arrM $ \_ => do
      ignore $ fetchParseEvent GetReq {t=List GameShort} "http://\{server}/games" GamesLoaded

-- fetchParseEvent {a=List Move} "http://localhost:3000/moves" MovesLoaded
postMove : ToJSON t => String -> t -> M' ()
postMove url body = do
    h <- handler <$> env
    fetchPost url body (\s => h Init') (\e => h (handleError e))
    pure ()

{-
onGameChanged : MSF M' (NP I [Nat]) ()
onGameChanged = arrM (\[i] => do
  fetchParseEvent GetReq {t=GameState} "http://\{server}/games/\{show i}" GameLoaded)
  >>> loadGames
  -}

onClickBuy : MSF M' (NP I [Nat]) ()
onClickBuy = arrM $ \[n] => do
  fetchForget (PostReq (MkMovePayload 1 1 "buy" (cast n))) "http://\{server}/moves"
  fireEv (GameChanged 1)

onClickSell : MSF M' (NP I [Nat]) ()
onClickSell = arrM $ \[n] => do
  fetchForget (PostReq (MkMovePayload 1 1 "sell" (cast n))) "http://\{server}/moves"
  fireEv (GameChanged 1)

sf : MSF M' Ev ()
sf = toI . unSOP . from ^>> collect [ onInit
                                    -- , onMovesLoaded
                                    , onParticipantsLoaded
                                    , onGameLoaded
                                    , onGamesLoaded
                                    , onGameChanged
                                    , onSelected
                                    , onClickAdd
                                    , onClickBuy
                                    , onClickSell
                                    , onClickCreate
                                    , onErr
                                    , onInfo
                                    ]

content' : Node Ev
content' =
  div []
    [ div [] ["content2"]
    , div [ref out] []
    , div [ref errorDiv] []
    , div [ref infoDiv] []
    , div [class "l-flex"]
      [ div [ref gameDiv] []
      , div [ref listMoveDiv, class "game-moves"] []
      ]
    , div [ref listGamesDiv] []
    , div [ref createGameDiv] []
    , button [ ref btn, onClick ClickAdd'] [ "Open create game" ]
    ]

ui' : M' (MSF M' Ev (), JSIO ())
ui' = do
  rawInnerHtmlAt appStyle allRules
  innerHtmlAt contentDiv content'

  pure(sf, pure ())

main : IO ()
main = runJS . ignore $ reactimateDomIni Init' aPrefix ui'
