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
  this.tabs = create('div', 'tabs');

  this.selectTabNav = undefined;

  this.onTabChange = (func) => {
    if (func) {
      this.onTabChange = () => func(this.tabs.dataset.value);
    }
  };

  const fullScreener = create('div', 'fullscreen');
  fullScreener.innerHTML = `<img src="../assets/icons/fullscreen.svg" class="open">
	<img src="../assets/icons/exit-fullscreen.svg" class="close" data-hide >`;

  const tabsNav = create('div', 'tabs__nav');
  const tabsContent = create('div', 'tabs__content');

  const casesTab = create('div', 'tabs-nav__item', null, ['data-tab-name', 'cases']);
  const deathsTab = create('div', 'tabs-nav__item', null, ['data-tab-name', 'deaths']);
  const recoveredTab = create('div', 'tabs-nav__item', null, ['data-tab-name', 'recovered']);

  this.tabs.classList.add('countries-list__tabs');
  tabsNav.classList.add('tabs-nav');

  this.tabs.dataset.value = 'cases';
  this.cases.classList.add('active');
  casesTab.classList.add('active');

  this.cases.classList.add('tab');
  this.deaths.classList.add('tab');
  this.recovered.classList.add('tab');

  this.cases.setAttribute('data-tab-content', 'cases');
  this.deaths.setAttribute('data-tab-content', 'deaths');
  this.recovered.setAttribute('data-tab-content', 'recovered');

  casesTab.textContent = 'Cases';
  deathsTab.textContent = 'Deaths';
  recoveredTab.textContent = 'Recovered';

  const selectTabContent = (tabName) => {
    const tab = tabsContent.querySelector(`[data-tab-content="${tabName}"]`);
    const tabsItems = [...tabsContent.querySelectorAll('.tab')];
    tabsItems.forEach((elem) => elem.classList.remove('active'));
    tab.classList.add('active');
  };

  this.selectTabNav = (tabName) => {
    if (this.tabs.dataset.value === tabName) return;

    const navItems = [...tabsNav.querySelectorAll('.tabs-nav__item')];
    const tabNav = navItems.find((item) => item.getAttribute('data-tab-name') === tabName);

    if (!tabNav) return;

    this.tabs.dataset.value = tabName;
    navItems.forEach((elem) => {
      elem.classList.remove('active');
    });

    tabNav.classList.add('active');
    selectTabContent(tabName);
    this.onTabChange();
  };

  tabsNav.addEventListener('click', (e) => {
    if (e.target.dataset.tabName) {
      this.selectTabNav(e.target.dataset.tabName);
    }
  });

  tabsContent.append(this.cases, this.deaths, this.recovered);
  tabsNav.append(casesTab, deathsTab, recoveredTab);
  this.tabs.append(tabsNav, tabsContent);
  this.elem.append(this.tabs, fullScreener);
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

  const capitalize = (str) => `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;

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
  this.search = create('input', null, 'search', ['type', 'text']);
  this.nav = create('nav', 'header__nav');
  this.menuBtn = create('div', 'menu-button');
  this.menuList = create('ul', 'menu-list');
  this.news = create('li', 'menu-list__item');
  this.newsList = create('div', 'news-list');
  const burgerImage = create('img', 'menu-icon', null, ['src', '../assets/icons/menu.svg']);

  this.elem.innerHTML = '<span class="header__title">COVID-19 Dashboard</span>';
  this.news.textContent = 'Last news';
  this.menuBtn.append(burgerImage);
  this.menuList.append(this.news);
  this.nav.append(this.search);
  this.nav.append(this.menuBtn);
  this.nav.append(this.menuList);
  this.elem.append(this.nav);
  this.elem.append(this.newsList);
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

footer.textContent = 'Footer';

container.append(countriesList.elem, map, statistics.elem, graph.elem);
document.body.append(header.elem, container, footer);

export { header, countriesList, statistics, graph, map };
