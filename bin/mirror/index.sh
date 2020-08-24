#!/usr/bin/env bash

./bin/mirror/generate.mjs
rsync -qav --progress ./src/audio ./docs
rsync -qav --progress ./dist/image ./docs
