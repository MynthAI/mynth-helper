#!/usr/bin/env bash

if ! which pandoc >/dev/null; then
  echo "pandoc is not installed"
  exit 1
fi

BASE=$(node -e "console.log(require('app-root-path').path)")

function format {
  for file in $(find "$BASE" -name "*.md" ! -path "*/node_modules/*" ! -path "*/build/*")
  do
    pandoc "$file" -t gfm -o "${file%.md}.md"
  done
}

function check {
  find "$BASE" -name "*.md" ! -path "*/node_modules/*" ! -path "*/build/*" -print0 \
    | while IFS= read -r -d '' file
  do
    echo "Validating $file"
    pandoc "$file" -t gfm -o TEMP.md
    diff "$file" TEMP.md > diff.txt

    if [ -s diff.txt ]; then
      echo "$file needs to be formatted. Run:"
      echo "pandoc $file -t gfm -o $file"
      rm TEMP.md diff.txt
      exit 1
    fi

    rm TEMP.md diff.txt
  done
}

if [ "$1" == "--check" ]; then
  check
else
  format
fi
