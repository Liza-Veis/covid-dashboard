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
  // const newsList = await news.createNewsList();
  // header.newsBlockWrapper.append(newsList);
});
