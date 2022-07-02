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
	json-server --watch ./db.json
