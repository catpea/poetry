#!/usr/bin/env bash

year=$(date +"%y");
poem=$(ls -1 db/*.md | wc -l);

git add .;
git commit -m "System Update $year/$poem";
npm version minor; # this does add and commit too.
git push;
