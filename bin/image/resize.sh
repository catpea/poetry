#!/usr/bin/env bash

dist="dist/image";
old_fullfile="$1";
old_pathname=$(dirname -- "$old_fullfile")
old_basename=$(basename -- "$old_fullfile")
old_extension="${old_basename##*.}"
old_filename="${old_basename%.*}"

source=$old_fullfile;

bl_dest="${dist}/bl-${old_basename}";
ss_dest="${dist}/ss-${old_basename}";
xs_dest="${dist}/xs-${old_basename}";
sm_dest="${dist}/sm-${old_basename}";
md_dest="${dist}/md-${old_basename}";
lg_dest="${dist}/lg-${old_basename}";
xl_dest="${dist}/xl-${old_basename}";

mkdir -p $dist;

if [ ! -f "$bl_dest" ] || [ "$source" -nt "$bl_dest" ]; then
  echo Creating "$bl_dest"...
  convert -define jpeg:size=160x160 $source -thumbnail 100x100^ -gravity center -extent 100x100 -gaussian-blur 0x3 -quality 90 $bl_dest;
fi;

if [ ! -f "$ss_dest" ] || [ "$source" -nt "$ss_dest" ]; then
  echo Creating "$ss_dest"...
  convert -define jpeg:size=160x160 $source -thumbnail 100x100^ -gravity center -extent 100x100 -quality 90 $ss_dest;
fi;

if [ ! -f "$xs_dest" ] || [ "$source" -nt "$xs_dest" ]; then
  echo Creating "$xs_dest"...
  convert -define jpeg:size=320x200 $source -thumbnail 200x200^ -gravity center -extent 200x200 -quality 90 $xs_dest;
fi;

if [ ! -f "$sm_dest" ] || [ "$source" -nt "$sm_dest" ]; then
  echo Creating "$sm_dest"...
  convert -define jpeg:size=640x480   $source  -thumbnail 300x300^   -gravity center -extent 300x300 -quality 90 $sm_dest;
fi;

if [ ! -f "$md_dest" ] || [ "$source" -nt "$md_dest" ]; then
  echo Creating "$md_dest"...
  convert -define jpeg:size=800x600 $source  -thumbnail 500x500^   -gravity center -extent 500x500 -quality 90 $md_dest;
fi;

if [ ! -f "$lg_dest" ] || [ "$source" -nt "$lg_dest" ]; then
  echo Creating "$lg_dest"...
  convert -define jpeg:size=1024x768 $source  -thumbnail 600x600^ -gravity center -extent 600x600 -quality 90 $lg_dest;
fi;

if [ ! -f "$xl_dest" ] || [ "$source" -nt "$xl_dest" ]; then
  echo Creating "$xl_dest"...
  convert -define jpeg:size=1920x1080  $source  -thumbnail 1024x768^ -gravity center -extent 1024x768 -quality 90 $xl_dest;
fi;
