#!/bin/sh

# For use as cron job.
# Check if script is running, and if not, start it.

SCRIPT="tweetStream.js"
DIR="/root/twitter_map_react/functions/"

if [ -z "$(pgrep -fl $SCRIPT)" ]; then
    $DIR$SCRIPT
fi