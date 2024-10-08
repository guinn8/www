#!/bin/bash

# List of files to check (you can filter by extension)
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|css|html)$')

for FILE in $FILES; do
  # Get the first line of the file
  FIRST_LINE=$(head -n 1 "$FILE")

  # Get the filename
  FILENAME=$(basename "$FILE")
  EXT="${FILENAME##*.}"

  case "$EXT" in
    js)
      EXPECTED_COMMENT="// $FILENAME"
      ;;
    css)
      EXPECTED_COMMENT="/* $FILENAME */"
      ;;
    html)
      EXPECTED_COMMENT="<!-- $FILENAME -->"
      ;;
    *)
      continue
      ;;
  esac

  # If the first line does not contain the filename as a comment, add it
  if [[ "$FIRST_LINE" != "$EXPECTED_COMMENT" ]]; then
    echo "Adding filename comment to $FILE"
    # Create a temporary file with the comment prepended
    (echo "$EXPECTED_COMMENT"; cat "$FILE") > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"

    # Stage the updated file
    git add "$FILE"
  fi
done

exit 0
