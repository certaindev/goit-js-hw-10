const BASE_URL = `https://restcountries.com/v3.1/name`;

export function fetchCountries(countryName) {
  return fetch(
    `${BASE_URL}/${countryName}?fields=name,capital,flags,population,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
