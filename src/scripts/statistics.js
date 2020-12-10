import { DateTime } from 'luxon';

async function getCovidData() {
  const response = await fetch('https://api.covid19api.com/summary');
  const data = await response.json();
  return data;
}

async function getCovidDataByCountry(country) {
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

async function setData() {
  const data = await getCovidData();
  const global = data.Global;
  const countries = data.Countries;
  const countriesCasesFragment = document.createDocumentFragment();
  const countriesDeathFragment = document.createDocumentFragment();
  const countriesRecoveredFragment = document.createDocumentFragment();

  countries.forEach((item) => {
    const casesBlock = document.createElement('div');
    const deathBlock = document.createElement('div');
    const recoveredBlock = document.createElement('div');

    casesBlock.classList.add('country-case');
    casesBlock.innerHTML = `
        <span class="dangerous">${item.TotalConfirmed}</span>
        <span class="country-name">${item.Country}</span>
        `;

    deathBlock.innerHTML = `
      <span class="dangerous">${item.TotalDeaths}</span>
      <span class="country-name">${item.Country}</span>
      `;
    recoveredBlock.innerHTML = `
      <span class="dangerous">${item.TotalConfirmed}</span>
      <span class="country-name">${item.Country}</span>
      `;

    countriesCasesFragment.appendChild(casesBlock);
    countriesDeathFragment.appendChild(deathBlock);
    countriesRecoveredFragment.appendChild(recoveredBlock);
  });

  document.getElementById('global-cases').innerHTML = global.TotalConfirmed;
  document.getElementById('countries-cases').appendChild(countriesCasesFragment);
  document.getElementById('death-data').appendChild(countriesDeathFragment);
  document.getElementById('recovered-data').appendChild(countriesRecoveredFragment);
}

export { getCovidData,
  setData,
  getCovidDataByCountry };
