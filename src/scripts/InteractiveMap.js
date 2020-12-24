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
    this.isDivided = false;
    this.isTotal = true;
    this.perHundredThousand = 100000;

    this.changeOption = undefined;

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
        this.onOptionChange = () => func(this.nav.select.dataset.value);
      }
    };

    this.onPopupClose = (func) => {
      if (func) {
        this.onPopupClose = func;
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
      cases: [240, 63, 131],
      deaths: [240, 190, 63],
      recovered: [77, 240, 63]
    };

    this.markersStyle = {
      weight: 1,
      fillColor: 'rgba(240,63,131,0.5)',
      color: 'rgb(240,63,131)',
      fillOpacity: 1
    };

    this.openPopup = undefined;

    this.thresholds = {
      default: [
        [10000000, '>10M'],
        [5000000, '5M-10M'],
        [1000000, '1M-5M'],
        [500000, '500K-1M'],
        [250000, '250K-500K'],
        [100000, '100K-250K'],
        [50000, '50K-100K'],
        [1000, '1K-50K'],
        [0, '<1K']
      ],
      daily: [
        [30000, '>30K'],
        [20000, '20K-30K'],
        [10000, '10K-20K'],
        [5000, '5K-10K'],
        [1000, '1K-5K'],
        [500, '500-1K'],
        [100, '100-500'],
        [10, '10-100'],
        [0, '<10']
      ],
      divided: [
        [9000, '>9K'],
        [8000, '8K-9K'],
        [7000, '7K-8K'],
        [6000, '6K-7K'],
        [5000, '5K-6K'],
        [3000, '3K-5K'],
        [500, '500-3K'],
        [10, '10-500'],
        [0, '<10']
      ],
      dailyDivided: [
        [100, '>100'],
        [90, '90-100'],
        [80, '80-90'],
        [65, '70-80'],
        [40, '30-70'],
        [30, '10-30'],
        [20, '5-10'],
        [0.1, '0.1-5'],
        [0, '<0.1']
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

  async setState(isTotal, isDivided) {
    if (this.isTotal === isTotal && this.isDivided === isDivided) return;
    this.isTotal = isTotal;
    this.isDivided = isDivided;
    let state;
    if (isTotal && isDivided) {
      state = 'divided';
    } else if (isTotal) {
      state = 'default';
    } else if (isDivided) {
      state = 'dailyDivided';
    } else {
      state = 'daily';
    }
    this.state = state;
    this.setMap(true);
    this.updateLegend();
  }

  closePopup(isNextCountrySelected) {
    if (!this.selectedLayer[0]) return;
    const marker = this.selectedLayer[0];
    const popup = marker.getPopup();
    marker.closePopup();
    popup.options.autoClose = true;
    popup.options.closeOnClick = true;
    popup.getElement().classList.remove('active');

    this.addInteractivityToGroup(...this.selectedLayer);
    this.selectedLayer = [];
    if (!isNextCountrySelected) {
      this.onPopupClose();
    }
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

    const onClick = (noZoomToBounds) => {
      const isInside = layer.getBounds().contains(marker.getLatLng());
      const options = isInside ? { padding: [50, 50] } : { padding: [150, 200] };
      const target = isInside ? layer : new L.FeatureGroup([marker, layer]);

      if (noZoomToBounds !== true) this.map.fitBounds(target.getBounds(), options);

      this.map.closePopup();
      this.openPopup = openPopup;
      this.selectCountry(marker, layer);
    };

    marker.on({
      mouseover: () => {
        openPopup();
        marker.bringToFront();
      },
      click: onClick.bind(this)
    });

    layer.on({
      mouseover: openPopup,
      mouseout: () => marker.closePopup(),
      click: onClick.bind(this),
      dblClick: onClick.bind(this)
    });

    if (isActive) onClick(noZoom);
  }

  selectCountryByIso3(iso3, noZoom) {
    const [marker, layer] = [...this.markers.entries()].find(([key, value]) => {
      return value.feature.properties.countryInfo.iso3 === iso3;
    });
    if (marker === this.selectedLayer[0] || layer === this.selectedLayer[1]) return;
    this.addInteractivityToGroup(marker, layer, true, noZoom);
  }

  selectCountry(marker, layer) {
    if (marker === this.selectedLayer[0] || layer === this.selectedLayer[1]) return;
    this.closePopup(true);

    this.selectedLayer = [marker, layer];
    const popup = this.selectedLayer[0].getPopup();

    layer.clearAllEventListeners();
    marker.clearAllEventListeners();

    popup.options.autoClose = false;
    popup.options.closeOnClick = false;
    this.openPopup();
    popup.getElement().classList.add('active');
    popup.getElement().onclick = (e) => {
      if (e.target.classList.contains('popup__close')) {
        this.closePopup();
      }
    };

    this.onCountrySelect();
  }

  onEachFeature(feature, layer) {
    const { lat, long: lng } = feature.properties.countryInfo;
    const latlng = [lat, lng];

    const option = this.isTotal ? this.option : `today${this.capitalize(this.option)}`;
    let value = feature.properties[option];
    if (this.isDivided) {
      value = ((value / feature.properties.population) * this.perHundredThousand).toFixed(2);
    }

    const marker = this.addMarker(value, latlng);

    this.markers.set(marker, layer);
    this.addPopupToMarker(marker, feature, value);
  }

  addPopupToMarker(marker, feature, value) {
    const { properties = {} } = feature;

    const popup = `
  	 <div class="popup__header">
  	 <h2 class="popup__country">${properties.country}</h2>
  	 <img class="popup__flag" src="${properties.countryInfo.flag}" />
  	 <div class="popup__close">×</div>
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
    const styleId = 'ckj1l4w4f9qag19rp8evmrw3r';
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
    const radiusIdx = this.thresholds[this.state].findIndex((elem) => value >= elem[0]);
    return radii[radiusIdx];
  }

  updateLegend() {
    const threshold = this.thresholds[this.state];
    this.legendMarkers.forEach(([elem, value], idx) => {
      const marker = elem;
      const valueItem = value;
      const size = this.getMarkerRadius(threshold[idx][0]) * 2;
      marker.style.backgroundColor = this.markersStyle.fillColor;
      marker.style.border = `${this.markersStyle.weight}px solid ${this.markersStyle.color}`;
      marker.style.width = size + 'px';
      marker.style.height = size + 'px';
      valueItem.textContent = threshold[idx][1];
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

      this.thresholds[this.state].forEach((elem) => {
        const grade = elem[0];
        const size = this.getMarkerRadius(grade) * 2;
        const legendItem = L.DomUtil.create('div', 'legend__item', container);
        const markerWrapper = L.DomUtil.create('div', 'legend__circle-wrapper', legendItem);
        const marker = L.DomUtil.create('div', 'legend__circle', markerWrapper);
        const value = L.DomUtil.create('div', 'legend__value', legendItem);

        this.legendMarkers.push([marker, value]);

        marker.style.width = size + 'px';
        marker.style.height = size + 'px';
        marker.style.backgroundColor = this.markersStyle.fillColor;
        marker.style.border = `${this.markersStyle.weight}px solid ${this.markersStyle.color}`;

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

      this.changeOption = (value) => {
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
        this.changeOption(option.dataset.value);
      });
      btnRight.addEventListener('click', () => {
        const option = getNextOption(true);
        this.changeOption(option.dataset.value);
      });
      list.addEventListener('click', (event) => {
        if (!event.target.classList.contains('map__option')) return;
        this.changeOption(event.target.dataset.value);
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
