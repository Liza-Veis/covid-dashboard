class CovidDataMiner {
  constructor(totalCasesSelector,
    totalDeathsSelector, totalRecoveredSelector, countryCasesSelector,
    countryDeathsSelector, countryRecoveredSelector, countryNameSelector) {
    this.baseUrl = 'https://corona.lmao.ninja/v3/covid-19/countries';
    this.isTotal = true;
    this.isDivided = false;
    this.isHandled = false;
    this.selectedCountryIso3 = 'BLR';
    this.perHundredThousand = 100000;
    this.populationData = [];
    this.totalCasesSelector = totalCasesSelector;
    this.totalDeathsSelector = totalDeathsSelector;
    this.totalRecoveredSelector = totalRecoveredSelector;
    this.countryCasesSelector = countryCasesSelector;
    this.countryDeathsSelector = countryDeathsSelector;
    this.countryRecoveredSelector = countryRecoveredSelector;
    this.countryNameSelector = countryNameSelector;
  }

  async getData() {
    const response = await fetch(this.baseUrl);
    const data = await response.json();
    return data;
  }

  async setGlobalData() {
    const data = await this.getData();
    const totalCasesFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'cases' : 'todayCases');
    const totalDeathsFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'deaths' : 'todayDeaths');
    const TotalRecoveredFragment = await this.createCountriesDataFragment(data, this.isTotal ? 'recovered' : 'todayRecovered');
    this.totalCasesSelector.innerHTML = '';
    this.totalDeathsSelector.innerHTML = '';
    this.totalRecoveredSelector.innerHTML = '';
    this.totalCasesSelector.appendChild(totalCasesFragment);
    this.totalDeathsSelector.appendChild(totalDeathsFragment);
    this.totalRecoveredSelector.appendChild(TotalRecoveredFragment);
  }

  async setCountryData(countryIso3) {
    this.selectedCountryIso3 = countryIso3;
    const data = await this.getDataByCountry(this.selectedCountryIso3);
    const tabs = document.querySelector('.tabs__content');
    this.countryCasesSelector.innerHTML = await this.getRefactorCountryData(data, this.isTotal ? 'cases' : 'todayCases');
    this.countryDeathsSelector.innerHTML = await this.getRefactorCountryData(data, this.isTotal ? 'deaths' : 'todayDeaths');
    this.countryRecoveredSelector.innerHTML = await this.getRefactorCountryData(data, this.isTotal ? 'recovered' : 'todayRecovered');
    this.countryNameSelector.innerHTML = data.country;
    if (!this.isHandled) {
      tabs.addEventListener('click', await this.countryListClickHandler.bind(this), false);
      this.isHandled = true;
    }
    document.querySelector('#search').value = '';
    document.querySelector('#search').dispatchEvent(new Event('input'));
  }

  async countryListClickHandler(event) {
    if (event.target.classList.contains('countries-list__item')) {
      await this.setCountryData(event.target.getAttribute('data-iso3'));
    } else if (event.target.classList.contains('countries-list__number')
    || event.target.classList.contains('countries-list__flag')
    || event.target.classList.contains('countries-list__country-name')) {
      await this.setCountryData(event.target.parentNode.getAttribute('data-iso3'));
    }
  }

  async init() {
    await this.setGlobalData();
    await this.setCountryData(this.selectedCountryIso3);
  }

  async changeIsTotalState() {
    this.isTotal = !this.isTotal;
    await this.init();
  }

  async changeIsDividedState() {
    this.isDivided = !this.isDivided;
    await this.init();
  }

  async getDataByCountry(iso3) {
    const countryData = await (await fetch(`https://corona.lmao.ninja/v3/covid-19/countries/${iso3}`)).json();
    return countryData;
  }

  async createCountriesDataFragment(data, value) {
    const fragment = document.createDocumentFragment();
    const countries = data.sort((a, b) => b[value] - a[value]);
    countries.forEach((item) => {
      const block = document.createElement('div');
      block.className = 'countries-list__item';
      block.setAttribute('data-iso3', item.countryInfo.iso3);
      block.innerHTML = `
          <span class="countries-list__country-name">${item.country}</span>
          <div class="countries-list__flag" style="background-image: url(${item.countryInfo.flag})"></div>
          <span class="countries-list__number">${this.isDivided ? ((item[value] / item.population) * this.perHundredThousand).toFixed(2) : item[value] }</span>
          `;
      fragment.append(block);
    });
    return fragment;
  }

  async getRefactorCountryData(country, value) {
    return this.isDivided ? ((country[value] / country.population)
    * this.perHundredThousand).toFixed(2) : country[value];
  }
}

export default CovidDataMiner;
