#!/usr/bin/env bash

# find ./db/image -type f -name '*.jpg' -exec mogrify -format jpg -quality 100 {} + -exec rm {} +

# find ./db/image -type f -name '*.jpg' -exec echo {} +

# find ./db/image -type f -name '*.jpg' -exec sh -c 'echo "$1" "${1%.jpg}-sm.jpg"' _ {} \;

find ./db/image -type f -name 'poetry-*.jpg' -exec sh -c './bin/resize/magick.sh "$1"' _ {} \;
