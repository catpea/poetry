#!/usr/bin/env bash

AUDIO='src/audio';
DIST='dist';

DIST_AUDIO="${DIST}/audiobook";
DIST_VIDEO="${DIST}/audiobook";

mkdir -p $DIST_AUDIO;
mkdir -p $DIST_VIDEO;

DIST_AUDIO_INDEX="${DIST_AUDIO}/index.txt";
DIST_AUDIO_FILE="${DIST_AUDIO}/audio-part-2.mp3";
DIST_VIDEO_FILE="${DIST_VIDEO}/video-part-2.mp4";

echo $DIST_AUDIO_INDEX
echo $DIST_AUDIO_FILE;
echo $DIST_VIDEO_FILE;
ls -1 $PWD/$AUDIO/poetry-*.mp3 | grep -A1000000 poetry-0159 | sort -nr | awk '{ print "file " "\x27"$1"\x27" }' > $DIST_AUDIO_INDEX;

if [ -f $DIST_AUDIO_FILE ]; then
  rm $DIST_AUDIO_FILE; # remove old file before making a new one;
fi

ffmpeg -f concat -safe 0 -i $DIST_AUDIO_INDEX -c copy $DIST_AUDIO_FILE;
rm $DIST_AUDIO_INDEX; # remove the index file

if [ -f $DIST_VIDEO_FILE ]; then
  rm $DIST_VIDEO_FILE; # remove old file before making a new one;
fi

ffmpeg -i $DIST_AUDIO_FILE -filter_complex "[0:a]showspectrum=s=1280x720,format=yuv420p[v]" -map "[v]" -map 0:a $DIST_VIDEO_FILE;
