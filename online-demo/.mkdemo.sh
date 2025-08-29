#!/bin/bash

B="$(curl -s https://api.github.com/repos/PlatinumSrc/PlatinumSrc/releases/latest | jq -r .tag_name)"
[ -z "$B" -o "$B" == "null" ] && gc() { git clone "$@"; } || gc() { git clone -b "$B" "$@"; }
gc --depth 1 https://github.com/PlatinumSrc/PlatinumSrc
unset gc B
cd PlatinumSrc

mkdir games mods
CONFIGTEXT="onlinedemo=true"$'\n'
evalcontent() {
    copycontent() {
        cp -rn "$1"/games/. "$2"/games
        cp -rn "$1"/mods/. "$2"/mods
    }
    case "$1" in
        cfg)
            CONFIGTEXT+="$2"$'\n'
            ;;
        git)
            xargs bash -c 'git clone --depth 1 "$@" tmp' bash <<< "$2"
            copycontent tmp .
            rm -rf tmp
            ;;
        url)
            xargs bash -c 'P="./$(realpath -sm -- "$2")"; wget -O tmp -- "$1"; mkdir -p -- "$(dirname -- "$P")"; mv -- tmp "$P"' bash <<< "$2"
            ;;
    esac
}
while IFS='' read -r l; do
    c="$(awk '{print $1;}' <<< "$l")"
    [[ -z "$c" || "$c" =~ ^#.* ]] || evalcontent "$c" "$(sed 's/^\s*\S*\s*//' <<< "$l")"
done < ../.content.txt
printf '%s' "$CONFIGTEXT" > internal/engine/config.cfg

make CROSS=emscr LDFLAGS+=-sMINIFY_HTML=0 OUTDIR=.. EMSCR_SHELL=../.emscr_shell.html -j$(nproc)

cd ..
rm -rf PlatinumSrc
