import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/get-refs';
import API from './js/fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

refs.searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchInput = e.target.value.trim();
  if (!searchInput) {
    refs.countriesList.style.visibility = 'hidden';
    refs.countryInfo.style.visibility = 'hidden';
    refs.countriesList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  API.fetchCountries(searchInput)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      renderCountries(data);
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
    });
}

const generateMarkupCountryInfo = data =>
  data.reduce(
    (acc, { flags: { svg }, name, capital, population, languages }) => {
      console.log(languages);
      languages = Object.values(languages).join(', ');
      console.log(name);
      return (
        acc +
        `<img src="${svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`
      );
    },
    ''
  );

const generateMarkupCountryList = data =>
  data.reduce((acc, { name: { official, common }, flags: { svg } }) => {
    return (
      acc +
      `<li>
        <img src="${svg}" alt="${common}" width="70">
        <span>${official}</span>
      </li>`
    );
  }, '');

function renderCountries(result) {
  if (result.length === 1) {
    refs.countriesList.innerHTML = '';
    refs.countriesList.style.visibility = 'hidden';
    refs.countryInfo.style.visibility = 'visible';
    refs.countryInfo.innerHTML = generateMarkupCountryInfo(result);
  }
  if (result.length >= 2 && result.length <= 10) {
    refs.countryInfo.innerHTML = '';
    refs.countryInfo.style.visibility = 'hidden';
    refs.countriesList.style.visibility = 'visible';
    refs.countriesList.innerHTML = generateMarkupCountryList(result);
  }
}
