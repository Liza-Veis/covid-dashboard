class Search {
  constructor(covidDataMiner, inputSelector, dataWrapper, dataSelector) {
    this.covidDataMiner = covidDataMiner;
    this.inputSelector = inputSelector;
    this.dataWrapper = dataWrapper;
    this.dataSelector = dataSelector;
  }

  inputHandler(event) {
    const value = event.target.value.toLowerCase();
    document.querySelectorAll(`.${this.dataSelector}`).forEach((item) => {
      if (item.textContent.toLocaleLowerCase().search(value) === -1) {
        item.setAttribute('data-hide', '');
      } else {
        item.removeAttribute('data-hide');
      }
    });
  }

  async selectCountryHandler(event) {
    if (event.target.classList.contains(this.dataSelector)) {
      const country = event.target.getAttribute('data-country');
      await this.covidDataMiner.setCountryData(country);
      this.inputSelector.blur();
    }
  }

  async init() {
    this.inputSelector.addEventListener('input', this.inputHandler.bind(this));
    this.dataWrapper.addEventListener('click', await this.selectCountryHandler.bind(this));
    this.dataWrapper.appendChild(await this.covidDataMiner.createCountrySearchList(await this.covidDataMiner.getData(), 'wrapper', this.dataSelector));
  }
}

export default Search;
