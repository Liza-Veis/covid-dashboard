import './styles/main.scss';
import { setData, setCountryData } from './scripts/statistics';

document.addEventListener('DOMContentLoaded', async () => {
  await setData();

  document.getElementById('country-data-select').addEventListener('change', async (event) => {
    await setCountryData(event.target.value, 'country-data');
  });

  document.getElementById('search').addEventListener('focus', () => document.querySelector('.search-data').setAttribute('data-show', ''));
  document.getElementById('search').addEventListener('input', (event) => {
    let value = event.target.value.toLowerCase();
    document.querySelectorAll('.search-data-result').forEach((item) => {
      if (item.textContent.toLowerCase().search(value) === -1) {
        item.setAttribute('data-hide', '');
      } else {
        item.removeAttribute('data-hide');
      }
    });
  });

  document.querySelector('.search-data').addEventListener('click', async (event) => {
    console.log(event.target);
    if (event.target.classList.contains('search-data-result')) {
      const country = event.target.getAttribute('data-country');
      console.log(country);
      await setCountryData(country, 'country-data');
      document.querySelectorAll('.country-option').forEach((item) => {
        if (item.value === country) {
          item.setAttribute('selected', '');
        }
      });
      document.querySelector('.search-data').removeAttribute('data-show');
      document.getElementById('search').blur();
    }
  });
});
