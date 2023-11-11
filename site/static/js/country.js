function reportRegisteredFaces(data, countryName) {
  _.each(displayOrder, (role, order) => {
    const container = document
      .querySelector(`#role-${order}`);
    const pictures = _.filter(data, { OfficialRole: role });
    const count = pictures.length;

    // gestisci le due condizioni: se la persona è registrata
    // allora c'è almeno una foto, se no, segnala "Missing"
    if (!count) {
      container.classList.add('missing');

      const h = document.createElement('span');
      h.classList.add('help');
      h.classList.add('loadhelp');
      h.textContent = 'HELP US!';
      h.setAttribute('data-role', role);
      h.setAttribute('data-country', countryName);
      container.appendChild(h);

      const t = document
        .getElementById(`name-${order}`);

      t.textContent = "Missing";
      t.style.fontStyle = 'italic';
      t.setAttribute('data-role', role);
      t.setAttribute('data-country', countryName);
      t.classList.add('loadhelp');

    } else {
      container.textContent = `${count} Picture${count > 1 ? 's' : ''} `;
      const a = document.createElement('span');
      a.setAttribute('data-role', role);
      a.setAttribute('data-country', countryName);
      a.classList.add('addpict');
      a.textContent = '➕';
      container.appendChild(a);

      document
        .getElementById(`name-${order}`)
        .textContent =
        `${pictures[0].Name} ${pictures[0].Surname}`;
    }
  });
}

async function loadMaterial() {
  /* pick from the URL, after the #, the country name */
  const countryName = window.location.href.split('#').pop();
  const url = serverURL('individuals', { Country: countryName });
  let response, data = [];
  try {
    response = await fetch(url);
    data = await response.json();
  } catch (error) {
    console.error(error);
  }

  console.log(countryName, data);
  /* now we can populate the table, or the error message if is missing */
  if (data.length === 0) {
    const container = document.querySelector('#face-list');
    container.innerHTML = `<div class="alert error">
      No data for ${decodeURIComponent(countryName)}!
    </div>
    <div class="alert info">
      Solve by ensuring this country politicians are registered, and then "Upload a new picture"
    </div>`;
    return;
  }

  document
    .querySelectorAll('.country-name')
    .forEach((e) => {
      e.innerText = countryName;
    });

  document
    .querySelectorAll('.country-flag')
    .forEach((e) => {
      e.innerText = EUMS[countryName];
    });

  /* with this data two elements are populated:
  1) the #face-list element, with the list of faces
  2) the #registered-faces element, that says if a politician is there or not */
  reportRegisteredFaces(data, countryName);

  /* Now we can bind the clicks to the events */
  document.querySelectorAll('.addpict').forEach((e) => {
    e.addEventListener('click', loadUploadForm);
  });

  document.querySelectorAll('.loadhelp').forEach((e) => {
    e.addEventListener('click', loadHelpForm);
  });

  // now we can populate the list of faces
  const grouped = _.groupBy(data, 'OfficialRole');

  /* displayOrder contains the political roles and it is in shared.js */
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

  const deepfakes = _.filter(data, { isfake: true }).length;
  console.log("formatted", formatted, "deepfakes", deepfakes);

  _.each(formatted, populateData);
}

function loadHelpForm() {

  document.querySelectorAll('.help-in-progress').forEach((e) => {
    e.classList.remove('help-in-progress');
  });
  this.classList.add('help-in-progress');

  const button = document
    .getElementById('send-help-button');

  button
    .addEventListener('click', handleSending);

  document
    .getElementById('service')
    .classList
    .add('hidden');

  document
    .getElementById('help-us-form')
    .classList
    .remove('hidden');

  const role = this.getAttribute('data-role');
  const country = this.getAttribute('data-country');
  const hint = `Please give us a wikipedia link or a reference on who is the ${roleNameMap[role]} of ${country}`;

  const inputf = document
    .getElementById('input-form')

  // when the 'input-form' changes we should call enableSending
  inputf.addEventListener('input', enableSending);
  // and we need to set the placeholder and other context info
  inputf.setAttribute('placeholder', hint);

  button.setAttribute('data-role', role);
  button.setAttribute('data-country', country);
}

function enableSending() {
  document
    .getElementById('send-help-button')
    .classList.remove('send-deny');
  document
    .getElementById('send-help-button')
    .classList.add('send-allow');
}

async function handleSending(event) {
  event.preventDefault();
  // if the button clicked has the class 'send-deny' return.
  if (event.target.classList.contains('send-deny')) {
    return;
  }

  const role = this.getAttribute('data-role');
  const country = this.getAttribute('data-country');

  const helpReceived = document
    .getElementById('input-form').value;
  // else, the whole 'help-us-form' become "Sending..."
  document
    .getElementById('help-us-form')
    .textContent = 'Sending...';
  // and we need to send the data to the server
  const url = serverURL('help');
  // we need to add country, role, and helpReceived as parameters

  const params = {
    country,
    role,
    helpReceived
  };

  const queryString = new URLSearchParams(params).toString();
  const urlAndParams = `${url}?${queryString}`;
  await fetch(urlAndParams);

  document
    .getElementById('help-us-form')
    .textContent = 'Received! Thank you!';

  // after 400 ms refresh the URL by reloading the page
  setTimeout(() => {
    window.location.reload();
  }, 400);

}

function loadUploadForm() {
  const test = document.getElementById("nocodb-embed");
  if (test) {
    console.log("Embed already loaded, removing the previous");
    test.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.src = "https://db.dontspy.eu/dashboard/#/nc/form/bf2949c3-56f3-4574-8d44-13b90551a995?embed";
  iframe.width = '100%';
  iframe.height = '1000';
  iframe.frameborder = "0";
  iframe.id = "nocodb-embed";
  iframe.classList.add("nc-embed");
  iframe.style.background = "transparent";
  const destinationElement = document.getElementById('upload-form-container');
  destinationElement.appendChild(iframe);

  const button = document.getElementById('load-upload-form');
  if (button)
    button.remove();

  destinationElement.scrollIntoView({ behavior: 'smooth' });
};

function populateData(data) {
  const container = document.querySelector('.container');

  // create the politician header 
  const header = document.createElement('div');

  if (data.fullname && data.role) {
    header.classList.add('politician-header');

    // data.role and data.name shape this element
    const headerFullTitle = document.createElement('p');
    headerFullTitle.textContent = data.fullname;
    headerFullTitle.classList = ['politician-name'];

    const officialTitle = document.createElement('span');
    officialTitle.classList = ['official-role'];
    officialTitle.textContent = roleNameMap[data.role];

    header.appendChild(officialTitle);
    header.appendChild(headerFullTitle);
  }

  /* header is appended in both cases because here the pictures get attached */
  container.appendChild(header);

  // data.items is an array of objects with img src and all the RBI metas
  data.items.forEach(item => {

    const column1 = document.createElement('div');
    column1.classList.add('column');

    const img1Normal = new Image();
    img1Normal.src = item.src;
    const img2Box = new Image();
    img2Box.src = item.boxpic;

    const img = document.createElement('img');
    img.classList.add('image');
    img.src = item.src;
    img.alt = item.description; // using the description as alt text

    img.addEventListener('mouseenter', (event) => {
      /* when the mouse is over the image, we need to show the boxpic */
      img.src = img2Box.src;
    });
    img.addEventListener('mouseout', (event) => {
      /* when the mouse is over the image, we need to show the boxpic */
      img.src = img1Normal.src;
    });

    column1.appendChild(img);
    header.appendChild(column1); // left side

    // and now the text
    const column2 = document.createElement('div');
    column2.classList.add('column');
    /* render RBI produces the text on the right of the picture */
    const details = document.createElement('p');
    details.classList.add('details');
    details.innerHTML = renderRBI(item.rbi, item.isfake, item.description);

    column2.appendChild(details); // it would render on the right or bottom
    header.appendChild(column2);
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
  if (isfake) {
    retval +=`<div>
      <div class="rbi-label">
        deepfake description <a class="why-deepfake" href="/blog/why-deepfake">(why?)</a>
      </div>
      <span class="deepfake-description">${description}</span>
    </div>`
  }

  /* expressions contains a dictionary of probabilities, we want to show the top 2 */
  /* sort the estimated expressions first */
  const sortedExpressions = _.sortBy(_.toPairs(rbi.expressions), (pair) => pair[1]).reverse();
  /* multiply to get percentages */
  const formatted = _.reduce(sortedExpressions, (memo, pair) => {
    if (memo.length === 2)
      return memo;
    memo.push({ exprname: pair[0], amount: _.round(pair[1] * 100, 2) });
    return memo;
  }, []);

  const firstTwoExpressions = `
    <code>${formatted[0].exprname} ${formatted[0].amount}%</code>
    <br>
    <code>${formatted[1].exprname} ${formatted[1].amount}%</code>
  `;

  retval += `
    <div class="rbi-label">
      Remote Biometric Identification report
    </div>
    <table>
      <tbody>
        <tr>
          <td>Gender:</td>
          <td>
            <code>${_.upperFirst(rbi.gender)}</b> ${_.round(rbi.genderProbability * 100, 1)}%</code>
          </td>
        </tr>
        <tr>
          <td>Age:</td>
          <td>
            <code>${_.round(rbi.age, 1)} years</code>
          </td>
        </tr>
        <tr>
          <td>Expressions:</td>
          <td>${firstTwoExpressions}</td>
        </tr>
      </tbody>
    </table>
  `;

  return retval;
}
