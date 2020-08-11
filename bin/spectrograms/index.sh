#!/usr/bin/env bash
AUDIO='db/audio';
DIST='dist';
DIST_SPECTRO="${DIST}/spectrogram";
mkdir -p $DIST_SPECTRO;
for file in $AUDIO/poetry-*.mp3; do
  name=$(basename -s .mp3 $file)
  spectrogram="${DIST_SPECTRO}/${name}.jpg";
  ffmpeg -y -i "${file}" -lavfi "showspectrumpic=s=1024x1024 , crop=1306:1130:0:0" "${spectrogram}";
  #TODO:
done;
