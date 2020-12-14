import Chart from 'chart.js';
import { DateTime } from 'luxon';

class DataChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.url = 'https://disease.sh/v3/covid-19/historical/all';
    this.startDate = '2020-03-01T00:00:00Z';
    this.currentDate = this.getCurrentDayDate();
    this.titles = ['Total confirmed', 'Total deaths', 'Total recovered'];
    this.chartParams = ['cases', 'deaths', 'recovered'];
    this.data = [];
    this.currentIndex = 0;
    this.chart = null;
  }

  getCurrentDayDate() {
    const today = DateTime.local().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    });
    return today.toISODate();
  }

  async getGlobalData() {
    const candidate = this.getCurrentDayDate();
    if (this.currentDate !== candidate || !this.data.length) {
      const response = await fetch(this.url);
      const data = await response.json();
      this.data = data;
    }
    return this.data;
  }

  async changeChartData() {
    if (this.currentIndex === this.chartParams.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex += 1;
    }
    const globalData = await this.getGlobalData();
    const dataArray = (Object.entries(globalData[this.chartParams[this.currentIndex]]));
    const dataValues = [];
    const dataLabels = [];
    dataArray.forEach((item) => {
      dataLabels.push(item[0].slice(0, 5));
      dataValues.push(item[1]);
    });
    this.chart.data.datasets[0].data = dataValues;
    this.chart.data.labels = dataLabels;
    this.chart.options.title.text = `${this.titles[this.currentIndex]}`;
    this.chart.update();
  }

  async init() {
    const allData = await this.getGlobalData();
    const dataArray = (Object.entries(allData[this.chartParams[this.currentIndex]]));
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
          backgroundColor:
          'rgba(255, 99, 132, 1)'
        }]
      },
      options: {
        title: {
          display: true,
          text: `${this.titles[this.currentIndex]}`
        },
        label: 'Cases',
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true,
            display: true,
            ticks: {
              beginAtZero: false,
              stepSize: 10000,
              min: 1000000,
              maxTicksLimit: 12
            }
          }]
        }
      }
    });
    console.log(this.chart);
  }
}

export default DataChart;
