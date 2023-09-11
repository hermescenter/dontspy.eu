/* this file is used to start the express server, it 
 * binds the port loaded from 'config/express.json' and
 * implement a GET route to /api/eumap */

/* this is a minimalistic, all inclusive, backend that implements basic APIs */
const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const moment = require('moment');
const debug = require('debug')('bin:express');
const mongodb = require('mongodb');

const checkerstd = require('../lib/checkerstd');
const settings = require('../config/express.json');

const app = express();

// next year, should be the year of AIAct.
const PORT = 2024;
app.listen(PORT, () => {
    console.log(`Binded sucessfully port ${PORT}`);
});

async function mongoFetch(filter) {
    const dbc = await checkerstd.connectMongoDB();
    const collection = dbc.db('dontspy').collection('safety');
    const result = await collection.find(filter, { CratedAt: -1 }).toArray();
    await dbc.close();
    debug("Fetched %d elements with %o filter", result.length, filter);
    return result;
}

function acquireFilter(req) {
    try {
        const filter = JSON.parse(req.params.filter);
        return filter
    } catch (error) {
        if (req.params?.filter && req.params.filter.length > 1) {
            console.log(`Unable to extract a valid filter: ${error.message}`);
        }
    }
}

/* very simple couple of APIs:
 - individuals would return the full picture
 - available would return a counter per country
 both of them take any filter as parameter.
 both uses mongodb instead of nocodb */

app.get('/api/individuals/:filter?', cors(), async function (req, res) {
    try {
        const filter = acquireFilter(req);
        const data = await mongoFetch(filter);
        /* individual return all the data */
        res.json(data);
    } catch (error) {
        debug("Errot in `individuals` API: %s", error.message);
        res.status(500).send(error.message);
    }
});

app.get('/api/available/:filter?', cors(), async function (req, res) {
    /* this API needs to query by using nocodb, which are the
     * political figure actually configured there. We expose this
     * API to the public while the nocodb stay locked behind a token */
    try {
        const filter = acquireFilter(req.filter);
        const data = await mongoFetch(filter);
        /* available return a number of elements per country */
        const retval = _.countBy(data, 'Country')
        res.json(retval);
    } catch (error) {
        debug("Errot in `available` API: %s", error.message);
        res.status(500).send(error.message);
    }
});