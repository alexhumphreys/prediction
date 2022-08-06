CURLIE ?= curlie

run:
	PGUSER=postgres PGHOST=127.0.0.1 PGPASSWORD=admin PGDATABASE=foo PGPORT=5432 node ./build/exec/prediction

repl:
	rlwrap pack --cg node repl ./src/Server/Main.idr

.PHONY: build
build:
	npm install
	pack --cg node build ./src/Server/config.ipkg
	chmod +x ./src/Server/build/exec/prediction

clean:
	rm -r ./build

repl-spa:
	rlwrap -n pack --cg javascript repl ./src/Frontend/Main.idr

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

.PHONY: nginx
nginx:
	nginx -c $(CURDIR)/nginx/html

run-db:
	docker run -it -p 5432:5432 -v $(CURDIR)/fixtures/data.sql:/docker-entrypoint-initdb.d/data.sql:ro --name some-postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=foo -d postgres

kill-db:
	docker rm -f some-postgres

repl-db:
	pgcli --host 127.0.0.1 -u postgres -d foo

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

restart-docker-compose:
	docker rm -f some-postgres
	docker compose down
	docker compose build
	docker compose up

run-node:
	export PGUSER=postgres PGHOST=postgres PGPASSWORD=admin PGDATABASE=foo PGPORT=5432
	node ./src/Server/build/exec/prediction

local-deps-teardown:
	docker compose down
	docker rm -f some-postgres
	nginx -s stop || true

local-setup: build spa local-deps-teardown
	make run-db
	make nginx
	make run-node

watch-spa:
	./watch.sh src/Frontend "make spa"
