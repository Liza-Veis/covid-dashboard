import './styles/main.scss';
import CovidDataMiner from './scripts/CovidDataMiner';
import Search from './scripts/Search';
import DataChart from './scripts/DataChart';
import News from './scripts/News';
import { header, countriesList, statistics, graph, map } from './scripts/markup.js';

document.addEventListener('DOMContentLoaded', async () => {
  const chart = new DataChart(graph.canvas);
  const covid = new CovidDataMiner(countriesList.cases,
    countriesList.deaths, countriesList.recovered,
    statistics.cases, statistics.deaths, statistics.recovered, statistics.countryName, chart,
    graph);
  const searcher = new Search(header.search, 'countries-list__item');
  const news = new News();
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
      item.querySelector('.open').removeAttribute('data-hide');
      item.querySelector('.close').setAttribute('data-hide', '');
      item.classList.remove('active');
    }
  });
});
