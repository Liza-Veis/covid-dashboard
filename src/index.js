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
    statistics.countryName
  );
  const searcher = new Search(search, 'countries-list__item');

  await covid.init();
  await chart.init();
  await searcher.init();
  await interactiveMap.init(covid.getData());

  graph.onOptionChange(async (value) => {
    if (['cases', 'deaths', 'recovered'].indexOf(value) !== -1) {
      interactiveMap.changeOption(value);
      countriesList.selectTabNav(value);
    }
    chart.getDataByValue(value);
  });

  countriesList.onTabChange(async (value) => {
    interactiveMap.changeOption(value);
    graph.changeOption(value, true);
  });

  interactiveMap.onOptionChange((value) => {
    countriesList.selectTabNav(value);
  });

  interactiveMap.onCountrySelect(async (iso3) => {
    const currentCountryIso3 = statistics.countryName.dataset.iso3;
    if (currentCountryIso3 === iso3) return;

    await covid.setCountryData(iso3);
    if (!graph.isCountrySelected) {
      graph.isCountrySelected = true;
    }
    graph.changeOption('country total', true);
  });

  countriesList.elem.addEventListener('click', async (e) => {
    const elem = e.target.closest('.countries-list__item');
    if (elem) {
      interactiveMap.selectCountryByIso3(elem.dataset.iso3);
    }
  });

  document.querySelector('#period-switch').addEventListener('click', async function () {
    this.classList.toggle('active');
    await covid.changeIsTotalState();
    interactiveMap.setState(covid.isTotal, covid.isDivided);
    if (covid.isTotal !== graph.isTotal) {
      graph.isTotal = covid.isTotal;
      graph.changeOption(covid.isTotal ? interactiveMap.option : 'daily', true);
    }
  });

  document.querySelector('#data-display-switch').addEventListener('click', async function () {
    this.classList.toggle('active');
    await covid.changeIsDividedState();
    interactiveMap.setState(covid.isTotal, covid.isDivided);
  });
});
