#!/bin/sh

set -e

rm -rf maps

test -f www/main.js && exit 0

mkdir maps
cp -f www/*.map maps
rm -f www/*.map
