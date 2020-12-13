// import { DateTime } from 'luxon';

class CovidDataMiner {
  constructor(informer, globalCasesSelector, totalCasesSelector,
    totalDeathsSelector, totalRecoveredSelector, countryCasesSelector,
    countryDeathsSelector, countryRecoveredSelector, countryNameSelector) {
    this.baseUrl = 'https://api.covid19api.com/';
    this.isTotal = true;
    this.isDivided = false;
    this.isHandled = false;
    this.selectedCountry = 'Belarus';
    this.perHundredThousand = 100000;
    this.populationData = [];
    this.informer = informer;
    this.globalCasesSelector = globalCasesSelector;
    this.totalCasesSelector = totalCasesSelector;
    this.totalDeathsSelector = totalDeathsSelector;
    this.totalRecoveredSelector = totalRecoveredSelector;
    this.countryCasesSelector = countryCasesSelector;
    this.countryDeathsSelector = countryDeathsSelector;
    this.countryRecoveredSelector = countryRecoveredSelector;
    this.countryNameSelector = countryNameSelector;
  }

  async getData() {
    const response = await fetch(`${this.baseUrl}summary`);
    const data = await response.json();
    return {
      global: data.Global,
      countries: data.Countries
    };
  }

  async setGlobalData() {
    const data = await this.getData();
    const totalCasesFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalConfirmed' : 'NewConfirmed');
    const totalDeathsFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalDeaths' : 'NewDeaths');
    const TotalRecoveredFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalRecovered' : 'NewRecovered');
    this.totalCasesSelector.innerHTML = '';
    this.totalDeathsSelector.innerHTML = '';
    this.totalRecoveredSelector.innerHTML = '';
    this.totalCasesSelector.appendChild(totalCasesFragment);
    this.totalDeathsSelector.appendChild(totalDeathsFragment);
    this.totalRecoveredSelector.appendChild(TotalRecoveredFragment);
  }

  async setCountryData(country) {
    this.selectedCountry = country;
    const data = await this.getDataByCountry(this.selectedCountry);
    const tabs = document.querySelector('.tabs__content');
    this.countryCasesSelector.innerHTML = await this.getRefactorCountryData(data, this.isTotal ? 'TotalConfirmed' : 'NewConfirmed');
    this.countryDeathsSelector.innerHTML = await this.getRefactorCountryData(data, this.isTotal ? 'TotalDeaths' : 'NewDeaths');
    this.countryRecoveredSelector.innerHTML = await this.getRefactorCountryData(data, this.isTotal ? 'TotalRecovered' : 'NewRecovered');
    this.countryNameSelector.innerHTML = this.selectedCountry;
    // this.countryNameSelector.style.backgroundImage =
    // `url(${await this.informer.getCountryFlag(country)})`;
    if (!this.isHandled) {
      tabs.addEventListener('click', await this.countryListClickHandler.bind(this), false);
      this.isHandled = true;
    }
    document.querySelector('#search').value = '';
    document.querySelector('#search').dispatchEvent(new Event('input'));
  }

  async countryListClickHandler(event) {
    if (event.target.classList.contains('countries-list__item')) {
      const countryName = event.target.querySelector('.countries-list__country-name').textContent;
      await this.setCountryData(countryName);
    } else if (event.target.classList.contains('countries-list__country-name')) {
      await this.setCountryData(event.target.textContent);
    } else if (event.target.classList.contains('countries-list__number')
    || event.target.classList.contains('countries-list__flag')) {
      const countryName = event.target.parentNode.querySelector('.countries-list__country-name').textContent;
      await this.setCountryData(countryName);
    }
  }

  async init() {
    await this.setGlobalData();
    await this.setCountryData(this.selectedCountry);
  }

  async changeIsTotalState() {
    this.isTotal = !this.isTotal;
    await this.init();
  }

  async changeIsDividedState() {
    this.isDivided = !this.isDivided;
    await this.init();
  }

  async getPopulationData() {
    if (!this.populationData.length) {
      this.populationData = await this.informer.getAllData();
    }
    return this.populationData;
  }

  async getDataByCountry(name) {
    const countryData = (await this.getData()).countries;
    const searchCountry = Object.assign({}, countryData.find(
      (item) => item.Country.toLowerCase() === name.toLowerCase()
    ));
    return searchCountry;
  }

  async createCountriesDataFragment(data, value) {
    const fragment = document.createDocumentFragment();
    const countries = data.countries.sort((a, b) => b[value] - a[value]);
    const populationData = await this.getPopulationData();
    countries.forEach((item) => {
      const block = document.createElement('div');
      block.className = 'countries-list__item';
      block.setAttribute('data-country', item.Country);
      const countryData = populationData.find((country) => country.name.toLowerCase()
      === item.Country.toLowerCase());
      block.innerHTML = `
          <span class="countries-list__number">${this.isDivided ? ((item[value] / countryData.population) * this.perHundredThousand).toFixed(2) : item[value] }</span>
          <span class="countries-list__country-name">${item.Country}</span>
          <div class="countries-list__flag" style="background-image: url(${countryData.flag})"></div>
          `;
      fragment.append(block);
    });
    return fragment;
  }

  async getRefactorCountryData(country, value) {
    const populationData = (await this.getPopulationData()).find((item) => item.name.toLowerCase()
    === country.Country.toLowerCase()).population;
    return this.isDivided ? ((country[value] / populationData)
    * this.perHundredThousand).toFixed(2) : country[value];
  }
}

export default CovidDataMiner;
