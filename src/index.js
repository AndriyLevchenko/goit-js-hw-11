import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import templateFunction from './template.hbs';
const axios = require('axios').default;

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const inputNameCountry = document.querySelector('#search-box');

inputNameCountry.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// Пошуковий запит

function onSearch (e) {
    const entry = inputNameCountry.value.trim();
    cleanMarkup();   
    if (entry !== '') {
        fetchCountries(entry)
        .then(country => {      
            if (country.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
            } else if (country.length === 0) {
                Notify.failure('Oops, there is no country with that name');
            } else if (country.length >= 2 && country.length <= 10) {
                renderCountryList(country);
                Notify.warning('Select a country to learn more')
            } else if (country.length === 1) {
                renderCountryCard(country);
                Notify.success('Detailed information is displayed')
            }
        })
        .catch(onFetchError)
        .finally(() => console.log('Make a second request'));
    }
}

// Створення та рендер розмітки

function renderCountryList(country) {
    const markup = country.map(({flags, altSpellings}) => {
        return `
        <li class="card-svg" style = "display: flex">
            <img src="${flags.svg}" alt="${altSpellings[1]}" style = "margin: 1px 0px 1px 15px; width: 3%;">
            <p class="card-title" style = "margin: 0px 0px 0px 10px">${altSpellings[1]}</p>
        </li>`
    }).join('');
    console.log(country);
    countryList.innerHTML = markup;
}

function renderCountryCard(country) {
    const markup = country.map(({flags, altSpellings, capital, population, languages}) => {
        return `
        <div class="card" style = "border: solid; width: 300px">
            <div class="card-svg" style = "display: flex">
                <img src="${flags.svg}" alt="${altSpellings[1]}" style = "margin-left: 15px; width: 10%">
                <h2 class="card-title" style = "margin-left: 10px">${altSpellings[1]}</h2>
            </div>
            <div class="card-description" style = "margin-left: 15px">
                <p class="card-text">Capital: ${capital}</p>
                <p class="card-text">Population: ${population}</p>
                <p class="card-text">Languages: ${Object.values(languages)}</p>
            </div>
        </div>`
    }).join('');
    console.log(country);
    countryInfo.innerHTML = markup;
}

// Функція очистки розмітки

function cleanMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function onFetchError (error) {
    Notify.failure(
        `Oops, there is no country with that name`
    );
}







