#!/usr/bin/env bash

year=$(date +"%Y");
poem=$(ls -1 db/*.md | wc -l);

git add .;
git commit -m "System updates year $year, poem count: $poem";
npm version patch; # this does add and commit too.
git push;
