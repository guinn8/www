#!/bin/bash

# List of files to check (you can filter by extension)
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|css|html)$')

for FILE in $FILES; do
  # Get the first line of the file
  FIRST_LINE=$(head -n 1 "$FILE")

  # Get the filename
  FILENAME=$(basename "$FILE")
  EXT="${FILENAME##*.}"

  EXPECTED_PREFIX="FILENAME:"

  case "$EXT" in
    js)
      EXPECTED_COMMENT="// $EXPECTED_PREFIX $FILENAME"
      ;;
    css)
      EXPECTED_COMMENT="/* $EXPECTED_PREFIX $FILENAME */"
      ;;
    html)
      EXPECTED_COMMENT="<!-- $EXPECTED_PREFIX $FILENAME -->"
      ;;
    *)
      continue
      ;;
  esac

  # If the first line does not contain the expected prefix, add the comment
  if [[ "$FIRST_LINE" != *"$EXPECTED_PREFIX"* ]]; then
    echo "Adding filename comment to $FILE"
    # Create a temporary file with the comment and a newline prepended
    (echo -e "$EXPECTED_COMMENT\n"; cat "$FILE") > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"

    # Stage the updated file
    git add "$FILE"
  fi
done

exit 0
