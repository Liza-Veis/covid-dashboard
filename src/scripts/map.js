import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// import { map } from './markup';

const CENTER = [15, 0];
const DEFAULT_ZOOM = 2;
const MIN_ZOOM = 2;

const SOUTH_WEST = L.latLng(-80, -250);
const NORTH_EAST = L.latLng(90, 250);
const BOUNDS = L.latLngBounds(SOUTH_WEST, NORTH_EAST);

const mapSettings = {
  center: CENTER,
  defaultBaseMap: 'OpenStreetMap',
  zoom: DEFAULT_ZOOM,
  minZoom: MIN_ZOOM,
  maxBounds: BOUNDS
};

class InteractiveMap {
  constructor(mapContainer) {
    this.map = new L.map(mapContainer, mapSettings);

    this.map.on('drag', () => {
      this.map.panInsideBounds(BOUNDS, { animate: false });
    });

    const layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.addPointsLayer(this.map);
    this.map.addLayer(layer);
  }

  async getData() {
    const data = await fetch('https://corona.lmao.ninja/v2/countries').then((res) => res.json());

    return data;
  }

  createJeoLayer(data) {
    const geoJson = {
      type: 'FeaturesCollection',
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        };
      })
    };

    const geoLayer = L.geoJSON(geoJson, {
      pointToLayer: this.countryPointToLayer
    });

    geoLayer.addTo(this.map);
  }

  countryPointToLayer(feature = {}, latlng) {
    const { properties = {} } = feature;
    let updatedFormatted;
    let casesString;

    const { country, updated, cases, deaths, recovered } = properties;

    casesString = `${cases}`;

    if (cases > 1000) {
      casesString = `${casesString.slice(0, -3)}k+`;
    }

    if (updated) {
      updatedFormatted = new Date(updated).toLocaleString();
    }

    const html = `
 	<span class="icon-marker">
 	<span class="icon-marker-tooltip">
 	<h2>${country}</h2>
 	<ul>
 	<li><strong>Confirmed:</strong>${cases}</li>
 	<li><strong>Deaths:</strong>${deaths}</li>
 	<li><strong>Recovered:</strong>${recovered}</li>
 	<li><strong>Last Update:</strong>${updatedFormatted}</li>
 	</ul>
 	</span>
 	${casesString}
 	</span>`;

    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'icon',
        html
      }),
      riseOnHover: true
    });
  }

  async addPointsLayer(map) {
    if (!map) return;

    this.getData()
      .then(this.createJeoLayer.bind(this))
      .catch((e) => {
        console.log('E: ', e);
        return;
      });
  }
}

export default InteractiveMap;
