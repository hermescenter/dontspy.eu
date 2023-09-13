/* this library implement some standard functions
 * used by the two bin/*-checker script */


const _ = require('lodash');
const { execSync } = require("child_process");
const mongodb = require('mongodb');
const path = require('path');
const fs = require('fs');
const debug = require('debug')('lib:checkerstd');

async function connectMongoDB() {
    /* this function connect to the mongodb database */
    const uri = "mongodb://127.0.0.1:27017";
    const client = new mongodb.MongoClient(uri);
    return client.connect();
}

function checkPythonVenv() {
    /* this function check if the script is running
     * in a python virtual environment, if is not the
     * case, it will throw an error */
    if (process.env.VIRTUAL_ENV === undefined) {
        throw new Error('Please activate the python virtual environment');
    }
}

async function recurringSchedule(functionp, interval) {
    /* this function takes a function and an interval,
     * it ensures the function is executed AFTER interval,
     * and ensure that we do not have overlapping execution */
    let lastExecution = 0;
    while (true) {
        const now = moment().unix();
        if (now - lastExecution > interval) {
            lastExecution = now;
            await functionp();
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

async function downloadPhoto(photo) {
    /* else, we are in a remote computer that has to download the photo */
    const photorawurl = `https://db.dontspy.eu/${photo.image[0].path}`;
    /* then encode the URL with url encoding */
    const photourl = encodeURI(photorawurl);
    debug("photourl %s", photourl);
    const filename = path.join('data', 'photos', `${photo.Id}.jpg`);
    const resized =  path.join('data', 'photos', `${photo.Id}-resized.jpg`);

    if(fs.existsSync(resized)) {
        debug("File already downloaded & resized");
        return resized;
    }

    const command = `wget -O ${filename} ${photourl}`;
    execSync(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`wget: ${error.message}`);
            return;
        }
    });

    const resizer = `convert ${filename} -resize 800x ${resized}`;
    execSync(resizer, (error, stdout, stderr) => {
        if (error) {
            console.log(`convert: ${error.message}`);
            return;
        }
    });

    return resized;
}

module.exports = {
    connectMongoDB,
    checkPythonVenv,
    recurringSchedule,
    downloadPhoto,
};