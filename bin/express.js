/* this file is used to start the express server, it 
 * binds the port loaded from 'config/express.json' and
 * implement a GET route to /api/eumap */

/* this is a minimalistic, all inclusive, backend that implements basic APIs */
const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const moment = require('moment');
const debug = require('debug')('bin:express');

const NocoDBClient = require('../lib/nocoio');
const settings = require('../config/express.json');

const app = express();

// next year, should be the year of AIAct.
const PORT = 2024;
app.listen(PORT, () => {
    console.log(`Binded sucessfully port ${PORT}`);
});

const client = new NocoDBClient(
    settings.nocoio.url,
    settings.nocoio.project,
    settings.nocoio.apiKey
);

// 'http://localhost:8080/api/v1/db/data/v1', 'project_noco_a', 'MnN3ygnHGj-ajH4qzYCFkMzcUtW30bQ4y6Z5cAIj');

app.get('/api/peopels/:filter?', cors(), async function (req, res) {
    let filter = {};
    try {
        filter = JSON.parse(req.params.filter);
    } catch (error) {
        if (req.params?.filter && req.params.filter.length > 1) {
            console.log(`Unable to extract a valid filter: ${error.message}`);
        }
    }

    const data = await MongoRead(filter);
    console.log(`→ MEPs API fetched ${data.length} with filter ${JSON.stringify(filter)}, returns ${JSON.stringify(_.countBy(data, 'nation'))}`);
    res.json(data);
});

app.get('/api/euromap', cors(), async function (req, res) {
    /* this API needs to query by using nocodb, which are the
     * political figure actually configured there. We expose this
     * API to the public while the nocodb stay locked behind a token */
    const data = await client.findMany('subjects');
    debug("REMIND you should strip some fields from the %d objects", data.length);
    res.json(data);
});