import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { map } from './markup';

const LOCATION = {
  lat: 15,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;
const MIN_ZOOM = 2;

function interactiveMap() {
  function countryPointToLayer(feature = {}, latlng) {
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
  </span>
  `;

    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'icon',
        html
      }),
      riseOnHover: true
    });
  }

  async function mapEffect(map) {
    //   if (!map) return;
    const createJeo = (data) => {
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

      const geoJsonLayers = L.geoJSON(geoJson, {
        pointToLayer: countryPointToLayer
      });
      geoJsonLayers.addTo(map);
    };

    await fetch('https://corona.lmao.ninja/v2/countries')
      .then((response) => response.json())
      .then(createJeo)
      .catch((e) => {
        console.log('E: ', e);
        return;
      });
  }

  const southWest = L.latLng(-80, -250);
  const northEast = L.latLng(90, 250);
  const bounds = L.latLngBounds(southWest, northEast);

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    minZoom: MIN_ZOOM,
    maxBounds: bounds
  };

  const myMap = new L.map(map, mapSettings);

  myMap.on('drag', function () {
    myMap.panInsideBounds(bounds, { animate: false });
  });

  const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  mapEffect(myMap);
  myMap.addLayer(layer);
}

export default interactiveMap;
