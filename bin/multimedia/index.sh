#!/usr/bin/env bash

AUDIO='db/audio';
DIST='dist';

DIST_AUDIO="${DIST}/audio";
DIST_VIDEO="${DIST}/video";

DIST_AUDIO_INDEX="${DIST_AUDIO}/index.txt";
DIST_AUDIO_FILE="${DIST_AUDIO}/audio.mp3";
DIST_VIDEO_FILE="${DIST_VIDEO}/video.mp4";

# echo $DIST_AUDIO_FILE;
# echo $DIST_VIDEO_FILE;

ls -1 -d $AUDIO/poetry-*.mp3 | sort -nr | awk '{ print "file " "\x27"$1"\x27" }' > $DIST_AUDIO_INDEX;
rm $DIST_AUDIO_FILE; # remove old file before making a new one;
ffmpeg -f concat -safe 0 -i $DIST_AUDIO_INDEX -c copy $DIST_AUDIO_FILE;
rm $DIST_AUDIO_INDEX; # remove the index file?
ffmpeg -i $DIST_AUDIO_FILE -filter_complex "[0:a]showspectrum=s=1280x720,format=yuv420p[v]" -map "[v]" -map 0:a $DIST_VIDEO_FILE;
