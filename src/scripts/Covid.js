// import { DateTime } from 'luxon';

class Covid {
  constructor(informer, globalCasesSelector, totalCasesSelector,
    totalDeathsSelector, totalRecoveredSelector) {
    this.baseUrl = 'https://api.covid19api.com/';
    this.isTotal = true;
    this.isDivided = true;
    this.perHundredThousand = 100000;
    this.populationData = [];
    this.informer = informer;
    this.globalCasesSelector = globalCasesSelector;
    this.totalCasesSelector = totalCasesSelector;
    this.totalDeathsSelector = totalDeathsSelector;
    this.totalRecoveredSelector = totalRecoveredSelector;
  }

  async getData() {
    const response = await fetch(`${this.baseUrl}summary`);
    const data = await response.json();
    return {
      global: data.Global,
      countries: data.Countries
    };
  }

  async setData() {
    const data = await this.getData();
    this.globalCasesSelector.innerHTML = data.global.TotalConfirmed;
    const totalCasesFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalConfirmed' : 'NewConfirmed');
    const totalDeathsFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalDeaths' : 'NewDeaths');
    const TotalRecoveredFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalRecovered' : 'NewRecovered');
    this.totalCasesSelector.appendChild(totalCasesFragment);
    this.totalDeathsSelector.appendChild(totalDeathsFragment);
    this.totalRecoveredSelector.appendChild(TotalRecoveredFragment);
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
    countries.forEach(async (item) => {
      const block = document.createElement('div');
      let population = null;
      if (this.isDivided) {
        population = populationData.find((country) => country.name.toLowerCase()
         === item.Country.toLowerCase()).population;
      }
      block.innerHTML = `
          <span class="dangerous">${this.isDivided ? ((item[value] / population) * this.perHundredThousand).toFixed(2) : item[value] }</span>
          <span class="country-name">${item.Country}</span>
          `;
      fragment.appendChild(block);
    });
    return fragment;
  }

  createCountrySelectList(data, selectClassName, optionClassName) {
    const select = document.createElement('select');
    select.className = selectClassName;

    data.forEach((item) => {
      const option = document.createElement('option');
      option.className = optionClassName;
      option.textContent = item.Country;
      option.value = item.Country;
      select.appendChild(option);
    });

    return select;
  }

  createCountrySearchList(data, wrapperClass, dataBlockClass) {
    const block = document.createElement('div');
    block.classList.add(wrapperClass);

    data.forEach((item) => {
      const dataBlock = document.createElement('div');
      dataBlock.classList.add(dataBlockClass);
      dataBlock.textContent = item.Country;
      dataBlock.setAttribute('data-country', item.Country);
      block.appendChild(dataBlock);
    });

    return block;
  }

  async createSearchAndSelectResultCountryFragment(name, blockClassList = 'country-data', titleClassList = 'title') {
    const data = await this.getDataByCountry(name);
    const countryPopulation = await this.informer.getCountryPopulation(name);
    const fragment = document.createDocumentFragment();
    const dataBlock = document.createElement('div');
    dataBlock.className = blockClassList;

    let confirmedSick;
    let deathSick;
    let recoveredSick;

    if (this.isTotal) {
      confirmedSick = data.TotalConfirmed;
      deathSick = data.TotalDeaths;
      recoveredSick = data.TotalRecovered;
    } else {
      confirmedSick = data.NewConfirmed;
      deathSick = data.NewDeaths;
      recoveredSick = data.NewDeaths;
    }

    dataBlock.innerHTML = `
    <h2 class=${titleClassList}>Confirmed: ${this.isDivided ? ((confirmedSick / countryPopulation) * this.perHundredThousand).toFixed(2)
  : confirmedSick}</h2>
    <h2 class=${titleClassList}>Deaths: ${this.isDivided ? ((deathSick / countryPopulation) * this.perHundredThousand).toFixed(2)
  : deathSick}</h2>
    <h2 class=${titleClassList}>Recovered: ${this.isDivided ? ((recoveredSick / countryPopulation) * this.perHundredThousand).toFixed(2)
  : recoveredSick}</h2>
    `;
    fragment.appendChild(dataBlock);
    return fragment;
  }
}

export default Covid;
