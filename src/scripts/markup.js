function create(tagname, classname, id, attr) {
  const elem = document.createElement(tagname);
  if (classname) elem.classList.add(classname);
  if (id) elem.id = id;
  if (attr) elem.setAttribute(attr[0], attr[1]);
  return elem;
}

const header = create('header', 'header');
const container = create('main', 'main');
const footer = create('footer', 'footer');

const countriesList = create('div', null, 'countries-list');
const map = create('div', null, 'map');
const statistics = create('div', null, 'statistics');
const graph = create('div', null, 'graph');

const search = create('input', null, 'search', ['type', 'text']);

header.innerHTML = '<span class="header__title">COVID-19 Dashboard</span>';
header.append(search);
footer.textContent = 'Footer';

container.append(countriesList, map, statistics, graph);
document.body.append(header, container, footer);

export { search, countriesList, map, statistics, graph };
