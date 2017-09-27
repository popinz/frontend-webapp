Popinz frontend webapp
======================

Welcome to the Popinz community project's frontend webapp!

There are a few simple steps to get the project setup and running. It consists of 3 parts, JavaScript code, SASS/CSS style sheets and a webapp with the HTML source, images, etc. The project runs against a google cloud endpoint backend (source will soon be open sourced to github shortly).

Environment
===========
1. An editor like brackets or sublime. We'll assume brackets here.
2. Command line Sass compiler. http://sass-lang.com/install
3. Chrome with developer tools.

Setup
=====
As a google endpoint webapp, the entire app should be deployed from the webapp folder. On Linux/MacOS, you should run the bootstrap.sh script to setup the soft-links and run the sass compiler.
Windows - do something similar to the script.

Brackets
========
Open brackets to the frontend-webapp folder. Select index.html, and run the live preview. The popinz home page should be properly displayed with images and the correct css. Otherwise, return to the setup step.
You should be able to make changes in the code and get live updates. Google endpoint API calls will go to the test backend server.

Issues
======
Facebook login currently does not work in localhost development mode due to a domain configuration issue.

