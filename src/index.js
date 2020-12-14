import './styles/main.scss';
import CovidDataMiner from './scripts/CovidDataMiner';
import Informer from './scripts/Informer';
import Search from './scripts/Search';
import DataChart from './scripts/DataChart';
import { search, countriesList, statistics, graph, map } from './scripts/markup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const informer = new Informer();
  const covid = new CovidDataMiner(informer, undefined, countriesList.cases,
    countriesList.deaths, countriesList.recovered,
    statistics.cases, statistics.deaths, statistics.recovered, statistics.countryName);
  await covid.init();
  const searcher = new Search(covid, search, 'countries-list__item');
  await searcher.init();

  document.querySelector('#period-switch').addEventListener('click', async function () {
    this.classList.toggle('active');
    await covid.changeIsTotalState();
  });

  document.querySelector('#data-display-switch').addEventListener('click', async function () {
    this.classList.toggle('active');
    await covid.changeIsDividedState();
  });
  // console.log(search, countriesList, statistics, graph, map);
  document.querySelector('.graph').querySelector('.tabs__content').innerHTML = '<canvas id="chart" width="300" height="200"></canvas>';
  const ctx = document.querySelector('#chart').getContext('2d');

  const chartData = await covid.getData();
  const countryLabels = chartData.countries.map((item) => {
    return item.Country;
  });
  const countryData = chartData.countries.map((item) => {
    return item.TotalConfirmed;
  });

  const chart = new DataChart(ctx);
  await chart.init();
  setInterval(async () => {
    await chart.changeChartData();
  }, 3000);
});
