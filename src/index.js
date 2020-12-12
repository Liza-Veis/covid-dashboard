/* eslint-disable max-len */
import './styles/main.scss';
import Covid from './scripts/Covid';
import Informer from './scripts/informer';
import Search from './scripts/Search';

document.addEventListener('DOMContentLoaded', async () => {
  const informer = new Informer();
  const covid = new Covid(informer, document.getElementById('global-cases'),
    document.getElementById('countries-cases'), document.getElementById('death-data'),
    document.getElementById('recovered-data'));
  await covid.setData();

  document.getElementById('total').addEventListener('click', async () => {
    await covid.changeIsTotalState();
  });
  document.getElementById('divided').addEventListener('click', async () => {
    await covid.changeIsDividedState();
  });

  const search = new Search(covid, document.getElementById('search'), document.getElementById('search-section'), 'data-search');
  await search.init();
});
