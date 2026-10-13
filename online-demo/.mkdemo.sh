#!/bin/bash

[ -z "$SKIPDL" ] && SKIPDL=0
[ -z "$ONLYDL" ] && ONLYDL=0
[ -z "$FORCEBUILD" ] && FORCEBUILD=0

if [ "$SKIPDL" -eq 0 ]; then
    B="$(curl -s https://api.github.com/repos/PlatinumSrc/PlatinumSrc/releases/latest | jq -r .tag_name)"
    A=()
    [ "$B" -a "$B" != "null" ] && A+=(-b "$B")
    git clone "${A[@]}" --depth 1 https://github.com/PlatinumSrc/PlatinumSrc
    unset A B
fi
cd PlatinumSrc

if [ "$SKIPDL" -eq 0 ]; then
    mkdir games mods
    CONFIGTEXT="onlinedemo=true"$'\n'
    evalcontent() {
        copycontent() {
            cp -r --update=none -- "$1"/games/. "$2"/games
            cp -r --update=none -- "$1"/mods/. "$2"/mods
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
                xargs bash -c 'wget -O tmp -- "$1"; mkdir -p -- "$(dirname -- "./$2")"; mv -- tmp "./$2"' bash <<< "$2"
                ;;
        esac
    }
    while IFS='' read -r l; do
        c="$(awk '{print $1;}' <<< "$l")"
        [[ -z "$c" || "$c" =~ ^#.* ]] || evalcontent "$c" "$(sed 's/^\s*\S*\s*//' <<< "$l")"
    done < ../.content.txt
    printf '%s' "$CONFIGTEXT" > internal/engine/config.cfg
fi

if [ "$ONLYDL" -eq 0 ]; then
    rm -f ../index.html ../embed.html
    [ "$FORCEBUILD" -ne 0 ] && rm -f ../.psrc.html
    make deps= CROSS=emscr LDFLAGS+=-sMINIFY_HTML=0 OUTDIR=.. BINPATH=../.psrc.html EMSCR_SHELL=../.emscr_shell.html -j$(nproc)
    cat ../.pre_index.html ../.psrc.html > ../index.html
    cat ../.pre_embed.html ../.psrc.html > ../embed.html
fi

cd ..
[ "$SKIPDL" -eq 0 -a "$ONLYDL" -eq 0 ] && rm -rf PlatinumSrc
