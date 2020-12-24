import Chart from 'chart.js';

Chart.defaults.global.defaultFontColor = '#9d97a5';
Chart.defaults.global.defaultFontFamily = '"Nunito", sans-serif';
Chart.defaults.global.title.fontSize = 18;
Chart.defaults.global.maintainAspectRatio = false;

class DataChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=all';
    this.titles = ['Total confirmed', 'Total deaths', 'Total recovered'];
    this.chartParams = ['cases', 'deaths', 'recovered'];
    this.bgColors = ['rgba(240, 63, 131, 1)', 'rgba(240, 190, 63, 1)', 'rgba(77, 240, 63, 1)'];
    this.chart = null;
  }

  async getGlobalData() {
    const response = await fetch(this.url);
    const data = await response.json();
    return data;
  }

  async getDailyData() {
    const response = await fetch('https://disease.sh/v3/covid-19/all');
    const data = await response.json();
    const dailyData = [data.todayCases, data.todayDeaths, data.todayRecovered];
    return dailyData;
  }

  async getDataByValue(value) {
    this.resetCanvas();
    if (value === 'country total' || value === 'country daily') {
      const country = document.querySelector('.statistics__country-name');
      const attribute = country.getAttribute('data-iso3');
      let dataForUpdate = [null, null, null];
      if (attribute) {
        const response = await fetch(
          `https://disease.sh/v3/covid-19/countries/${country.getAttribute('data-iso3')}`
        );
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
          datasets: [
            {
              data: dataForUpdate,
              backgroundColor: this.bgColors
            }
          ],
          options: this.options
        }
      });
      this.chart.options.title.text = attribute ? country.textContent : 'Country not selected';
      this.chart.options.scales.xAxes[0].ticks.callback = function (item) {
        let result;
        if (item < 1000) {
          result = item;
        } else if (item < 1000000) {
          result = `${Math.ceil(item / 1000)}K`;
        } else {
          result = `${Math.ceil(item / 1000000)}M`;
        }
        return result;
      };
      this.chart.options.scales.yAxes[0].ticks.beginAtZero = true;
    } else if (value === 'daily') {
      const dataForUpdate = await this.getDailyData();
      this.chart = new Chart(this.canvas, {
        type: 'horizontalBar',
        data: {
          labels: this.chartParams,
          datasets: [
            {
              data: dataForUpdate,
              backgroundColor: this.bgColors
            }
          ],
          options: this.options
        }
      });
      this.chart.options.scales.xAxes[0].ticks.callback = function (item) {
        let result;
        if (item < 1000) {
          result = item;
        } else if (item < 1000000) {
          result = `${Math.ceil(item / 1000)}K`;
        } else {
          result = `${Math.ceil(item / 1000000)}M`;
        }
        return result;
      };
      this.chart.options.title.text = 'Daily cases';
    } else {
      const data = await this.getGlobalData();
      const dataArray = Object.entries(data[value]);
      const dataValues = [];
      const dataLabels = [];
      const index = this.chartParams.indexOf(value);
      dataArray.forEach((item) => {
        dataLabels.push(item[0]);
        dataValues.push(item[1]);
      });
      this.chart = new Chart(this.canvas, {
        type: 'bar',
        data: {
          labels: dataLabels,
          datasets: [
            {
              data: dataValues,
              backgroundColor: this.bgColors[index]
            }
          ]
        },
        options: this.options
      });
      this.chart.options.title.text = this.titles[index];
      this.chart.options.scales.yAxes[0].ticks.callback = function (item) {
        let result;
        if (item < 1000) {
          result = item;
        } else if (item < 1000000) {
          result = `${Math.ceil(item / 1000)}K`;
        } else {
          result = `${Math.ceil(item / 1000000)}M`;
        }
        return result;
      };
      this.chart.options.scales.xAxes[0].ticks.callback = (item) => item.slice(0, 3);
    }
    this.chart.options.title.display = true;
    this.chart.options.legend.display = false;
    this.chart.update();
  }

  async init() {
    this.resetCanvas();

    const allData = await this.getGlobalData();
    const dataArray = Object.entries(allData.cases);
    const dataValues = [];
    const dataLabels = [];
    dataArray.forEach((item) => {
      dataLabels.push(item[0]);
      dataValues.push(item[1]);
    });
    this.chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: dataLabels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: this.bgColors[0]
          }
        ]
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
          xAxes: [
            {
              stacked: true,
              type: 'time',
              time: {
                unit: 'month'
              },
              ticks: {
                callback: (item) => item.slice(0, 3)
              }
            }
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: false,
                stepSize: 1000,
                maxTicksLimit: 15,
                callback: function (item) {
                  let result;
                  if (item < 1000) {
                    result = item;
                  } else if (item < 1000000) {
                    result = `${Math.ceil(item / 1000)}K`;
                  } else {
                    result = `${Math.ceil(item / 1000000)}M`;
                  }
                  return result;
                }
              }
            }
          ]
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
    this.canvas.style.maxHeight = this.canvas.parentElement.offsetHeight - 45 + 'px';
  }
}

export default DataChart;
