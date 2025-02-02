#!/bin/bash

B="$(curl -s https://api.github.com/repos/PlatinumSrc/PlatinumSrc/releases/latest | jq -r .tag_name)"
[ -z "$B" -o "$B" == "null" ] && gc() { git clone "$@"; } || gc() { git clone -b "$B" "$@"; }
gc --depth 1 https://github.com/PlatinumSrc/PlatinumSrc
unset gc B
cd PlatinumSrc

mkdir games mods
copy() {
    cp -rn tmp/games/. games
    cp -rn tmp/mods/. mods
}
download() {
    T="$1"
    shift
    case "$T" in
        git)
            git clone --depth 1 "$@" tmp
            copy
            rm -rf tmp
            ;;
        url)
            wget "$1" -O tmp
            mkdir -p -- "$(dirname -- "$2")"
            mv -- tmp "$2"
            ;;
    esac
}
while read -r l; do
    [ "$(printf '%.1s' "$l")" == '#' ] || eval "download $l"
done < ../.content.txt

printf '%s\n' 'defaultgame=h74' 'mods=hqsounds' 'onlinedemo=true' '[Renderer]' 'gl.fastclear=false' > internal/engine/config.cfg

make CROSS=emscr LDFLAGS+=-sMINIFY_HTML=0 OUTDIR=.. EMSCR_SHELL=../.emscr_shell.html -j$(nproc)

cd ..
rm -rf PlatinumSrc
