repl:
	rlwrap -n idris2 --find-ipkg Main.idr

clean:
	rm -r ./build
