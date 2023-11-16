function processWeirdNames(listofp) {

  /* if there are 2, good */
  if(listofp.length === 2) {
    return {
      Name: listofp[0].trim(),
      Surname: listofp[1].trim()
    }
  } else if(listofp.length === 3) {
    console.log("3 -> %o", listofp);
    /* assume is name name surname */
    return {
      Name: `${listofp[0].trim()} ${listofp[1].trim()}`,
      Surname: listofp[2].trim()
    }
  } else if(listofp.length === 4) {
    console.log("4 -> %o", listofp);
    /* assume is name name surname surname */
    return {
      Name: `${listofp[0].trim()} ${listofp[1].trim()}`,
      Surname: `${listofp[2].trim()} ${listofp[3].trim()}`
    }
  } else {
    console.log("Unable to process name %o", listofp);
    return {
      Name: "Error",
      Surname: "Please Debug",
    }
  }
}

async function loadIndividual() {
  /* pick from the URL, after the #, the country name */
  const mixedFullName = window.location.href.split('#').pop();
  console.log(`-> Mixed full name: ${mixedFullName}`);
  let Name, Surname, response, data = [];
  try {
    const zipped = decodeURIComponent(mixedFullName).split(' ');
    const NB = processWeirdNames(zipped);
    Name = NB.Name;
    Surname = NB.Surname;
    console.log(`-> Name: ${Name} Surname: ${Surname}`);
    const url = serverURL('individuals', { Name, Surname });
    response = await fetch(url);
    data = await response.json();
  } catch (error) {
    console.error(error);
  }

  /* now we can populate the table, or the error message if is missing */
  if (data.length === 0) {
    const container = document.querySelector('#face-list');
    container.innerHTML = `<div class="alert error">
      No data for ${Name} ${Surname}!
    </div>
    <div class="alert info">
      Solve by ensuring this policy maker is registered, and then "Upload a new picture"
    </div>`;
    return;
  }

  const cleanName = `${Name} ${Surname}`;
  const countryName = data[0].Country;
  console.log(data);

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

  document
    .querySelectorAll('.policymaker-name')
    .forEach((e) => {
      e.innerText = cleanName;
    });

  document
    .querySelectorAll('.policymaker-role')
    .forEach((e) => {
      e.innerText = data[0].OfficialRole;
    });

  document
    .querySelectorAll('.country-link')
    .forEach((e) => {
      e.setAttribute('href', `/country#${countryName}`);
    });

  /* reused the existing format even if we have only one policymaker,
     but in this case we invert the presence of the 'box' file */
  const items = _.map(data, (photo) => {
    return {
      boxpic: `${baseURL()}/${photo.image}`,
      src: `${baseURL()}/${photo.boxfile}`,
      rbi: photo.rbi,
      isfake: photo.isfake,
      description: photo.Description ?? `Official potrait of ${cleanName}`,
    }
  });

  const formatted = [{
    /* if both are null, the politician header name/role will not be there */
    role: null, fullname: null,
    items
  }];

  /* function implemented in country.js */
  _.each(formatted, populateData);
}
