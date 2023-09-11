#!/usr/bin/env node
const _ = require('lodash');
const { execSync } = require("child_process");
const fs = require('fs');
const path = require('path');

const NocoDBClient = require('../lib/nocoio');
const checkerstd = require('../lib/checkerstd');
const countries = require('../lib/countries');
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

    /* because nocodb isn't giving all the reliabilty I would like to have from a DB, 
     * all the photos + subjects + RBI are also stored in mongodb. one column. 'safety' */
    const safety = [];
    /* after we can analyze the photo and produce the copy with the lines of the facial features */
    for (const photo of filtered) {
        // console.log(photo);
        debug("Analyzing photo %s (%o)", photo.Id, photo.subject);

        /* the URL for remote polling is */
        const imagePath = await checkerstd.localOrRemote(photo);
        /* we've to execute python and a script by passing some parameters */

        const rbi = await performRBI(imagePath, photo.Id);
        if (!rbi) {
            debug("Skipping photo %s because of error", photo.Id);
            continue;
        }
        debug("RBI: %O", rbi);

        const subject = await client.findOne('subjects', _.first(photo.subject).Id);

        /* I'm using pick because noco add system fields to the object */
        const o = {
            ..._.pick(subject, ['Name', 'Surname', 'Country', 'OfficialRole']),
            ..._.pick(photo, ['Id', 'Description', 'priority', 'analyzed', 'isfake', 'reviewed']),
            image: _.omit(photo.image[0], ['title']), // I'm just thinking that we shouldn't leak that to the public
            rbi: _.omit(rbi, ['id', 'fname'])
        };
        o.CreatedAt = new Date(photo.CreatedAt);

        const countryDetails = _.find(countries, { name: o.Country });
        /* we pick Two letter and Three ltter country code */
        o.three = countryDetails.three;
        o.two = countryDetails.two;

        safety.push(o);

        const result = await client.updateOne('photos', photo.Id, { analyzed: true });
        debug("Photo %d updated", result.Id);
    }

    /* now we can save the safety array to mongodb */
    const dbc = await checkerstd.connectMongoDB();
    const collection = dbc.db('dontspy').collection('safety');
    const result = await collection.insertMany(safety);
    debug("Inserted %d documents into the collection", result.insertedCount);
    await dbc.close();
}

async function performRBI(imagePath, photoId) {
    // this function uses the same tool adopted in previous campaign
    const longExecName = `node_modules/@vladmandic/face-api/demo/duckface-analyzer.js`;
    const outfile = path.join('data', 'json', `${photoId}.json`);
    const command = `node ${longExecName} --source ${imagePath} --output ${outfile}`;
    debug("Executing command %s", command);
    execSync(command, (error) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return null;
        }
        debug("RBI script executed");
    });
    /* read the json file outfile */
    return JSON.parse(fs.readFileSync(outfile, 'utf8'));
}

main();