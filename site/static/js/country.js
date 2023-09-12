function serverURL(path, filter) {
  /* if we're in production the server is at the same address as the website, otherwise
   * the server is at localhost:2024 */
  var server = window.location.hostname;
  if (server === 'localhost') {
    server = 'http://localhost:2024';
  } else {
    server = 'https://' + server;
  }
  return server + '/api/' + path + '/' + JSON.stringify(filter);
}

async function loadMaterial() {
  /* pick from the URL, after the #, the country name */
  const countryName = window.location.href.split('#').pop();
  console.log(countryName);
  const url = serverURL('individuals', { Country: countryName });
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  /* now we can populate the table */

  const grouped = _.groupBy(data, 'OfficialRole');

  const displayOrder = ['Prime Minister', 'AIAct Gov Representative', 'Interior Minister', 'Justice Minister', 'Defense Minister'];

  const formatted = _.compact(_.map(displayOrder, (role) => {
    const pictures = grouped[role];
    if (!pictures) {
      return null;
    }
    return {
      text: `${role} ${pictures[0].Name} ${pictures[0].Surname}`,
      items: _.map(pictures, (photo) => {
        return {
          src: `https://db.dontspy.eu/${photo.image.path}`,
          description: JSON.stringify(photo.rbi)
        };
      })
    };
  }));

  console.log(formatted);
  _.each(formatted, populateData);
}

function populateData(data) {
  const container = document.querySelector('.container');

  // Assuming data.text contains the text entry
  const textEntry = document.createElement('h1');
  textEntry.textContent = data.text;
  container.appendChild(textEntry);

  // Assuming data.items is an array of objects with img and description
  data.items.forEach(item => {
    const pictureDescription = document.createElement('div');
    pictureDescription.classList.add('picture-description');

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.description; // using the description as alt text

    const description = document.createElement('p');
    description.textContent = item.description;

    pictureDescription.appendChild(img);
    pictureDescription.appendChild(description);
    container.appendChild(pictureDescription);
  });
}
