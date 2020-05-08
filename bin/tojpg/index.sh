#!/usr/bin/env bash

find ./db -type f -name '*.png' -exec mogrify -format jpg -quality 100 {} + -exec rm {} +
