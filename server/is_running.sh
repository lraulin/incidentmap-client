#!/bin/sh

# For use as cron job.
# Check if script is running, and if not, start it.

SCRIPT="index.js"

# Directory where this script is located. Should be same directory as SCRIPT.
# Should work as long as the last component of the path used to find the script is not a symlink.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ -z "$(pgrep -fl $SCRIPT)" ]; then
    $DIR$SCRIPT
fi