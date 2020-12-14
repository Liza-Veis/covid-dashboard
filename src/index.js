/* eslint-disable max-len */
import './styles/main.scss';
import Covid from './scripts/Covid';
import Informer from './scripts/informer';
import Search from './scripts/Search';
import { search, countriesList, statistics, graph, map } from './scripts/markup.js';
import interactiveMap from'./scripts/map';

document.addEventListener('DOMContentLoaded', async () => {
  const informer = new Informer();
  const covid = new Covid(informer, undefined, countriesList.cases,
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
  console.log(search, countriesList, statistics, graph, map);
  interactiveMap();
});
