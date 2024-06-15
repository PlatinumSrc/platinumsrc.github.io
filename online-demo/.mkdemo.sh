#!/bin/bash

git clone --depth 1 https://github.com/PlatinumSrc/PlatinumSrc
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
            git clone "$@" tmp
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

printf '%s\n' 'defaultgame=h74' 'mods=hqsounds' 'onlinedemo=true' > engine/config.cfg

../.make.sh -j$(nproc)

cd ..
rm -rf PlatinumSrc
