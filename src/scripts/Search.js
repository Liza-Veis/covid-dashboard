class Search {
  constructor(inputSelector, dataSelector) {
    this.inputSelector = inputSelector;
    this.dataSelector = dataSelector;
  }

  inputHandler(event) {
    const value = event.target.value.toLowerCase();
    document.querySelectorAll(`.${this.dataSelector}`).forEach((item) => {
      if (item.textContent.toLowerCase().search(value) === -1) {
        item.setAttribute('data-hide', '');
      } else {
        item.removeAttribute('data-hide');
      }
    });
  }

  async init() {
    this.inputSelector.addEventListener('input', this.inputHandler.bind(this));
  }
}

export default Search;
