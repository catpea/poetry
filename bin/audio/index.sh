#!/usr/bin/env bash

AUDIO='db/audio';
TARGET=$AUDIO/all.mp3;
ls -1 -d $AUDIO/poetry-*.mp3 | sort -nr | awk '{ print "file " "\x27"$1"\x27" }' > mp3list.tmp
rm $TARGET;
ffmpeg -f concat -safe 0 -i mp3list.tmp -c copy $AUDIO/all.mp3
rm mp3list.tmp;
