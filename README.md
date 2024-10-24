# Node.js API Hello World
Simple API intended for remote execution calls to start/stop koboldcpp and list available files

## Requirements
* node.js & npm
* A script to start koboldcpp
  This should take two parameters.
  - A context size
  - A model name
 A script to stop koboldcpp

## How to install & run
* copy default.json.template to default.json and configure
  - Set a shared secret in default.json. This will be required for calls to load/unload  
* npm install
* node --experimental-fetch app.js

## How to use
* Browse to site, see swagger documentation/examples on site.