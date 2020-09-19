#!/usr/bin/env bash

trop $(ls -1 src/text/*.html | tail -n 1) | xclip -selection clipboard;
echo OK;
