#!/usr/bin/env bash

year=$(date +"%y");
poem=$(ls -1 db/*.md | wc -l);

git add .;
git commit -m "New Release: RC.$year.$poem";
git push;
