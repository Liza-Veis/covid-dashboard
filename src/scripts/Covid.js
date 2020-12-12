/* eslint-disable max-len */
// import { DateTime } from 'luxon';

class Covid {
  constructor(informer, globalCasesSelector, totalCasesSelector,
    totalDeathsSelector, totalRecoveredSelector) {
    this.baseUrl = 'https://api.covid19api.com/';
    this.isTotal = true;
    this.isDivided = false;
    this.selectedCountry = null;
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

  resetSelectorsData() {
    this.totalCasesSelector.innerHTML = '';
    this.totalDeathsSelector.innerHTML = '';
    this.totalRecoveredSelector.innerHTML = '';
  }

  async setData() {
    this.resetSelectorsData();
    this.selectedCountry = null;
    const data = await this.getData();
    this.globalCasesSelector.innerHTML = data.global.TotalConfirmed;
    const totalCasesFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalConfirmed' : 'NewConfirmed');
    const totalDeathsFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalDeaths' : 'NewDeaths');
    const TotalRecoveredFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'TotalRecovered' : 'NewRecovered');
    this.totalCasesSelector.appendChild(totalCasesFragment);
    this.totalDeathsSelector.appendChild(totalDeathsFragment);
    this.totalRecoveredSelector.appendChild(TotalRecoveredFragment);
  }

  async setCountryData(country) {
    this.resetSelectorsData();
    const data = await this.getDataByCountry(country);
    this.selectedCountry = country;
    const totalCasesFragment = await this.createCountryFragment(data, this.isTotal ? 'TotalConfirmed' : 'NewConfirmed');
    const totalDeathsFragment = await this.createCountryFragment(data, this.isTotal ? 'TotalDeaths' : 'NewDeaths');
    const TotalRecoveredFragment = await this.createCountryFragment(data, this.isTotal ? 'TotalRecovered' : 'NewRecovered');
    this.totalCasesSelector.appendChild(totalCasesFragment);
    this.totalDeathsSelector.appendChild(totalDeathsFragment);
    this.totalRecoveredSelector.appendChild(TotalRecoveredFragment);
  }

  async changeIsTotalState() {
    this.isTotal = !this.isTotal;
    if (this.selectedCountry) {
      await this.setCountryData(this.selectedCountry);
    } else {
      await this.setData();
    }
  }

  async changeIsDividedState() {
    this.isDivided = !this.isDivided;
    if (this.selectedCountry) {
      await this.setCountryData(this.selectedCountry);
    } else {
      await this.setData();
    }
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

  async createCountryFragment(country, value) {
    const block = document.createElement('div');
    const populationData = (await this.getPopulationData()).find((item) => item.name.toLowerCase()
    === country.Country.toLowerCase()).population;
    block.innerHTML = `
    <span class="dangerous">${this.isDivided ? ((country[value] / populationData) * this.perHundredThousand).toFixed(2) : country[value] }</span>
    <span class="country-name">${country.Country}</span>
    `;

    return block;
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
    const countries = data.countries;

    countries.forEach((item) => {
      const dataBlock = document.createElement('div');
      dataBlock.classList.add(dataBlockClass);
      dataBlock.textContent = item.Country;
      dataBlock.setAttribute('data-country', item.Country);
      block.appendChild(dataBlock);
    });

    return block;
  }

  // Закомментировал так как не будем использовать дополнительное поле. Удалю на этапе связки с интерфейсом.
  // async createSearchAndSelectResultCountryFragment(name, blockClassList = 'country-data', titleClassList = 'title') {
  //   const data = await this.getDataByCountry(name);
  //   const countryPopulation = await this.informer.getCountryPopulation(name);
  //   const fragment = document.createDocumentFragment();
  //   const dataBlock = document.createElement('div');
  //   dataBlock.className = blockClassList;

  //   let confirmedSick;
  //   let deathSick;
  //   let recoveredSick;

  //   if (this.isTotal) {
  //     confirmedSick = data.TotalConfirmed;
  //     deathSick = data.TotalDeaths;
  //     recoveredSick = data.TotalRecovered;
  //   } else {
  //     confirmedSick = data.NewConfirmed;
  //     deathSick = data.NewDeaths;
  //     recoveredSick = data.NewDeaths;
  //   }

  //   dataBlock.innerHTML = `
  //   <h2 class=${titleClassList}>Confirmed: ${this.isDivided ? ((confirmedSick / countryPopulation) * this.perHundredThousand).toFixed(2)
  // : confirmedSick}</h2>
  //   <h2 class=${titleClassList}>Deaths: ${this.isDivided ? ((deathSick / countryPopulation) * this.perHundredThousand).toFixed(2)
  // : deathSick}</h2>
  //   <h2 class=${titleClassList}>Recovered: ${this.isDivided ? ((recoveredSick / countryPopulation) * this.perHundredThousand).toFixed(2)
  // : recoveredSick}</h2>
  //   `;
  //   fragment.appendChild(dataBlock);
  //   return fragment;
  // }
}

export default Covid;
