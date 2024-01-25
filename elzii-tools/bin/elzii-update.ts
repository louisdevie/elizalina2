#!/usr/bin/env node

import yargs from 'yargs'
import { version } from '@module'

let argv = yargs
  .scriptName('elzii-update')
  .usage(
    '$0 [OPTIONS] [TARGETS...]',
    'Search for translation keys in the code of the project and update translation files accordingly',
  )
  .version('elzii-tools v' + version)
  .boolean('debug')
  .describe({
    debug: 'Show debugging information',
  })
  .help().argv

console.log(argv)
