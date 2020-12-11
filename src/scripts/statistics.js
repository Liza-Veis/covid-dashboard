import { DateTime } from 'luxon';

async function getData() {
  const response = await fetch('https://api.covid19api.com/summary');
  const data = await response.json();
  return data;
}

async function getDataByCountry(country) {
  const today = DateTime.utc().set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
  const yesterday = today.minus({ days: 1 });
  const baseUrl = 'https://api.covid19api.com/country/';
  const timeSlug = `?from=${yesterday.toString()}&to=${today.toString()}`;
  const url = `${baseUrl}${country}${timeSlug}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0];
}

function setCountriesData(data, value, selectorId) {
  const fragment = document.createDocumentFragment();
  const countries = data.sort((a, b) => b[value] - a[value]);
  countries.forEach((item) => {
    const block = document.createElement('div');

    block.innerHTML = `
        <span class="dangerous">${item[value]}</span>
        <span class="country-name">${item.Country}</span>
        `;
    fragment.appendChild(block);
  });

  document.getElementById(selectorId).appendChild(fragment);
}

function setCountrySelectList(data, selectorId) {
  const select = document.createElement('select');
  select.classList.add('select-country');

  data.forEach((item) => {
    const option = document.createElement('option');
    option.classList.add('country-option');
    option.textContent = item.Country;
    option.value = item.Country;
    select.appendChild(option);
  });

  document.getElementById(selectorId).prepend(select);
}

function setSearchCountryData(data, selectorId) {
  const block = document.createElement('div');
  block.classList.add('search-data');

  data.forEach((item) => {
    const dataBlock = document.createElement('div');
    dataBlock.classList.add('search-data-result');
    dataBlock.textContent = item.Country;
    dataBlock.setAttribute('data-country', item.Country);
    block.appendChild(dataBlock);
  });

  document.getElementById(selectorId).appendChild(block);
}

async function setData() {
  const data = await getData();
  const global = data.Global;
  const countries = data.Countries;
  setCountriesData(countries, 'TotalConfirmed', 'countries-cases');
  setCountriesData(countries, 'TotalDeaths', 'death-data');
  setCountriesData(countries, 'TotalRecovered', 'recovered-data');
  setCountrySelectList(countries, 'country-data-select');
  setSearchCountryData(countries, 'search-section');

  document.getElementById('global-cases').innerHTML = global.TotalConfirmed;
}

async function setCountryData(value, selectorId) {
  const data = await getDataByCountry(value);
  const activeSick = data.Active;
  const confirmedSick = data.Confirmed;
  const deathSick = data.Deaths;
  const recoveredSick = data.Recovered;

  document.getElementById(selectorId).innerHTML = `
      <h2>Active: ${activeSick}</h2>
      <h2>Confirmed: ${confirmedSick}</h2>
      <h2>Deaths: ${deathSick}</h2>
      <h2>Recovered: ${recoveredSick}</h2>
  `;
}

export { getData,
  setData,
  setCountryData };
