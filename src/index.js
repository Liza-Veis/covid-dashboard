import './styles/main.scss';
import CovidDataMiner from './scripts/CovidDataMiner';
import Search from './scripts/Search';
import DataChart from './scripts/DataChart';
import { search, countriesList, statistics, graph, map } from './scripts/markup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const chart = new DataChart(graph.canvas);
  const covid = new CovidDataMiner(countriesList.cases,
    countriesList.deaths, countriesList.recovered,
    statistics.cases, statistics.deaths, statistics.recovered, statistics.countryName, chart,
    graph);
  const searcher = new Search(search, 'countries-list__item');
  await covid.init();
  await searcher.init();
  graph.onOptionChange(async (value) => {
    await chart.getDataByValue(value);
  });

  document.querySelector('#period-switch').addEventListener('click', async function () {
    this.classList.toggle('active');
    await covid.changeIsTotalState();
  });

  document.querySelector('#data-display-switch').addEventListener('click', async function () {
    this.classList.toggle('active');
    await covid.changeIsDividedState();
  });
  window.graph = graph;
  console.log(graph);
});
