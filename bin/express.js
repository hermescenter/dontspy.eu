/* this file is used to start the express server, it 
 * binds the port loaded from 'config/express.json' and
 * implement a GET route to /api/eumap */

/* this is a minimalistic, all inclusive, backend that implements basic APIs */
const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const debug = require('debug')('bin:express');
const fs = require('fs');

const checkerstd = require('../lib/checkerstd');
const NocoDBClient = require('../lib/nocoio');

const config = require('../config/express.json');
const client = new NocoDBClient(
    config.nocoio.url,
    config.nocoio.project,
    config.nocoio.apiKey
);

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
        debug("Error in `individuals` API: %s", error.message);
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
        const picturesPerCountry = _.countBy(data, 'Country')
        const facesTotal = _.countBy(data, { isfake: false }).true;
        const fakesTotal = _.countBy(data, { isfake: true }).true;
        const registered = _.keys(_.countBy(data, (d) => {
            return `${d.OfficialRole}-${d.Country}`;
        })).length;
        res.json({
            facesTotal,
            fakesTotal,
            registered,
            picturesPerCountry
        });
    } catch (error) {
        debug("Error in `available` API: %s", error.message);
        res.status(500).send(error.message);
    }
});

app.get('/api/figures', cors(), async function (req, res) {
    /* this API it is used to know which political figures are
     * configured by the trusted parties. Do not pass via Mongo but via Noco */
    try {
        const received = await client.findMany('contributions', {}, 1000, 0);
        /* well, the bad news is thay I've to do the filtering here */
        const filter = { imported: true }
        const filtered = _.filter(received.list, filter);
        const shrunk = _.map(filtered, (item) => {
            return _.pick(item, ['Name', 'Surname', 'Country', 'OfficialRole']);
        });
        debug("Returning %d configured political figures", shrunk.length);
        res.json(shrunk);
    } catch (error) {
        debug("Error in querying NocoDB: %s", error.message);
        res.status(500).send(error.message);
    }
});

function pickEmotion(str) {
    /* this function test if the 'str' is one of the string in 'E' or try 
     * to parse JSON and then check if one of the string in 'E' is found.
     * it returns the exact string in 'E' or an error */
    const E = ["neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised"];
    const lostr = _.toLower(str);
    if (_.includes(E, lostr))
        return lostr;
    const p = JSON.parse(lostr);
    if (_.includes(E, p))
        return p;
    throw new Error(`Invalid Emotion requested. Valid: ${JSON.stringify(E)}`)
}

app.get('/api/emotion/:emotionName', cors(), async function (req, res) {
    try {
        debug("Emotion requested %s", req.params.emotionName);
        const c = pickEmotion(req.params.emotionName);
        const k = `rbi.expressions.${c}`;
        const v = { $gt: 0.01 };
        const query = {}
        query[k] = v;
        const data = await mongoFetch(query);
        const ready = _.map(_.reverse(_.orderBy(_.sampleSize(data, 14), k)), (d) => {
            const fullName = `${d.Name} ${d.Surname}`;
            const percent = `${_.round(d.rbi.expressions[c] * 100, 0)}%`;
            return {
                fullName,
                percent,
                url: `https://dontspy.eu/${d.image}`,
                description: `${fullName} from ${d.Country} expressed ${c} emotion at ${percent}`,
                nation: d.Country,
                role: d.OfficialRole,
            }
        })
        debug("Politicians returned %d", ready.length);
        res.json(ready);
    } catch (error) {
        debug("Error in querying MongoDB: %s", error.message);
        res.status(500).send(error.message);
    }
});

app.get('/api/help', cors(), async function (req, res) {
    try {
        const { country, role, helpReceived } = req.query;
        // hi reviewer, you are free to inject the shit you want
        // FYI I'm going to scp this file periodically and consult it 
        // with 'vim'.
        fs.appendFileSync('helpReceived.log',
            JSON.stringify({
                country,
                role,
                helpReceived,
                when: new Date()
            }, null, 2) + "\n", 'utf-8');
        res.status(201);
        res.send('OK');
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

/* the files under folder /data need to be reachable from the web */
app.use('/data', express.static('data'));
