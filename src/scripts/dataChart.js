import Chart from 'chart.js';

class DataChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.url = 'https://disease.sh/v3/covid-19/historical/all';
    this.lastUpdated = null;
    this.titles = ['Total confirmed', 'Total deaths', 'Total recovered'];
    this.chartParams = ['cases', 'deaths', 'recovered'];
    this.bgColors = ['rgba(247, 202, 24, 1)', 'rgba(246, 36, 89, 1)', 'rgba(35, 203, 167, 1)'];
    this.data = [];
    this.dailyData = [];
    this.chart = null;
  }

  async getGlobalData() {
    const candidate = await this.getCandidate();
    if (this.lastUpdated !== candidate || !this.data.length) {
      const response = await fetch(this.url);
      const data = await response.json();
      this.data = data;
      this.lastUpdated = data.updated;
    }
    return this.data;
  }

  async getDailyData() {
    const candidate = await this.getCandidate();
    if (this.lastUpdated !== candidate || !this.data.length) {
      const response = await fetch('https://disease.sh/v3/covid-19/all');
      const data = await response.json();
      this.dailyData = [data.todayCases, data.todayDeaths, data.todayRecovered];
    }
    return this.dailyData;
  }

  async getDataByValue(value) {
    this.chart.destroy();
    this.resetCanvas();
    if (value === 'country total' || value === 'country daily') {
      const country = document.querySelector('.statistics__country-name');
      const attribute = country.getAttribute('data-iso3');
      let dataForUpdate = [null, null, null];
      if (attribute) {
        const response = await fetch(`https://disease.sh/v3/covid-19/countries/${country.getAttribute('data-iso3')}`);
        const data = await response.json();
        if (value === 'country total') {
          dataForUpdate = [data.cases, data.deaths, data.recovered];
        } else {
          dataForUpdate = [data.todayCases, data.todayDeaths, data.todayRecovered];
        }
      }
      this.chart = new Chart(this.canvas, {
        type: 'horizontalBar',
        data: {
          labels: this.chartParams,
          datasets: [{
            data: dataForUpdate,
            backgroundColor: this.bgColors
          }],
          options: this.options
        }
      });
      this.chart.options.title.text = attribute ? country.textContent : 'Country not selected';
      this.chart.options.scales.yAxes[0].ticks.beginAtZero = true;
    } else if (value === 'daily') {
      const dataForUpdate = await this.getDailyData();
      this.chart = new Chart(this.canvas, {
        type: 'horizontalBar',
        data: {
          labels: this.chartParams,
          datasets: [{
            data: dataForUpdate,
            backgroundColor: this.bgColors
          }],
          options: this.options
        }
      });
      this.chart.options.title.text = 'Daily cases';
    } else {
      const data = await this.getGlobalData();
      const dataArray = (Object.entries(data[value]));
      const dataValues = [];
      const dataLabels = [];
      const index = this.chartParams.indexOf(value);
      dataArray.forEach((item) => {
        dataLabels.push(item[0].slice(0, 5));
        dataValues.push(item[1]);
      });
      this.chart = new Chart(this.canvas, {
        type: 'bar',
        data: {
          labels: dataLabels,
          datasets: [{
            data: dataValues,
            backgroundColor: this.bgColors[index]
          }]
        },
        options: this.options
      });
      this.chart.options.title.text = this.titles[index];
    }
    this.chart.options.title.display = true;
    this.chart.options.legend.display = false;
    this.chart.update();
  }

  async getCandidate() {
    const candidate = await (await fetch('https://disease.sh/v3/covid-19/all')).json();
    return candidate.updated;
  }

<<<<<<< HEAD
  async init() {
    if (this.chart) {
      this.chart.destroy();
    }
=======
  async updateData() {
    const candidate = await this.getCandidate();
    if (candidate !== this.lastUpdated) {
      clearInterval(this.interval);
      this.init();
    }
  }

  async init() {
    this.resetCanvas();

>>>>>>> develop
    const allData = await this.getGlobalData();
    const dataArray = Object.entries(allData.cases);
    const dataValues = [];
    const dataLabels = [];
    dataArray.forEach((item) => {
      dataLabels.push(item[0].slice(0, 5));
      dataValues.push(item[1]);
    });
    this.chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: dataLabels,
        datasets: [{
          data: dataValues,
          backgroundColor: this.bgColors[0]
        }]
      },
      options: {
        title: {
          display: true,
          text: `${this.titles[0]}`
        },
        legend: {
          labels: ''
        },
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: false,
              stepSize: 5000,
              maxTicksLimit: 12
            }
          }]
        }
      }
    });
    clearInterval(this.interval);
    this.options = Object.assign({}, this.chart.options);
  }

  resetCanvas() {
    const oldCanvas = this.canvas;
    const canvas = document.createElement('canvas');
    this.canvas.replaceWith(canvas);
    canvas.id = 'chart';
    oldCanvas.remove();
    this.canvas = canvas;
  }
}

export default DataChart;
