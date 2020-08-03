#!/usr/bin/env bash

echo Converting Markdown Document to JSON Feed
./bin/build/feed.mjs;

echo Creating a CSS Stylesheet
# ./bin/build/css.mjs;

echo Generating HTML Pages
# ./bin/build/html.mjs;

# AUDIO='db/audio';
# TARGET=$AUDIO/all.mp3;
# ls -1 -d $AUDIO/poetry-*.mp3 | sort -nr | awk '{ print "file " "\x27"$1"\x27" }' > mp3list.tmp
# rm $TARGET;
# ffmpeg -f concat -safe 0 -i mp3list.tmp -c copy $AUDIO/all.mp3
# rm mp3list.tmp;
