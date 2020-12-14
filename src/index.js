import './styles/main.scss';
import CovidDataMiner from './scripts/CovidDataMiner';
import Search from './scripts/Search';
import DataChart from './scripts/DataChart';
import { search, countriesList, statistics, graph, map } from './scripts/markup.js';
import interactiveMap from './scripts/map';

document.addEventListener('DOMContentLoaded', async () => {
  const covid = new CovidDataMiner(
    countriesList.cases,
    countriesList.deaths,
    countriesList.recovered,
    statistics.cases,
    statistics.deaths,
    statistics.recovered,
    statistics.countryName
  );
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

  const chart = new DataChart(graph.canvas);
  await chart.init();
  graph.onOptionChange((value) => chart.changeChartData(value.toLowerCase()));
});
