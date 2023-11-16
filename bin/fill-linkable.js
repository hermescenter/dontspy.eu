const _ = require('lodash');
const debug = require('debug')('bin:fill-linkable');
const fs = require('fs');

const axios = require('axios');


const SERVER = 'https://dontspy.eu';
const API = '/api/individuals';


async function fetchJSON() {
    const response = await axios.get(`${SERVER}${API}`);
    return response.data;
}

/* this is the content of every 'person' Object 
_id	"65562f17cd2c78814fa915aa"
Name	"Erik"
Surname	"Slottner"
Country	"Sweden"
OfficialRole	"AIAct Gov Representative"
Id	239
Description	null
priority	false
analyzed	false
isfake	false
reviewed	true
image	"data/photos/239-resized.jpg"
boxfile	"data/photos/239_box.jpg"
rbi	
gender	"male"
genderProbability	0.9837778806686401
age	46.688533782958984
expressions: {
    neutral	2.117544421059714e-12
    happy	1
    sad	2.8300105314738033e-13
    angry	6.666728280535494e-11
    fearful	1.505105068355661e-12
    disgusted	4.451290486719357e-16
    surprised	1.1491116391759704e-10
}
when	"2023-11-16T15:02:40.180Z"
CreatedAt	"2023-11-16T15:00:44.000Z"
three	"SWE"
two	"SE"
*/

function produceFilename(person) {
    /* from the 'image' field pick the numeric ID */
    const id = person.image.match(/\/(\d+)-/)[1];
    return `site/content/en/x/${id}.md`;
}

function pickTopTwo(expressions) {
    const sortedExpressions = _.sortBy(_.toPairs(expressions), (pair) => pair[1]).reverse();

    const formatted = _.reduce(sortedExpressions, (memo, pair) => {
        if (memo.length === 2)
            return memo;
        memo.push({ exprname: pair[0], amount: _.round(pair[1] * 100, 2) });
        return memo;
    }, []);

    return `${formatted[0].exprname} ${formatted[0].amount}%, ${formatted[1].exprname} ${formatted[1].amount}%`;
}

function produceContent(person) {
    let n = `${person.Name} ${person.Surname}`;
    return {
        FULLNAME: `${n}`,
        COUNTRY: person.Country,
        FLAG: EUMS[person.Country],
        GENDER: `${_.upperFirst(person.rbi.gender)} ${_.round(person.rbi.genderProbability * 100, 1)}%`,
        AGE: `${_.round(person.rbi.age, 1)} (estimated) years old`,
        EXPRESSIONS: pickTopTwo(person.rbi.expressions),
        IS_FAKE_TOGGLE: person.isfake ? '' : 'hidden',
        BOX_FULL_URL: `${SERVER}/${person.boxfile}`,
        REL_LINK_ENCODED: `/policymaker#${encodeURIComponent(n)}`,
    }
}

function mixTemplate(template, content) {
    /* in the Template file there are strings such as $FULLNAME$
      that need to be replaced with the actual content. the string
      might be present more than once */
    let result = template;
    for (const key in content) {
        const value = content[key];
        result = result.replace(`$${key}$`, value);
        /* because is present more than once! */
        result = result.replace(`$${key}$`, value);
    }
    return result;
}

async function main() {
    const data = await fetchJSON();
    const template = fs.readFileSync('template/linkable.md.txt', 'utf-8');
    for (const person of data) {
        const fname = produceFilename(person);
        const content = produceContent(person);

        const random = _.sample(_.reject(data, { Country: person.Country }));
        content.RANDOM_FLAG = EUMS[random.Country];
        content.RANDOM_ID = random.image.match(/\/(\d+)-/)[1] + '';

        const filedata = mixTemplate(template, content);
        fs.writeFileSync(fname, filedata, 'utf-8');
        debug(`Wrote ${fname}`);
    }
}

const EUMS = {
    'Austria': "🇦🇹",
    'Belgium': "🇧🇪",
    'Bulgaria': "🇧🇬",
    'Croatia': "🇭🇷",
    'Cyprus': "🇨🇾",
    'Czechia': "🇨🇿",
    'Denmark': "🇩🇰",
    'Estonia': "🇪🇪",
    'Finland': "🇫🇮",
    'France': "🇫🇷",
    'Germany': "🇩🇪",
    'Greece': "🇬🇷",
    'Hungary': "🇭🇺",
    'Ireland': "🇮🇪",
    'Italy': "🇮🇹",
    'Latvia': "🇱🇻",
    'Lithuania': "🇱🇹",
    'Luxembourg': "🇱🇺",
    'Malta': "🇲🇹",
    'Netherlands': "🇳🇱",
    'Poland': "🇵🇱",
    'Portugal': "🇵🇹",
    'Romania': "🇷🇴",
    'Slovakia': "🇸🇰",
    'Slovenia': "🇸🇮",
    'Spain': "🇪🇸",
    'Sweden': "🇸🇪"
};


main();
