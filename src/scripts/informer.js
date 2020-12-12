class informer {
  constructor() {
    this.url = '../assets/data/populationData.json';
    this.commonData = [];
  }

  async getAllData() {
    if (!this.commonData.length) {
      const response = await fetch(this.url);
      const data = await response.json();
      this.commonData = data;
    }
    return this.commonData;
  }

  async getDataByCountry(name) {
    const data = this.commonData.length ? this.commonData : await this.getAllData();
    const targetObj = Object.assign({}, data.find((item) => item.name.toLowerCase()
      === name.toLowerCase()));
    return targetObj;
  }

  async getCountryPopulation(name) {
    const data = this.commonData.length ? this.commonData : await this.getAllData();
    const result = data.find((item) => item.name.toLowerCase() === name.toLowerCase()).population;
    return result;
  }

  async getCountryFlag(name) {
    const data = this.commonData.length ? this.commonData : await this.getAllData();
    return data.find((item) => item.name.toLowerCase() === name).flag;
  }
}

export default informer;
