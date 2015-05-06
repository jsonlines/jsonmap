#!/usr/bin/env node

var map = require('./')
var ndjson = require('ndjson')
var args = require('minimist')(process.argv.slice(2))
var path = require('path')

var transform = args._[0]
if (args.file) transform = require(path.resolve(process.cwd(), args.file))

process.stdin
  .pipe(map(transform, args))
  .pipe(ndjson.serialize())
  .pipe(process.stdout)
