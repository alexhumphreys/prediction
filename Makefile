repl:
	rlwrap -n idris2 --find-ipkg Main.idr

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
	docker run -it -p 5432:5432 -v $(CURDIR)/fixtures/data.sql:/docker-entrypoint-initdb.d/data.sql:ro --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres

kill-db:
	docker rm -f some-postgres

docker-compose-restart:
	docker compose down
	docker compose build
	docker compose up
