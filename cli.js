#!/usr/bin/env node

var map = require('./')
var ldj = require('ldjson-stream')

process.stdin
  .pipe(map(process.argv[2]))
  .pipe(ldj.serialize())
  .pipe(process.stdout)
