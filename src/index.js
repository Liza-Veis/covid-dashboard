import './styles/main.scss';
import CovidDataMiner from './scripts/CovidDataMiner';
import Search from './scripts/Search';
import DataChart from './scripts/DataChart';
import InteractiveMap from './scripts/InteractiveMap';
import News from './scripts/News';
import Updater from './scripts/Updater';
import { header, countriesList, statistics, graph, map } from './scripts/markup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const chart = new DataChart(graph.canvas);
  chart.init();
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
  const searcher = new Search(header.search, 'countries-list__item');
  const news = new News();

  await covid.init();
  await chart.init();
  await searcher.init();
  await interactiveMap.init(covid.getData());

  async function setDefault(covidObj, interactiveMapObj, graphObj) {
    await covidObj.resetSelectedCountry();
    interactiveMapObj.closePopup();
    graphObj.isCountrySelected = false;
    graphObj.changeOption(interactiveMapObj.option, true);
  }

  const updater = new Updater(covid, interactiveMap, graph, setDefault, 300000);
  updater.init();

  document.getElementById('updater').addEventListener('change', function () {
    updater.setNewInterval(this.value);
    this.blur();
    header.menuList.classList.remove('active');
    if (header.newsList.classList.contains('active')) {
      header.newsList.classList.remove('active');
    }
  });

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
    graph.isCountrySelected = true;
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

  header.newsList.append(await news.createNewsList());

  header.menuBtn.addEventListener('click', async () => {
    header.menuList.classList.toggle('active');
    if (header.newsList.classList.contains('active')) {
      header.newsList.classList.remove('active');
    }
  });

  header.news.addEventListener('click', async () => {
    header.newsList.classList.toggle('active');
  });

  header.reset.addEventListener('click', async () => {
    header.menuList.classList.remove('active');
    if (header.newsList.classList.contains('active')) {
      header.newsList.classList.remove('active');
    }
    await setDefault(covid, interactiveMap, graph);
  });

  interactiveMap.onPopupClose(async () => {
    await setDefault(covid, interactiveMap, graph);
  });

  document.querySelectorAll('.fullscreen').forEach((item) => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('active')) {
        item.parentNode.requestFullscreen();
        item.classList.add('active');
        item.querySelector('.open').setAttribute('data-hide', '');
        item.querySelector('.close').removeAttribute('data-hide');
      } else {
        document.exitFullscreen();
        item.classList.remove('active');
        item.querySelector('.open').removeAttribute('data-hide');
        item.querySelector('.close').setAttribute('data-hide', '');
      }
    });
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      const item = document.querySelector('.fullscreen.active');
      if (item) {
        item.querySelector('.open').removeAttribute('data-hide');
        item.querySelector('.close').setAttribute('data-hide', '');
        item.classList.remove('active');
      }
    }
  });
});
