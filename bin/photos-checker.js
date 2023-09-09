#!/usr/bin/env node

const _ = require('lodash');

const NocoDBClient = require('../lib/nocoio');
const checkerstd = require('../lib/checkerstd');
const debug = require('debug')('bin:photos-checker');

/* Load the settings because we need the nocoio api key */
const config = require('../config/express.json');

/* As explained in README, the goal of this file is to check 
 * new photos and analyze them via python scripts. they 
 * produces json files that would be associated to the 
 * photos in the database */

try {
    checkerstd.checkPythonVenv();
} catch(e) {
    console.log(e.message);
    process.exit(1);
}

debug('Python virtual environment is active');

async function main() {
    debug('Starting the contributions checker');

    const client = new NocoDBClient(
        config.nocoio.url,
        config.nocoio.project,
        config.nocoio.apiKey
    );

    const filter = { reviewed: false }
    const received = await client.findMany('photos', { }, 1000, 0);
    /* well, the bad news is thay I've to do the filtering here */
    const filtered = _.filter(received.list, filter);
    debug("After filtering we've %d photos to analyze", filtered.length);

    for(const photo of filtered) {
        console.log(photo);
        debug("Analyzing photo %s (%s)", photo.Id, photo.Description);

        /* the URL for remote polling is */
        const imagePath = await checkerstd.localOrRemote(photo);
        /* we've to execute python and a script by passing some parameters */
        const { exec } = require("child_process");
        /* now we use exec to run python3 ./py/tools/analyze.py --photo-id 1 --photo-path ./data/photos/1.jpg */ 
        const command = `python3 ./py/tools/analyze.py --photo-id ${photo.Id} --photo-path ./data/photos/${photo.Id}.jpg`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            console.log(stdout);
            /* here the side effect JSON file output should be available */
        });
        debug("Executing command %s", command);

//        const result = await client.updateOne('photos', photo.id, { reviewed: true });
        debug("Photo %s updated", photo.id);
    }
}

main();