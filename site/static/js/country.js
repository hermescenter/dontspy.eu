function baseURL() {
  let server = window.location.hostname;
  if (server === 'localhost') {
    server = 'http://localhost:2024';
  } else {
    server = 'https://' + server;
  }
  return server;
}

function serverURL(path, filter) {
  /* if we're in production the server is at the same address as the website, otherwise
   * the server is at localhost:2024 */
  return baseURL() + '/api/' + path + '/' + JSON.stringify(filter);
}

async function loadMaterial() {
  /* pick from the URL, after the #, the country name */
  const countryName = window.location.href.split('#').pop();
  const url = serverURL('individuals', { Country: countryName });
  const response = await fetch(url);
  const data = await response.json();
  console.log(countryName, data);
  /* now we can populate the table, or the error message if is missing */
  if (data.length === 0) {
    const container = document.querySelector('#face-list');
    container.innerHTML = `<div class="alert error">
      No data for ${countryName}!`;
    return;
  }

  const grouped = _.groupBy(data, 'OfficialRole');

  const displayOrder = ['Prime Minister', 'AIAct Gov Representative', 'Interior Minister', 'Justice Minister', 'Defense Minister'];

  const formatted = _.compact(_.map(displayOrder, (role) => {
    const pictures = grouped[role];
    if (!pictures) {
      return null;
    }

    const fullname = `${pictures[0].Name} ${pictures[0].Surname} `;
    return {
      role,
      fullname,
      items: _.map(pictures, (photo) => {
        return {
          src: `${baseURL()}/${photo.image}`,
          boxpic: `${baseURL()}/${photo.boxfile}`,
          rbi: photo.rbi,
          isfake: photo.isfake,
          description: photo.Description ?? `Official potrait of ${fullname}`,
        };
      })
    };
  }));

  console.log(formatted);
  _.each(formatted, populateData);
}

function populateData(data) {
  const container = document.querySelector('.container');

  // data.role and data.name shape this element
  const headerFullTitle = document.createElement('h1');
  headerFullTitle.textContent = data.fullname;
  const officialTitle = document.createElement('span');
  officialTitle.classList = ['official-role'];
  officialTitle.textContent = data.role;
  container.appendChild(headerFullTitle);
  headerFullTitle.appendChild(officialTitle);

  // data.items is an array of objects with img src and all the RBI metas
  data.items.forEach(item => {
    const pictureDescription = document.createElement('div');
    pictureDescription.classList.add('picture-description');

    const img1Normal = new Image();
    img1Normal.src = item.src;
    const img2Box = new Image();
    img2Box.src = item.boxpic;

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.description; // using the description as alt text

    img.addEventListener('mouseenter', (event) => {
      console.log("enter");
      /* when the mouse is over the image, we need to show the boxpic */
      img.src = img2Box.src;
    });
    img.addEventListener('mouseout', (event) => {
      console.log("out");
      /* when the mouse is over the image, we need to show the boxpic */
      img.src = img1Normal.src;
    });

    /* render RBI produces the text on the right of the picture */
    const details = document.createElement('p');
    details.innerHTML = renderRBI(item.rbi, item.isfake, item.description);

    /* append to the container */
    pictureDescription.appendChild(img);
    pictureDescription.appendChild(details);
    container.appendChild(pictureDescription);
  });
}

function renderRBI(rbi, isfake, description) {
  /* this function return an HTML string, and would go inside of a 'p' */
  /* rbi is an object with:
    "gender": "female",
    "genderProbability": 0.9304855540394783,
    "age": 50.535579681396484,
    "expressions": {
        "neutral": 0.0012158838799223304,
        "happy": 0.9987840056419373,
        "sad": 3.946092341777785e-9,
        "angry": 4.360220628996103e-8,
        "fearful": 1.6772427197109252e-11,
        "disgusted": 1.0484752976935852e-7,
        "surprised": 1.8983071115030725e-8
    },
    "expression": [
        "happy",
        0.9987840056419373
    ],
    "box": [
        287.36549849199446,
        213.43697015643122,
        166.09076093137264,
        148.4218342065811
    ],
    "imageShape": [ 1, 1000, 800, 3 ],
    "when": "2023-09-12T11:47:41.390Z"
 */
  let retval = "";
  if(isfake) {
    retval += `<div class="deepfake-label">
      Deepfake: ${description}
    </div>`;
  }

  retval += `<div><b>Estimated Gender:</b><br>
    <code>${_.upperFirst(rbi.gender)}</b> ${_.round(rbi.genderProbability * 100, 1)}%</code>
  </div>`;
  retval += `<div><b>Estimated Age:</b><br>
    <code>${_.round(rbi.age, 1)} years</code>
  </div>`;
  /* expressions contains a dictionary of probabilities, we want to show the top 2 */
  /* sort the estimated expressions first */
  const sortedExpressions = _.sortBy(_.toPairs(rbi.expressions), (pair) => pair[1]).reverse();
  /* multiply to get percentages */
  const formatted = _.reduce(sortedExpressions, (memo, pair) => {
    if(memo.length === 2)
      return memo;
    memo.push({exprname: pair[0], amount: _.round(pair[1] * 100, 2)});
    return memo;
  }, []);

  retval += `
    <div><b>Expressions:</b>
    <br>
    <code>${formatted[0].exprname} ${formatted[0].amount}%</code>
    <br>
    <code>${formatted[1].exprname} ${formatted[1].amount}%</code>
    </div>
  `;

  return retval;
}

