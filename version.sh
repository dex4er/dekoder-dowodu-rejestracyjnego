#!/bin/sh

version="$1"

if [ -z "$version" ]; then
  echo "$0 number"
  exit 1
fi

set -e

echo "export const version = \"$version\";" >src/version.ts

date=$(date "+%Y-%m-%d")
{
  echo "## v$version $date"
  echo ""
  echo "- UNRELEASED"
  echo ""
} >CHANGELOG.md.tmp.new
sed '2r CHANGELOG.md.tmp.new' CHANGELOG.md >CHANGELOG.md.tmp
test -s CHANGELOG.md.tmp
mv -f CHANGELOG.md.tmp CHANGELOG.md
rm -f CHANGELOG.md.tmp.new
