# gemmii-web
The Repo for the Angular UI side of gemmii

## Getting started
* install nodejs `sudo zypper in nodejs` or `sudo apt-get install nodejs`
* `sudo npm install -g bower`
* `sudo npm install -g grunt-cli`
* `npm install` *# Install dev dependencies*
* `bower install` *# Install app dependencies*
* `grunt serve` *# Run local webserver (will compile SASS and ES6 files when changed)*

## Style Guides

Please follow these style guides when writing code:

* [AngularJS Style Guide](https://github.com/mgechev/angularjs-style-guide)

## Publish app
* `grunt` (Builds the app in the `dist` directory)
* Copy `dist` folder to webserver
