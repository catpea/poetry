#!/usr/bin/env bash

./bin/mirror/generate.mjs
rsync -qav --progress ./dist/audio ./docs
rsync -qav --progress ./dist/image ./docs
