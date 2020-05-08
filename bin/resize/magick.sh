#!/usr/bin/env bash

old_fullfile="$1";
old_pathname=$(dirname -- "$old_fullfile")
old_basename=$(basename -- "$old_fullfile")
old_extension="${old_basename##*.}"
old_filename="${old_basename%.*}"

source=$old_fullfile;
#dest=${1%.jpg}-sm.jpg
sm_dest="${old_pathname}/sm-${old_basename}";
md_dest="${old_pathname}/md-${old_basename}";
lg_dest="${old_pathname}/lg-${old_basename}";

# dd=`identify -format "%[fx:min(w,h)]" $source`;
# convert $source -gravity center -crop ${dd}x${dd}+0+0 +repage $dest
#
# echo old_pathname $old_pathname;
# echo old_basename $old_basename;
# echo old_extension $old_extension;
# echo old_filename $old_filename;

echo $source;
echo $dest;
echo;

convert -define jpeg:size=200x200   $source  -thumbnail 100x100^   -gravity center -extent 100x100 -quality 30 $sm_dest;
convert -define jpeg:size=1000x1000 $source  -thumbnail 500x500^   -gravity center -extent 500x500 -quality 80 $md_dest;
convert -define jpeg:size=2000x2000 $source  -thumbnail 1000x1000^ -gravity center -extent 1000x1000 -quality 80 $lg_dest;
