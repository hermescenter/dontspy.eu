/* this library implement some standard functions
 * used by the two bin/*-checker script */


const _ = require('lodash');
debug = require('debug')('lib:checkerstd');

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

async function localOrRemote(photo) {
    /* this function as first verify if in the envoronment the variable USER is equal to 'dontspy' */
    if (process.env.USER === 'dontspy') {
        debug("We're local runner and the path is %s", photo.image[0].path);
        return photo.image[0].path;
    }
    /* else, we are in a remote computer that has to download the photo */
    const photourl = `https://db.dontspy.eu/${photo.image[0].path}`;
    debug("photourl %s", photourl);
    const filename = `./data/photos/${photo.Id}.jpg`;
    const { exec } = require("child_process");
    const command = `wget -O ${filename} ${photourl}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
    });
    /* this function has two known bad design choices:
        0) it does not check if the file is already present
        1) uses wget
        2) do not use path.join and needs the directory to be present
     */
    debug("We're remote runners and the downloaded path is %s", filename);
    return filename;
}

module.exports = {
    checkPythonVenv,
    recurringSchedule,
    localOrRemote,
};