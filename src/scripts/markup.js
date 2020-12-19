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

function createTabs(casesItem, deathsItem, recoveredItem) {
  const tabs = create('div', 'tabs');
  const tabsNav = create('div', 'tabs__nav');
  const tabsContent = create('div', 'tabs__content');

  const casesTab = create('div', 'tabs-nav__item', null, ['data-tab-name', 'cases']);
  const deathsTab = create('div', 'tabs-nav__item', null, ['data-tab-name', 'deaths']);
  const recoveredTab = create('div', 'tabs-nav__item', null, ['data-tab-name', 'recovered']);

  tabsNav.classList.add('tabs-nav');

  casesItem.classList.add('active');
  casesTab.classList.add('active');

  casesItem.classList.add('tab');
  deathsItem.classList.add('tab');
  recoveredItem.classList.add('tab');

  casesItem.setAttribute('data-tab-content', 'cases');
  deathsItem.setAttribute('data-tab-content', 'deaths');
  recoveredItem.setAttribute('data-tab-content', 'recovered');

  casesTab.textContent = 'Cases';
  deathsTab.textContent = 'Deaths';
  recoveredTab.textContent = 'Recovered';

  function selectTabContent(tabName) {
    const tab = tabsContent.querySelector(`[data-tab-content="${tabName}"]`);
    const tabsItems = [...tabsContent.querySelectorAll('.tab')];
    tabsItems.forEach((elem) => elem.classList.remove('active'));
    tab.classList.add('active');
  }

  function selectTabNav(e) {
    if (e.target.dataset.tabName) {
      const navItems = [...tabsNav.querySelectorAll('.tabs-nav__item')];
      navItems.forEach((elem) => {
        elem.classList.remove('active');
      });
      e.target.classList.add('active');
      const tabName = e.target.dataset.tabName;
      selectTabContent(tabName);
    }
  }

  tabsNav.addEventListener('click', selectTabNav);

  tabsContent.append(casesItem, deathsItem, recoveredItem);
  tabsNav.append(casesTab, deathsTab, recoveredTab);
  tabs.append(tabsNav, tabsContent);

  return tabs;
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

  casesTitle.textContent = 'Cases';
  deathsTitle.textContent = 'Deaths';
  recoveredTitle.textContent = 'Recovered';

  casesRow.append(casesTitle, this.cases);
  deathsRow.append(deathsTitle, this.deaths);
  recoveredRow.append(recoveredTitle, this.recovered);

  this.countryName.textContent = 'Brazil';
  this.cases.textContent = '1000000';
  this.deaths.textContent = '1000000';
  this.recovered.textContent = '1000000';

  statisticsContent.append(casesRow, deathsRow, recoveredRow);
  statisticsFooter.append(this.periodSwitch, this.dataDisplaySwitch);
  this.elem.append(this.countryName, statisticsContent, statisticsFooter);
}

function CountriesList() {
  this.elem = create('div', 'countries-list');
  this.cases = create('div');
  this.deaths = create('div');
  this.recovered = create('div');

  const tabs = createTabs(this.cases, this.deaths, this.recovered);
  tabs.classList.add('countries-list__tabs');
  this.elem.append(tabs);
}

function Graph() {
  this.elem = create('div', 'graph');
  this.select = create('div', 'graph__select', null, ['data-value', 'cases']);
  this.currentOption = create('div', 'graph__option');
  this.canvas = create('canvas', null, 'chart');

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

  const changeOption = (option) => {
    const value = option.dataset.value;
    if (this.select.dataset.value === value) return;
    this.currentOption.textContent = capitalize(value);
    this.select.dataset.value = value;
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
    changeOption(option);
  });

  btnRight.addEventListener('click', () => {
    const option = getNextOption(true);
    changeOption(option);
  });

  list.addEventListener('click', (e) => {
    if (!e.target.classList.contains('graph__option')) return;
    changeOption(e.target);
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
  this.elem.append(this.canvas, graphFooter);
}

const header = create('header', 'header');
const container = create('main', 'main');
const footer = create('footer', 'footer');

const map = create('div', 'map');
const statistics = new Statistics();
const countriesList = new CountriesList();
const graph = new Graph();

const search = create('input', null, 'search', ['type', 'text']);

header.innerHTML = '<span class="header__title">COVID-19 Dashboard</span>';
header.append(search);

footer.textContent = 'Footer';

container.append(countriesList.elem, map, statistics.elem, graph.elem);
document.body.append(header, container, footer);

export { search, countriesList, statistics, graph, map };
