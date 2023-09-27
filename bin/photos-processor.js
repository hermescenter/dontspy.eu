#!/usr/bin/env node
const _ = require('lodash');
const { execSync } = require("child_process");
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const NocoDBClient = require('../lib/nocoio');
const checkerstd = require('../lib/checkerstd');
const countries = require('../lib/countries');
const debug = require('debug')('bin:photos-processor');

/* Load the settings because we need the nocoio api key */
const config = require('../config/express.json');

const argv = yargs
    .option('update', {
        alias: 'u',
        description: 'mark the photo as analyzed',
        type: 'boolean',
    })
    .showHelpOnFail(true)
    .argv;

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
        const imagePath = await checkerstd.downloadPhoto(photo);
        /* we've to execute python and a script by passing some parameters */

        const rbi = await performRBI(imagePath, photo.Id);
        if (!rbi) {
            debug("Skipping photo %s because of error", photo.Id);
            continue;
        }
        debug("RBI: %O", rbi);

        /* then draw a square box around the face, and save the image */
        const boxfile = await drawBox(imagePath, photo.Id);
        if (!boxfile) {
            /* in this condition we delete the entry, in the DB and in the filesystem */
            debug("Unable to find boxfile for photo %s", photo.Id);
            /* delete the ID from the DB */
            const result = await client.deleteOne('photos', photo.Id);
            console.log(result);
            /* delete the file */
            fs.unlinkSync(imagePath);
            /* here there is a problem, because if I send it locally I can't delete the file */
            debug("Deleted photo %s %s", photo.Id, imagePath);
        }

        const subject = await client.findOne('subjects', _.first(photo.subject).Id);

        /* I'm using pick because noco add system fields to the object */
        const o = {
            ..._.pick(subject, ['Name', 'Surname', 'Country', 'OfficialRole']),
            ..._.pick(photo, ['Id', 'Description', 'priority', 'analyzed', 'isfake', 'reviewed']),
            image: imagePath,
            boxfile,
            rbi: _.omit(rbi, ['id', 'fname'])
        };
        o.CreatedAt = new Date(photo.CreatedAt);

        const countryDetails = _.find(countries, { name: o.Country });
        /* we pick Two letter and Three ltter country code */
        if (!countryDetails) {
            debug("Unable to find country details for %s", o.Country);
            process.exit(1);
        }
        o.three = countryDetails.three;
        o.two = countryDetails.two;

        safety.push(o);

        if (argv.update) {
            const result = await client.updateOne('photos', photo.Id, { analyzed: true });
            debug("Photo %d updated", result.Id);
        } else {
            debug("Photo %d not updated because the option --update wasn't set", photo.Id);
        }
    }

    /* because the express server uses mongodb, after having updated nocodb
     * (used by people that reviews the photos), we need to update mongodb
     * in a waythat allows updates. in this case there is delete/insert pattern */
    const dbc = await checkerstd.connectMongoDB();
    const collection = dbc.db('dontspy').collection('safety');
    for (const s of safety) {
        /* here we've to remove by 'image' and then insert one by one */
        await collection.deleteOne({ image: s.image });
        await collection.insertOne(s);
    }
    debug("Inserted %d documents into the collection", safety.length);
    await dbc.close();
}

async function performRBI(imagePath, photoId) {
    // this function uses the same tool adopted in previous campaign
    const longExecName = `node_modules/@vladmandic/face-api/demo/duckface-analyzer.js`;
    const outfile = path.join('data', 'json', `${photoId}.json`);
    const command = `node ${longExecName} --source ${imagePath} --output ${outfile}`;
    debug("(performRBI) Executing command %s", command);
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

async function drawBox(imagePath, photoId) {
    // this function use the command in py/tools/draw_box_and_details_on_face.py
    const longExecName = `py/tools/draw_box_and_details_on_face.py`;
    const outfile = path.join('data', 'photos', `${photoId}_box.jpg`);
    const command = `python ${longExecName} --source ${imagePath} --output ${outfile}`;
    /* the command also accept --config to change the color of the box */
    debug("(drawBox) Executing command %s", command);
    try {
        execSync(command, (error) => {
            if (error) {
                console.log(`error: ${error.message}`);
            }
            debug("drawBox script executed");
        });
    } catch (e) {
        debug("Error while executing drawBox script: %s", e.message);
    }

    /* verify if outfile exists */
    if (!fs.existsSync(outfile)) {
        debug("Unable to find %s", outfile);
        return null;
    }
    return outfile;
}

main();