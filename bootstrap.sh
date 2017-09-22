#!/bin/sh
#
set -e  # exit on error

ln -sf ../webapp/images images
ln -sf js webapp/js
echo "### Configured for local frontend"
