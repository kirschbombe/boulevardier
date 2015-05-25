#!/usr/bin/env bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
pushd .

cd "$DIR/../.."
export DISPLAYNO=99
export SCREENNO=0
export DISPLAY=":$DISPLAYNO.$SCREENNO"
export FIREFOX_BIN=/usr/bin/firefox
sh -e /etc/init.d/xvfb start 1>/dev/null 2>&1
./node_modules/karma/bin/karma start --single-run

popd
