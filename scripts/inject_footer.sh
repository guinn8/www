#!/bin/bash

CURRENT_DATE=$(date +"%b. %d, %Y - %H:%M:%S")
if [ -f "index.html" ]; then
    sed -i "s/id=\"footer-date\">[^<]*/id=\"footer-date\">$CURRENT_DATE/" index.html
    git add index.html
else
    echo "index.html not found."
    exit 1
fi
