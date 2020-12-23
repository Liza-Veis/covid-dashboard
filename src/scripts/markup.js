const capitalize = (str) => `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;

function create(tagname, classname, id, attr) {
  const elem = document.createElement(tagname);
  if (classname) elem.classList.add(classname);
  if (id) elem.id = id;
  if (attr) elem.setAttribute(attr[0], attr[1]);
  return elem;
}

function createSwitch(classname, id, title) {
  const elem = create('div', classname, id);
  elem.classList.add('switch');
  elem.innerHTML = `
  <div class="switch__btn">
  <div class="switch__circle"></div>
  </div>
  <span class="switch__title">${title}</span>
  `;
  return elem;
}

function Statistics() {
  this.elem = create('div', 'statistics');
  this.countryName = create('div', 'statistics__country-name');
  this.cases = create('div', 'statistics__cases');
  this.deaths = create('div', 'statistics__deaths');
  this.recovered = create('div', 'statistics__recovered');
  this.periodSwitch = createSwitch('statistics__switch', 'period-switch', 'daily');
  this.dataDisplaySwitch = createSwitch('statistics__switch', 'data-display-switch', 'per 100k');

  const statisticsFooter = create('div', 'statistics__footer');
  const statisticsContent = create('div', 'statistics__content');

  const casesRow = create('div', 'statistics__row');
  const deathsRow = create('div', 'statistics__row');
  const recoveredRow = create('div', 'statistics__row');
  const casesTitle = create('div', 'statistics__title');
  const deathsTitle = create('div', 'statistics__title');
  const recoveredTitle = create('div', 'statistics__title');

  const fullScreener = create('div', 'fullscreen');
  fullScreener.innerHTML = `<img src="../assets/icons/fullscreen.svg" class="open">
  <img src="../assets/icons/exit-fullscreen.svg" class="close" data-hide >`;

  casesTitle.textContent = 'Cases';
  deathsTitle.textContent = 'Deaths';
  recoveredTitle.textContent = 'Recovered';

  casesRow.append(casesTitle, this.cases);
  deathsRow.append(deathsTitle, this.deaths);
  recoveredRow.append(recoveredTitle, this.recovered);

  statisticsContent.append(casesRow, deathsRow, recoveredRow);
  statisticsFooter.append(this.periodSwitch, this.dataDisplaySwitch);
  this.elem.append(this.countryName, statisticsContent, statisticsFooter, fullScreener);
}

function CountriesList() {
  this.elem = create('div', 'countries-list');
  this.cases = create('div');
  this.deaths = create('div');
  this.recovered = create('div');
  this.tabs = create('div', 'countries-list__tabs');
  this.select = create('div', 'countries-list__select', null, ['data-value', 'cases']);
  this.currentOption = create('div', 'countries-list__option');

  const periodSwitch = createSwitch('statistics__switch', 'period-switch_tabs', 'daily');
  const dataDisplaySwitch = createSwitch(
    'statistics__switch',
    'data-display-switch_tabs',
    'per 100k'
  );

  this.searchWrapper = create('div', 'search__wrapper');
  this.search = create('input', null, 'search', ['placeholder', 'Select...']);
  this.keyboardBtn = create('button', 'search__btn', 'keyboard');
  this.keyboardBtn.innerHTML = `<svg viewBox="0 0 29 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M26.6667 0H1.77778C1.30628 0 0.854097 0.187301 0.520699 0.520699C0.187301 0.854098 0 1.30628 0 1.77778V16C0 16.4715 0.187301 16.9237 0.520699 17.2571C0.854097 17.5905 1.30628 17.7778 1.77778 17.7778H26.6667C27.1382 17.7778 27.5903 17.5905 27.9237 17.2571C28.2571 16.9237 28.4444 16.4715 28.4444 16V1.77778C28.4444 1.30628 28.2571 0.854098 27.9237 0.520699C27.5903 0.187301 27.1382 0 26.6667 0V0ZM26.6667 16H1.77778V1.77778H26.6667V16Z" fill="currentColor"/>
  <path d="M4.44446 4.44446H6.22223V6.22224H4.44446V4.44446Z" fill="currentColor"/>
  <path d="M8 4.44446H9.77778V6.22224H8V4.44446Z" fill="currentColor"/>
  <path d="M11.5556 4.44446H13.3334V6.22224H11.5556V4.44446Z" fill="currentColor"/>
  <path d="M15.1111 4.44446H16.8889V6.22224H15.1111V4.44446Z" fill="currentColor"/>
  <path d="M18.6667 4.44446H20.4445V6.22224H18.6667V4.44446Z" fill="currentColor"/>
  <path d="M22.2222 4.44446H24V6.22224H22.2222V4.44446Z" fill="currentColor"/>
  <path d="M4.44446 8H6.22223V9.77778H4.44446V8Z" fill="currentColor"/>
  <path d="M8 8H9.77778V9.77778H8V8Z" fill="currentColor"/>
  <path d="M11.5556 8H13.3334V9.77778H11.5556V8Z" fill="currentColor"/>
  <path d="M15.1111 8H16.8889V9.77778H15.1111V8Z" fill="currentColor"/>
  <path d="M18.6667 8H20.4445V9.77778H18.6667V8Z" fill="currentColor"/>
  <path d="M22.2222 8H24V9.77778H22.2222V8Z" fill="currentColor"/>
  <path d="M22.2222 12.4445H23.9467V14.2222H22.2222V12.4445Z" fill="currentColor"/>
  <path d="M4.44446 12.4445H6.22223V14.2222H4.44446V12.4445Z" fill="currentColor"/>
  <path d="M8.11557 12.4445H20.3378V14.2222H8.11557V12.4445Z" fill="currentColor"/>
  </svg>`;

  this.changeOption = undefined;

  this.onOptionChange = (func) => {
    if (func) {
      this.onOptionChange = () => func(this.select.dataset.value);
    }
  };

  this.cases.classList.add('active');

  this.cases.classList.add('tab');
  this.deaths.classList.add('tab');
  this.recovered.classList.add('tab');

  this.cases.setAttribute('data-tab-content', 'cases');
  this.deaths.setAttribute('data-tab-content', 'deaths');
  this.recovered.setAttribute('data-tab-content', 'recovered');

  const countriesListFooter = create('div', 'countries-list__footer');
  const countriesListHeader = create('div', 'countries-list__header');
  const btnLeft = create('button', 'countries-list__btn');
  const btnRight = create('button', 'countries-list__btn');
  const list = create('ul', 'countries-list__list');

  const cases = create('li', 'countries-list__option', null, ['data-value', 'cases']);
  const deaths = create('li', 'countries-list__option', null, ['data-value', 'deaths']);
  const recovered = create('li', 'countries-list__option', null, ['data-value', 'recovered']);

  const fullScreener = create('div', 'fullscreen');
  fullScreener.innerHTML = `<img src="../assets/icons/fullscreen.svg" class="open">
	<img src="../assets/icons/exit-fullscreen.svg" class="close" data-hide >`;

  this.currentOption.classList.add('countries-list__option--current');
  btnLeft.classList.add('countries-list__btn--left');
  btnRight.classList.add('countries-list__btn--right');

  const options = [cases, deaths, recovered];

  options.forEach((elem) => {
    const option = elem;
    option.textContent = capitalize(elem.dataset.value);
  });

  this.currentOption.textContent = capitalize(this.select.dataset.value);

  this.changeOption = (value) => {
    if (this.select.dataset.value === value) return;
    this.currentOption.textContent = capitalize(value);
    this.select.dataset.value = value;
    this.onOptionChange();

    const tab = this.tabs.querySelector(`[data-tab-content="${value}"]`);
    const tabs = [...this.tabs.querySelectorAll('.tab.active')];
    tabs.forEach((elem) => elem.classList.remove('active'));
    tab.classList.add('active');
  };

  const getNextOption = (next) => {
    const curIdx = options.findIndex((elem) => elem.dataset.value === this.select.dataset.value);
    let idx = next ? (curIdx + 1) % options.length : curIdx - 1;
    if (idx < 0) idx = options.length + idx;
    return options[idx];
  };

  btnLeft.addEventListener('click', () => {
    const option = getNextOption(false);
    this.changeOption(option.dataset.value);
  });
  btnRight.addEventListener('click', () => {
    const option = getNextOption(true);
    this.changeOption(option.dataset.value);
  });
  list.addEventListener('click', (event) => {
    if (!event.target.classList.contains('countries-list__option')) return;
    this.changeOption(event.target.dataset.value);
  });

  function toggleList() {
    list.classList.toggle('active');
  }

  this.currentOption.addEventListener('click', () => toggleList());
  document.addEventListener('click', (e) => {
    if (e.target !== this.currentOption && list.classList.contains('active')) {
      toggleList();
      document.onclick = false;
    }
  });

  list.append(cases, deaths, recovered);
  this.select.append(list, this.currentOption);
  countriesListFooter.append(btnLeft, this.select, btnRight);
  this.tabs.append(this.cases, this.deaths, this.recovered);
  this.searchWrapper.append(this.search, this.keyboardBtn);
  countriesListHeader.append(this.searchWrapper, periodSwitch, dataDisplaySwitch);
  this.elem.append(countriesListHeader, this.tabs, countriesListFooter, fullScreener);
}

function Graph() {
  this.elem = create('div', 'graph');
  this.select = create('div', 'graph__select', null, ['data-value', 'cases']);
  this.currentOption = create('div', 'graph__option');
  this.canvas = create('canvas', null, 'chart');

  this.changeOption = undefined;
  this.isCountrySelected = false;
  this.isTotal = true;

  this.onOptionChange = (func) => {
    if (func) {
      this.onOptionChange = () => func(this.select.dataset.value);
    }
  };

  const graphFooter = create('div', 'graph__footer');
  const btnLeft = create('button', 'graph__btn');
  const btnRight = create('button', 'graph__btn');
  const list = create('ul', 'graph__list');

  const cases = create('li', 'graph__option', null, ['data-value', 'cases']);
  const deaths = create('li', 'graph__option', null, ['data-value', 'deaths']);
  const recovered = create('li', 'graph__option', null, ['data-value', 'recovered']);
  const daily = create('li', 'graph__option', null, ['data-value', 'daily']);
  const countryTotal = create('li', 'graph__option', null, ['data-value', 'country total']);
  const countryDaily = create('li', 'graph__option', null, ['data-value', 'country daily']);

  const fullScreener = create('div', 'fullscreen');
  fullScreener.innerHTML = `<img src="../assets/icons/fullscreen.svg" class="open">
	<img src="../assets/icons/exit-fullscreen.svg" class="close" data-hide >`;

  this.currentOption.classList.add('graph__option--current');
  btnLeft.classList.add('graph__btn--left');
  btnRight.classList.add('graph__btn--right');

  const options = [cases, deaths, recovered, daily, countryTotal, countryDaily];

  options.forEach((elem) => {
    const option = elem;
    option.textContent = capitalize(elem.dataset.value);
  });

  this.currentOption.textContent = capitalize(this.select.dataset.value);

  this.changeOption = (value, isDepend) => {
    if (this.select.dataset.value === value && value !== 'country total') return;
    let targetValue = value;

    if (isDepend) {
      if (this.isCountrySelected && !this.isTotal) {
        targetValue = 'country daily';
      } else if (this.isCountrySelected) {
        targetValue = 'country total';
      } else if (!this.isTotal) {
        targetValue = 'daily';
      }
    }
    const isDefaultValue = ['cases', 'deaths', 'recovered'].indexOf(value) !== -1;
    const isDefaultTargetValue = ['cases', 'deaths', 'recovered'].indexOf(targetValue) !== -1;
    if (isDefaultValue && !isDefaultTargetValue) {
      const isCorrectCurrentValue = this.select.dataset.value === targetValue;
      if (isCorrectCurrentValue) return;
    }

    this.currentOption.textContent = capitalize(targetValue);
    this.select.dataset.value = targetValue;
    this.onOptionChange();
  };

  const getNextOption = (next) => {
    const curIdx = options.findIndex((elem) => elem.dataset.value === this.select.dataset.value);
    let idx = next ? (curIdx + 1) % options.length : curIdx - 1;
    if (idx < 0) idx = options.length + idx;
    return options[idx];
  };

  btnLeft.addEventListener('click', () => {
    const option = getNextOption(false);
    this.changeOption(option.dataset.value);
  });

  btnRight.addEventListener('click', () => {
    const option = getNextOption(true);
    this.changeOption(option.dataset.value);
  });

  list.addEventListener('click', (e) => {
    if (!e.target.classList.contains('graph__option')) return;
    this.changeOption(e.target.dataset.value);
  });

  function toggleList() {
    list.classList.toggle('active');
  }

  this.currentOption.addEventListener('click', () => toggleList());

  document.addEventListener('click', (e) => {
    if (e.target !== this.currentOption && list.classList.contains('active')) {
      toggleList();
      document.onclick = false;
    }
  });

  list.append(cases, deaths, recovered, daily, countryTotal, countryDaily);
  this.select.append(list, this.currentOption);
  graphFooter.append(btnLeft, this.select, btnRight);
  this.elem.append(this.canvas, graphFooter, fullScreener);
}

function Header() {
  this.elem = create('header', 'header');
  this.menuBtn = create('div', 'menu-button');
  this.menuList = create('ul', 'menu-list');
  this.news = create('button', 'header__nav_news-btn');
  this.reset = create('li', 'menu-list__item');
  this.newsList = create('div', 'news-list');
  this.updateTime = create('select', 'menu-list__item', 'updater');
  this.nav = create('nav', 'header__nav');
  const burgerImage = create('img', 'menu-icon', null, ['src', '../assets/icons/menu.svg']);

  this.elem.innerHTML = '<span class="header__title">COVID-19 Dashboard</span>';
  this.news.textContent = 'Last news';
  this.reset.textContent = 'Show global data';
  this.updateTime.innerHTML = `
  <option disabled selected>Select update data time</option>
  <option value=1>1 hour</option>
  <option value=3>3 hours</option>
  <option value=6>6 hours</option>
  <option value=12>12 hours</option>
  <option value=24>24 hours</option>`;

  this.nav.append(this.news, this.menuBtn);
  this.menuBtn.append(burgerImage);
  this.menuList.append(this.reset, this.updateTime);
  this.elem.append(this.nav, this.menuList, this.newsList);
}

const container = create('main', 'main');
const footer = create('footer', 'footer');

const map = create('div', 'map');
const mapFullScreener = create('div', 'fullscreen');
mapFullScreener.innerHTML = `<img src="../assets/icons/fullscreen.svg" class="open">
<img src="../assets/icons/exit-fullscreen.svg" class="close" data-hide >`;
map.append(mapFullScreener);

const statistics = new Statistics();
const countriesList = new CountriesList();
const graph = new Graph();
const header = new Header();

footer.innerHTML = `
<a class="footer__logo" href="https://rs.school/js/"><img src="assets/images/logo.png" alt="RS-School"></a>
<div class="footer__text">Made by
<a href="https://github.com/ParfenenkovEdit">@ParfenenkovEdit</a> and
<a href="https://github.com/Liza-Veis">@Liza-Veis in 2020</a>
</div>
`;

container.append(countriesList.elem, map, statistics.elem, graph.elem);
document.body.append(header.elem, container, footer);

export { header, countriesList, statistics, graph, map };
