import './styles/main.scss';
import { getCovidData, setData, getCovidDataByCountry } from './scripts/statistics';

document.addEventListener('DOMContentLoaded', async () => {
  await getCovidData();
  await getCovidDataByCountry('belarus');
  await setData();
});
