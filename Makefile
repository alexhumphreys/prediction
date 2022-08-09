CURLIE ?= curlie

.PHONY: build
build:
	npm install
	pack --cg node build ./src/Server/config.ipkg
	chmod +x ./src/Server/build/exec/prediction

run:
	PGUSER=postgres PGHOST=127.0.0.1 PGPASSWORD=admin PGDATABASE=foo PGPORT=5432 node ./build/exec/prediction

run-db:
	docker run -it -p 5432:5432 -v $(CURDIR)/fixtures/data.sql:/docker-entrypoint-initdb.d/data.sql:ro --name some-postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=foo -d postgres

run-node:
	export PGUSER=postgres PGHOST=postgres PGPASSWORD=admin PGDATABASE=foo PGPORT=5432
	node ./src/Server/build/exec/prediction

run-nginx:
	nginx -c $(CURDIR)/nginx/html

repl:
	rlwrap pack --cg node repl ./src/Server/Main.idr

repl-shared:
	rlwrap pack --cg node repl ./src/Shared/Types.idr

repl-spa:
	rlwrap -n pack --cg javascript repl ./src/Frontend/Main.idr

repl-db:
	pgcli --host 127.0.0.1 -u postgres -d foo

clean:
	rm -r ./build

server:
	pack --cg node build ./config.ipkg

spa:
	pack build ./src/Frontend/config.ipkg
	mkdir -p static/js
	cp ./src/Frontend/build/exec/spa.js static/js/spa.js

open-frontend:
	open ./static/index.html

json-server:
	json-server -p 4000 --watch ./db.json

kill-db:
	docker rm -f some-postgres

curl:
	$(CURLIE) --retry-connrefused \
		--retry 5 \
		--retry 3 \
      --retry-max-time 30 \
		-j POST :3000/games/newGame \
		startingParticipantId:=1 title="another game" stocks:='["sweden", "ireland", "france"]'
	@echo
	@echo
	$(CURLIE) :3000/games
	@echo
	@echo
	$(CURLIE) :3000/games/1
	@echo
	@echo
	$(CURLIE) -J POST :3000/moves \
		gameId:=1 participantId:=1 moveType="buy" stockId:=1

restart-docker-compose:
	docker rm -f some-postgres
	docker compose down
	docker compose build
	docker compose up

local-deps-teardown:
	docker compose down
	docker rm -f some-postgres
	nginx -s stop || true

local-setup: build spa local-deps-teardown
	make run-db
	make run-nginx
	make run-node

watch-spa:
	./watch.sh src/Frontend "make spa"
