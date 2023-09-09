#!/usr/bin/env node

const _ = require('lodash');

const NocoDBClient = require('../lib/nocoio');
const checkerstd = require('../lib/checkerstd');
const debug = require('debug')('bin:contributions-checker');

/* load the settings because we need the nocoio api key */
const config = require('../config/express.json');

checkerstd.checkPythonVenv();
debug('Python virtual environment is active');

async function main() {
    debug('Starting the contributions checker');

    const client = new NocoDBClient(
        config.nocoio.url,
        config.nocoio.project,
        config.nocoio.apiKey
    );

    const filter = { reviewed: false }
    const received = await client.findMany('contributions', {}, 1000, 0);
    /* well, the bad news is thay I've to do the filtering here */
    console.log(JSON.stringify(received.list, null, 2))
    const filtered = _.filter(received.list, filter);


}

main();