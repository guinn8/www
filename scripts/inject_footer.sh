#!/bin/bash

# Get the latest commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)

# Replace the placeholder in the HTML with the actual commit hash
sed -i "s/id=\"commit-hash\">N\/A/id=\"commit-hash\">$COMMIT_HASH/g" index.html

echo "Commit hash $COMMIT_HASH injected into index.html"
