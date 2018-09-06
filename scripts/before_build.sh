#!/bin/sh

set -e

test -f www/main.js && exit 0

mkdir -p maps
rm -f maps/*.map
cp -f www/*.map maps
rm -f www/*.map
