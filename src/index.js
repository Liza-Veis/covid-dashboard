import './styles/main.scss';
import CovidDataMiner from './scripts/CovidDataMiner';
import Search from './scripts/Search';
import DataChart from './scripts/DataChart';
import { search, countriesList, statistics, graph, map } from './scripts/markup.js';
import InteractiveMap from './scripts/InteractiveMap';

document.addEventListener('DOMContentLoaded', async () => {
  const chart = new DataChart(graph.canvas);
  const interactiveMap = new InteractiveMap(map);
  const covid = new CovidDataMiner(
    countriesList.cases,
    countriesList.deaths,
    countriesList.recovered,
    statistics.cases,
    statistics.deaths,
    statistics.recovered,
    statistics.countryName,
    chart,
    graph
  );
  const searcher = new Search(search, 'countries-list__item');
  await covid.init();
  await searcher.init();
  await interactiveMap.init(covid.getData());

  graph.onOptionChange(async (value) => {
    await chart.getDataByValue(value);
  });

  countriesList.onTabChange((value) => {
    interactiveMap.changeOption(value);
  });

  interactiveMap.onOptionChange((value) => {
    countriesList.selectTabNav(value);
  });

  interactiveMap.onCountrySelect((iso3) => covid.setCountryData(iso3));

  countriesList.elem.addEventListener('click', (e) => {
    const elem = e.target.closest('.countries-list__item');
    if (elem) {
      interactiveMap.selectCountryByIso3(elem.dataset.iso3);
    }
  });

  document.querySelector('#period-switch').addEventListener('click', async function () {
    this.classList.toggle('active');
    await covid.changeIsTotalState();
    interactiveMap.setState(covid.isTotal, covid.isDivided);
  });

  document.querySelector('#data-display-switch').addEventListener('click', async function () {
    this.classList.toggle('active');
    await covid.changeIsDividedState();
    interactiveMap.setState(covid.isTotal, covid.isDivided);
  });
  window.graph = graph;
  console.log(graph);
});
