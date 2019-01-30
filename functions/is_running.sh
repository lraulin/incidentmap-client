#!/bin/sh

SCRIPT="tweetStream.js"
DIR="/root/twitter_map_react/functions/"

if [ -z "$(pgrep -fl $SCRIPT)" ]; then
    $DIR$SCRIPT
fi