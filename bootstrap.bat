cd sass
sass popinz.scss ..\webapp\css\popinz.css
cd ..
mklink /d images webapp\images
cd webapp
mklink /d js ..\js 
echo "### Configured for local frontend"
