#!/bin/bash

rm -f harborfreight.zip
zip -r harborfreight.zip --exclude=.git/* --exclude=.gitignore --exclude=README.md --exclude=build.sh .
