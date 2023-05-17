const BASE_URL = 'https://restcountries.com/v3.1/';

function fetchCountries(nameCountries) {
  return fetch(
    `${BASE_URL}/name/${nameCountries}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (response.ok) {
      return response.json();
    } else throw new Error('Status code error: ' + response.status);
  });
}

export default { fetchCountries };
