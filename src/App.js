import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

import geoJson from './geojson';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PERSONAL_ACCESS_TOKEN;

const features = geoJson['features'];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Hong Kong
            lng: 114.1441,
            lat: 22.3750,
            zoom: 11,
        }
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            // style: 'mapbox://styles/witmin/ck46v5ez92o7r1cmml0s0svky',
            style: 'mapbox://styles/witmin/ck48aqhzz0jjb1cny8q4qjrfp',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });

        // const schools = ('./data/hk-school-loc-2019.json');

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });

        map.on('load', function () {
            map.addSource('hk-schools-loc', {
                'type': 'geojson',
                'data': geoJson,
            });

            map.addLayer({
                'id': 'school-location-points',
                'type': 'symbol',
                'source': 'hk-schools-loc',
                'layout': {
                    // get the icon name from the source's "icon" property
                    // concatenate the name to get an icon from the style's sprite sheet
                    // 'icon-image': ['concat', 'school', '-15'],
                    'icon-allow-overlap': false,
                    // get the title name from the source's "title" property
                    'text-field': ['get', '中文名稱'],
                    'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
                    'text-size': 12,
                    'text-offset': [0, 1],
                    'text-anchor': 'top'
                },
                paint: {
                    'text-color': "#565656",
                }
            });

            // Marker
            features.forEach(function (marker) {
                // create a HTML element for each feature
                let el = document.createElement('div');
                el.className = 'marker';

                // make a marker for each feature and add to the map
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup({offset: 25}) // add popups
                        .setMaxWidth('640px')
                        .setHTML(`
<span class="district tag">${marker.properties["分區"]} </span>
<span class="finance tag">${marker.properties["資助種類"]}</span>
<span class="school-level tag">${marker.properties["學校類型"]} </span>
                            <h3 class="school-title name-zh-hant"> ${marker.properties["中文名稱"]}</h3>
                            <p class="address">${marker.properties["中文地址"]}</p>
                            <p class="meta" >
                            ${marker.properties["學校授課時間"]}
                             <span class="divider">|</span>
${marker.properties["就讀學生性別"]} <span class="divider">|</span>
${marker.properties["宗教"]} 
                            </p>
                            <p class="contact">聯絡電話: ${marker.properties["聯絡電話"]}</p>
                            <p class="contact">傳真號碼: ${marker.properties["傳真號碼"]}</p>
                            <p class="contact">網頁: <a href='${marker.properties["網頁"]}' target="_blank" rel="noreferrer noopenner">${marker.properties["網頁"]}</a></p>
                        `))
                    .addTo(map);
            });
        });
    }

    render() {
        return (
            <div>
                <div className="app-info"><h1>香港學校位置及资料地圖 Hong Kong School Location and Profile Map</h1>
                    <p>數據來源： <a href="https://data.gov.hk/sc-data/dataset/hk-edb-schinfo-school-location-and-information" rel="noreferrer noopenner">data.gov.hk</a>
                    </p>{/*<p>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</p>*/}
                </div>

                <div ref={el => this.mapContainer = el} className="mapContainer"/>


            </div>
        )
    }
}

export default App;