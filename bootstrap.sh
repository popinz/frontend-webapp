#!/bin/sh
#
set -e  # exit on error
cd sass
sass popinz.scss ../webapp/css/popinz.css
cd ..
ln -sf ./webapp/images ./images
ln -sf ../js ./webapp/js
echo "### Configured for local frontend"
