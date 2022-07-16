repl:
	rlwrap pack --with-ipkg config.ipkg --cg node repl ./src/Server/Main.idr

clean:
	rm -r ./build

repl-spa:
	rlwrap -n pack --with-ipkg ./src/Frontend/config.ipkg --cg javascript repl ./src/Frontend/Main.idr

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
	docker run -it -p 5432:5432 -v $(CURDIR)/fixtures/data.sql:/docker-entrypoint-initdb.d/data.sql:ro --name some-postgres -e POSTGRES_PASSWORD=admin -d postgres

kill-db:
	docker rm -f some-postgres

repl-db:
	pgcli --host 127.0.0.1 -u postgres -d foo

do-requests:
	curlie -j POST :3000/games/newGame startingParticipantId:=1 title="another game" stocks:='["sweden", "ireland", "france"]'
	@echo
	curlie :3000/games

restart-docker-compose:
	docker compose down
	docker compose build
	docker compose up
