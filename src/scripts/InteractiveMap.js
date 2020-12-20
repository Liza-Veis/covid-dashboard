import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import countriesGeoJson from '../assets/data/countriesGeo.json';

const center = [15, 0];
const defaultZoom = 2;
const minZoom = 2;

const southWest = L.latLng(-80, -250);
const northEast = L.latLng(90, 250);
const bounds = L.latLngBounds(southWest, northEast);

const mapSettings = {
  center: center,
  defaultBaseMap: 'Mapbox',
  zoom: defaultZoom,
  minZoom: minZoom,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0
};

class InteractiveMap {
  constructor(mapContainer) {
    this.map = new L.Map(mapContainer, mapSettings);
    this.markers = new Map();
    this.option = 'cases';
    this.legendMarkers = [];
    this.data = undefined;
    this.countriesGeo = undefined;
    this.selectedLayer = [];
    this.state = 'default';

    this.onCountrySelect = (func) => {
      if (func) {
        this.onCountrySelect = () => {
          const iso3 = this.selectedLayer[1].feature.properties.countryInfo.iso3;
          func(iso3);
        };
      }
    };

    this.onOptionChange = (func) => {
      if (func) {
        this.onOptionChange = () => func(this.select.dataset.value);
      }
    };

    this.nav = {
      select: undefined,
      currentOption: undefined
    };

    this.countriesStyle = {
      fillColor: 'transparent',
      weight: 0
    };

    this.markersColors = {
      cases: [211, 40, 40],
      deaths: [195, 195, 195],
      recovered: [102, 195, 29]
    };

    this.markersStyle = {
      weight: 1,
      fillColor: 'rgba(211,40,40,0.5)',
      color: 'rgb(211,40,40)',
      fillOpacity: 1
    };

    this.closePopup = undefined;
    this.openPopup = undefined;

    this.thresholds = {
      default: [
        [10000001, '>10M'],
        [5000001, '5M-10M'],
        [1000001, '1M-5M'],
        [500001, '500K-1M'],
        [250001, '250K-500K'],
        [100001, '100K-250K'],
        [50001, '50K-100K'],
        [1001, '1K-50K'],
        [0, '<1K']
      ],
      daily: [
        [100001, '>100K'],
        [50001, '50K-100K'],
        [25001, '25K-50K'],
        [20001, '20K-25K'],
        [15001, '15K-20K'],
        [10001, '10K-15K'],
        [5001, '5K-10K'],
        [1001, '1K-5K'],
        [0, '<1K']
      ],
      absolute: [
        [5001, '>5K'],
        [3001, '3K-5K'],
        [1001, '1K-3K'],
        [751, '750-1K'],
        [501, '500-750'],
        [251, '250-500'],
        [101, '100-250'],
        [51, '50-100'],
        [0, '<50']
      ],
      dailyAbsolute: [
        [101, '>100'],
        [91, '90-100'],
        [81, '80-90'],
        [66, '65-80'],
        [41, '40-65'],
        [31, '30-40'],
        [21, '20-30'],
        [11, '10-20'],
        [0, '<10']
      ]
    };
  }

  capitalize(str) {
    return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
  }

  async getCountriesGeo() {
    return JSON.parse(JSON.stringify(countriesGeoJson));
  }

  async getData() {
    const data = await fetch('https://corona.lmao.ninja/v2/countries').then((res) => res.json());
    return data;
  }

  async setData(data) {
    this.data = await data;
    this.setMap();
  }

  changeMapOption(option) {
    this.option = option;
    this.setMap(true).then(this.updateLegend.bind(this));
  }

  addInteractiveLayer() {
    return this.getData()
      .then(this.createJeoLayer.bind(this))
      .then(() => {
        return this.markers.forEach((layer, marker) => this.addInteractivityToGroup(marker, layer));
      })
      .catch();
  }

  async createJeoLayer() {
    const countries = this.data;
    if (!countries || countries.length <= 0) return;
    if (!this.countriesGeo) return;

    const geoJson = {
      type: 'FeaturesCollection',
      features: countries.map((country) => {
        const geometry = this.countriesGeo[country.countryInfo.iso3];
        return {
          type: 'Feature',
          properties: {
            ...country
          },
          geometry
        };
      })
    };

    const geoLayer = L.geoJSON(geoJson, {
      style: this.countriesStyle,
      onEachFeature: this.onEachFeature.bind(this)
    });

    geoLayer.addTo(this.map);
  }

  addInteractivityToGroup(marker, layer, isActive, noZoom) {
    const openPopup = () => {
      if (!marker.getPopup().isOpen()) marker.openPopup();
    };
    const closePopup = () => marker.closePopup();

    const onClick = (noZoomToBounds) => {
      const isInside = layer.getBounds().contains(marker.getLatLng());
      const options = isInside ? { padding: [50, 50] } : { padding: [150, 200] };
      const target = isInside ? layer : new L.FeatureGroup([marker, layer]);

      if (noZoomToBounds !== true) this.map.fitBounds(target.getBounds(), options);

      this.map.closePopup();
      this.closePopup = closePopup;
      this.openPopup = openPopup;
      this.selectCountry(marker, layer);
      openPopup();
    };

    marker.on({
      mouseover: openPopup,
      click: onClick.bind(this)
    });

    layer.on({
      mouseover: openPopup,
      mouseout: closePopup,
      click: onClick.bind(this),
      dblClick: onClick.bind(this)
    });

    if (isActive) onClick(noZoom);
  }

  selectCountryByIso3(iso3, noZoom) {
    const [marker, layer] = [...this.markers.entries()].find(([key, value]) => {
      return value.feature.properties.countryInfo.iso3 === iso3;
    });
    this.addInteractivityToGroup(marker, layer, true, noZoom);
  }

  selectCountry(marker, layer) {
    if (marker === this.selectedLayer[0] || layer === this.selectedLayer[1]) return;
    if (this.selectedLayer[0]) {
      this.selectedLayer[0].closePopup();
      const popup = this.selectedLayer[0].getPopup();
      popup.options.autoClose = true;
      popup.options.closeOnClick = true;
      this.addInteractivityToGroup(...this.selectedLayer);
    }

    this.selectedLayer = [marker, layer];
    const popup = this.selectedLayer[0].getPopup();
    layer.clearAllEventListeners();
    marker.clearAllEventListeners();

    popup.options.autoClose = false;
    popup.options.closeOnClick = false;

    this.onCountrySelect();
  }

  onEachFeature(feature, layer) {
    const { lat, long: lng } = feature.properties.countryInfo;
    const latlng = [lat, lng];
    const value = feature.properties[this.option];
    const marker = this.addMarker(value, latlng);

    this.markers.set(marker, layer);
    this.addPopupToMarker(marker, feature);
  }

  addPopupToMarker(marker, feature) {
    const { properties = {} } = feature;
    const value = properties[this.option];
    const popup = `
  	 <div class="popup__header">
  	 <h2 class="popup__country">${properties.country}</h2>
  	 <img class="popup__flag" src="${properties.countryInfo.flag}" />
  	 </div>
  	 <span class="popup__content">${this.capitalize(this.option)}: ${value}</span>`;

    marker.bindPopup(popup, { className: 'popup', autoPan: false, closeButton: false });
  }

  addMarker(value, latlng) {
    const style = this.markersStyle;
    const color = this.markersColors[this.option].join();
    style.radius = this.getMarkerRadius(value);
    style.fillColor = `rgba(${color},0.5)`;
    style.color = `rgb(${color})`;

    return L.circleMarker(latlng, style).addTo(this.map);
  }

  async setMap(noZoom) {
    if (this.interactiveLayer) {
      this.map.remove(this.interactiveLayer);
    }
    if (!this.countriesGeo) {
      this.countriesGeo = await this.getCountriesGeo().catch();
    }
    if (this.markers.size > 0) {
      [...this.markers.keys()].forEach((marker) => this.map.removeLayer(marker));
      this.markers.clear();
    }
    this.interactiveLayer = await this.addInteractiveLayer().catch();

    if (this.selectedLayer[1]) {
      const iso3 = this.selectedLayer[1].feature.properties.countryInfo.iso3;
      this.selectCountryByIso3(iso3, noZoom);
    }
  }

  async init(data) {
    this.map.on('drag', () => {
      this.map.panInsideBounds(bounds, { animate: false });
    });

    const signature = 'UtTqDGnXDAaNToAj-W3j2A';
    const accessToken = `pk.eyJ1IjoibGl6YTQyMDIzIiwiYSI6ImNraXFvcHZlNDAzemQyeW40dnc0N2xzNWgifQ.${signature}`;
    const styleId = 'ckit31x161j5z19mhkwp7dviu';
    const layerUrl = `https://api.mapbox.com/styles/v1/liza42023/${styleId}/tiles/{z}/{x}/{y}@2x?access_token=${accessToken}`;

    const mainLayer = new L.TileLayer(layerUrl, { zoomOffset: -1, tileSize: 512 });

    this.data = await data;
    this.map.addLayer(mainLayer);
    this.setMap();
    this.createNav();
    this.createLegend();
  }

  getMarkerRadius(value) {
    const radii = [20, 16, 14, 12, 10, 9, 7, 5, 3];
    const radiusIdx = this.thresholds.default.findIndex((elem) => value >= elem[0]);
    return radii[radiusIdx];
  }

  updateLegend() {
    this.legendMarkers.forEach((elem) => {
      const marker = elem;
      marker.style.backgroundColor = this.markersStyle.fillColor;
      marker.style.border = `${this.markersStyle.weight}px solid ${this.markersStyle.color}`;
    });
  }

  createLegend() {
    const legend = L.control({ position: 'topright' });
    const icon = `<svg viewBox="0 0 60.123 60.123" fill="currentColor" class="legend__icon">
	<path d="M57.124,51.893H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3S58.781,51.893,57.124,51.893z"/>
	<path d="M57.124,33.062H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3
	C60.124,31.719,58.781,33.062,57.124,33.062z"/>
	<path d="M57.124,14.231H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3S58.781,14.231,57.124,14.231z"/>
	<circle cx="4.029" cy="11.463" r="4.029"/>
	<circle cx="4.029" cy="30.062" r="4.029"/>
	<circle cx="4.029" cy="48.661" r="4.029"/>
	 </svg>`;

    legend.onAdd = () => {
      const main = L.DomUtil.create('div', 'legend');
      main.innerHTML = icon;
      const container = L.DomUtil.create('div', 'legend__content', main);

      const preventEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      main.addEventListener('click', (e) => {
        preventEvent(e);
        const closeLegend = (event) => {
          if (main.classList.contains('active') && !event.target.closest('.legend')) {
            main.classList.remove('active');
            document.removeEventListener('click', closeLegend);
          }
        };
        document.addEventListener('click', closeLegend);
        main.classList.toggle('active');
      });

      main.addEventListener('dblclick', preventEvent);

      this.thresholds.default.forEach((elem) => {
        const grade = elem[0];
        const size = this.getMarkerRadius(grade) * 2;
        const legendItem = L.DomUtil.create('div', 'legend__item', container);
        const markerWrapper = L.DomUtil.create('div', 'legend__circle-wrapper', legendItem);
        const marker = L.DomUtil.create('div', 'legend__circle', markerWrapper);

        this.legendMarkers.push(marker);

        marker.style.width = size + 'px';
        marker.style.height = size + 'px';
        marker.style.backgroundColor = this.markersStyle.fillColor;
        marker.style.border = `${this.markersStyle.weight}px solid ${this.markersStyle.color}`;

        const value = L.DomUtil.create('div', 'legend__value', legendItem);
        value.textContent = elem[1];
      });

      return main;
    };

    legend.addTo(this.map);
  }

  createNav() {
    const nav = L.control({ position: 'topright' });

    nav.onAdd = () => {
      const main = L.DomUtil.create('div', 'map__nav');
      main.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });

      const btnLeft = L.DomUtil.create('button', 'map__btn', main);
      this.nav.select = L.DomUtil.create('div', 'map__select', main);
      const btnRight = L.DomUtil.create('button', 'map__btn', main);

      const list = L.DomUtil.create('ul', 'map__list', this.nav.select);
      this.nav.currentOption = L.DomUtil.create('div', 'map__option', this.nav.select);

      const cases = L.DomUtil.create('li', 'map__option', list);
      const deaths = L.DomUtil.create('li', 'map__option', list);
      const recovered = L.DomUtil.create('li', 'map__option', list);

      this.nav.select.dataset.value = 'cases';
      cases.dataset.value = 'cases';
      deaths.dataset.value = 'deaths';
      recovered.dataset.value = 'recovered';

      this.nav.currentOption.classList.add('map__option--current');
      btnLeft.classList.add('map__btn--left');
      btnRight.classList.add('map__btn--right');

      const options = [cases, deaths, recovered];

      options.forEach((elem) => {
        const option = elem;
        option.textContent = this.capitalize(elem.dataset.value);
      });
      this.nav.currentOption.textContent = this.capitalize(this.nav.select.dataset.value);

      const changeOption = (option) => {
        const value = option.dataset.value;
        if (this.nav.select.dataset.value === value) return;
        this.nav.currentOption.textContent = this.capitalize(value);
        this.nav.select.dataset.value = value;
        this.changeMapOption(value);
        this.onOptionChange();
      };

      const getNextOption = (next) => {
        const curIdx = options.findIndex(
          (elem) => elem.dataset.value === this.nav.select.dataset.value
        );
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
      list.addEventListener('click', (event) => {
        if (!event.target.classList.contains('map__option')) return;
        changeOption(event.target);
      });

      function toggleList() {
        list.classList.toggle('active');
      }

      this.nav.currentOption.addEventListener('click', () => toggleList());
      document.addEventListener('click', (e) => {
        if (e.target !== this.nav.currentOption && list.classList.contains('active')) {
          toggleList();
          document.onclick = false;
        }
      });

      return main;
    };

    nav.addTo(this.map);
  }
}

export default InteractiveMap;
