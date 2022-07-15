-- from https://www.educba.com/postgresql-select/

-- startingParticipantId INT NOT NULL REFERENCES participants(id),
CREATE TABLE IF NOT EXISTS games
(id SERIAL PRIMARY KEY,
title VARCHAR NOT NULL);

CREATE TABLE IF NOT EXISTS stocks
(id SERIAL PRIMARY KEY,
gameId INT NOT NULL REFERENCES games(id),
description VARCHAR NOT NULL);

CREATE TABLE IF NOT EXISTS users
(id SERIAL PRIMARY KEY,
name VARCHAR NOT NULL);

CREATE TABLE IF NOT EXISTS participants
(id SERIAL PRIMARY KEY,
gameId INT NOT NULL REFERENCES games(id),
userId INT NOT NULL REFERENCES users(id),
money INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS boardStocks
(id SERIAL PRIMARY KEY,
gameId INT NOT NULL REFERENCES games(id),
stockId INT NOT NULL REFERENCES stocks(id),
amount INT NOT NULL);

CREATE TABLE IF NOT EXISTS moves
(id SERIAL PRIMARY KEY,
gameId INT NOT NULL REFERENCES games(id),
participantId INT NOT NULL REFERENCES participants(id),
moveType VARCHAR NOT NULL,
payload VARCHAR NOT NULL);

INSERT INTO users(name) VALUES ('alice');
INSERT INTO users(name) VALUES ('bob');
