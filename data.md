https://codereview.stackexchange.com/questions/67963/trading-card-game-database-schema-for-statistics
https://www.vertabelo.com/blog/a-database-model-for-simple-board-games/
https://www.vertabelo.com/blog/a-database-model-for-simple-board-games
https://www.vertabelo.com/blog/a-database-model-for-action-games/
https://www.vertabelo.com/blog/technical-articles/a-database-model-for-simple-board-games
https://dba.stackexchange.com/questions/34955/sql-database-structure-for-restful-api
```
Player
- name
- money
- List (card, total)
card
- description
board
- List (card, remaining)
game
- List Player
- board
```
multiple games...?
```
Participant
- gameID FK
- name
- money
card
- gameID FK
- description
participantCard
- participantID FK
- cardID FK
- total
boardCard
- boardID FK
- cardID FK
- total
board
- gameId FK
- List (card, remaining)
game
- id
- participantStartedId
- boardId
move
- gameId FK
- participantId FK
- type
- ...
```


moves: DONE
id
gameId
participantId
moveType String
payload String

participants: DONE
id
userId
gameId
money Nat

participantStocks:
id
participantId
stockId
gameId
amount Nat

boardStocks
id
gameId
stockId
amount Nat

stocks: DONE
id
description

boards: DON'T NEED?
id
gameId

games: DONE
id
startingParticipantId
title

gameParticipants: DON"T NEED?
gameId
userId

users: DONE
id
name

gameScenario:
id
