#!/usr/bin/env node

const _ = require('lodash');

const NocoDBClient = require('../lib/nocoio');
const checkerstd = require('../lib/checkerstd');
const debug = require('debug')('bin:contributions-checker');

/* load the settings because we need the nocoio api key */
const config = require('../config/express.json');

checkerstd.checkPythonVenv();
debug('Python virtual environment is active');

const client = new NocoDBClient(
    config.nocoio.url,
    config.nocoio.project,
    config.nocoio.apiKey
);

async function main() {
    debug('Starting the contributions checker');

    const received = await client.findMany('contributions', {}, 1000, 0);
    /* well, the bad news is thay I've to do the filtering here */
    const filter = { imported: false }
    const filtered = _.filter(received.list, filter);

    for(const submitted of filtered) {
        const result = await acquire(submitted)
    }
}

async function acquire(submitted) {
    /* this function takes an input like this:
      {
    "Id": 6,
    "Name": "Nancy",
    "CreatedAt": "2023-09-07 08:51:15+00:00",
    "UpdatedAt": "2023-09-07 08:51:15+00:00",
    "Country": "Germany",
    "OfficialRole": "Interior Minister",
    "imported": false,
    "nc_5c0m___photos_id": null,
    "Your Name": "ilf",
    "official Picture": [
      {
        "path": "download/noco/DNTSPY/contributions/official Picture/DVSMQtKb2pAj_Pix6_.jpg",
        "title": "portrait-ministerin-faeser-neu.jpg",
        "mimetype": "image/jpeg",
        "size": 1940923
      }
    ],
    "Surname": "Faeser"
  }
  and created two records out of it. one in 'subjects' and one in 'photos' */

    const subject = {
        "Name": submitted.Name,
        "Surname": submitted.Surname,
        "Country": submitted.Country,
        "OfficialRole": submitted.OfficialRole,
        "full Name": `${submitted.Name} ${submitted.Surname}`,
    }
    const subjectResult = await client.insertOne('subjects', subject);
    debug("Inserted subject %s", subjectResult.Id);

    const photo = {
      priority: false, // set by us, by hand
      analyzed: false, // set after the face analysis is done
      isfake: false, // set only if we process deepfakes and is not from this script
      reviewed: true, // this script is used to pull from a trusted source
      image: submitted['official Picture'],
    }
    const photoResult = await client.insertOne('photos', photo);
    debug("Inserted photo %s", photoResult.Id);

    const relationship = await client
      .createRelationship("photos", photoResult, "subject", subjectResult);
    debug("%s photos(%d) -> subject(%d)", relationship.msg, photoResult.Id, subjectResult.Id);

    /* once the relationships are created, we can mark the contribution as imported */
    await client.updateOne('contributions', submitted.Id, { imported: true });
    debug("Marked contribution %d (%s) as imported", submitted.Id, subject['full Name']);
}


main();