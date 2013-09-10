var fs = require('fs')
var build = require('buildModules')

var buildDirectory = __dirname+'/generatedBuilds/'
if(!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory)
}

var proto = fs.readFileSync(__dirname + '/proto.js').toString()
var copywrite = '/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/'

console.log('building and minifying...')
build(buildDirectory, 'proto', copywrite, proto, undefined, [])
console.log('done')