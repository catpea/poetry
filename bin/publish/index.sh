#!/usr/bin/env bash

year=$(date +"%Y");
poem=$(ls -1 src/text/*.html | wc -l);

git add .;
git commit -m "System updates year $year, poem count: $poem. System 3.";
npm version patch; # this does add and commit too.
git push;
