#!/usr/bin/env node
const _ = require('lodash');
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const NocoDBClient = require('../lib/nocoio');
const checkerstd = require('../lib/checkerstd');
const debug = require('debug')('bin:photos-processor');

/* Load the settings because we need the nocoio api key */
const config = require('../config/express.json');

/* As explained in README, the goal of this file is to check 
 * new photos and analyze them via python scripts. they 
 * produces json files that would be associated to the 
 * photos in the database */

try {
    checkerstd.checkPythonVenv();
} catch (e) {
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

    const filter = { analyzed: false }
    const received = await client.findMany('photos', {}, 1000, 0);
    /* well, the bad news is thay I've to do the filtering here */
    const filtered = _.filter(received.list, filter);
    debug("Received %d photos, filtered %d photos to analyze", received.list.length, filtered.length);

    /* there are two kind of photos here, the one that have been validated (boolean 'reviewed' is true)
     * and the one that have not been validated (boolean 'reviewed' is false). If is 'false' we need to validate
     * it first by picking the faces o the validated and check with the script 'confirm_face_ownership' */

    // TODO check and 'confirm_face_ownership'

    /* after we can analyze the photo and produce the copy with the lines of the facial features */

    for (const photo of filtered) {
        // console.log(photo);
        debug("Analyzing photo %s (%o)", photo.Id, photo.subject);

        /* the URL for remote polling is */
        const imagePath = await checkerstd.localOrRemote(photo);
        /* we've to execute python and a script by passing some parameters */

        const rbi = await performRBI(imagePath, photo.Id);
        debug("RBI: %O", rbi);
        //        const result = await client.updateOne('photos', photo.id, { reviewed: true });
        // debug("Photo %s updated", photo.id);
    }
}

async function performRBI(imagePath, photoId) {

    /* now we use exec to run python3 ./py/tools/analyze.py --photo-id 1 --photo-path ./data/photos/1.jpg */
    const clunky = `node_modules/@vladmandic/face-api/demo/duckface-analyzer.js`;
    const outfile = path.join('data', 'json', `${photoId}.json`);
    const command = `node ${clunky} --source ${imagePath} --output ${outfile}`;
    debug("Executing command %s", command);
    await exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        console.log(stdout);
    });
    /* read the json file outfile */
    const retval = JSON.parse(fs.readFileSync(outfile, 'utf8'));
    return retval;

}


/* --- command list:

python3 py/tools/draw_box_and_details_on_face.py --source /tmp/Alessio\ Butti.jpg --output AB.jpg  --config config/boxes.json 



 */

main();