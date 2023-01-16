import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchBoxEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.searchBoxEl.addEventListener(
  'input',
  debounce(onInputCountry, DEBOUNCE_DELAY)
);

function onInputCountry(e) {
  const countryName = e.target.value.trim();
  if (countryName === '') {
    return;
  }

  cleanCountriesMurkap();
  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length === 1) {
        createCountryInfo(countries[0]);
      }
      if (countries.length > 1 && countries.length <= 10) {
        createCountryList(countries);
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else {
        Notiflix.Notify.failure(error.message);
      }
    });
}

function createCountryInfo(country) {
  const markup = `<h3><img src="${country.flags.svg}" alt="flag" 
    height="24"> ${country.name.official}</h3>
        <p>Capital: <span>${country.capital}</span></p>
        <p>Population: <span>${country.population}</span></p>
        <p>Languages: <span>${Object.values(country.languages).join(
          ', '
        )}</span></p>`;
  refs.countryInfoEl.innerHTML = markup;
}

function createCountryList(countries) {
  const murkap = countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="flag" width="30" height="20">
        <span>${country.name.official}</span>
      </li>`;
    })
    .join('');
  refs.countryListEl.innerHTML = murkap;
}

function cleanCountriesMurkap() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}
