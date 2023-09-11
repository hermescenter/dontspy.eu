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

}
