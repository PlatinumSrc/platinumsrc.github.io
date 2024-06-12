#!/bin/bash
LOC="$(dirname -- "${BASH_SOURCE[0]}")"
make CROSS=emscr LDFLAGS+=-sMINIFY_HTML=0 OUTDIR="$LOC" EMSCR_SHELL="$LOC/.emscr_shell.html" "$@"
