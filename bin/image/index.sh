#!/usr/bin/env bash

# convert png to jpg
find ./src/image -type f -name '*.png' -exec mogrify -format jpg -quality 100 {} + -exec rm {} +

# resize
find ./src/image -type f -name 'poetry-*.jpg' -exec sh -c './bin/image/resize.sh "$1"' _ {} \;
