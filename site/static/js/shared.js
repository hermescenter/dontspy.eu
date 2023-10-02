
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
  if(filter)
    return baseURL() + '/api/' + path + '/' + JSON.stringify(filter);
  else
    return baseURL() + '/api/' + path;
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

const displayOrder = ['Prime Minister', 'AIAct Gov Representative', 'Interior Minister', 'Justice Minister', 'Defense Minister'];
