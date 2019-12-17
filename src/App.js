import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.scss';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PERSONAL_ACCESS_TOKEN;

const geoJsonUrl = 'https://hk-schools-map.millielin.com/geojson.json';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Hong Kong
            lng: 114.1441,
            lat: 22.3750,
            zoom: 11,
            features: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
            features: [],
        });

        fetch(geoJsonUrl)
            .then(response => response.json())
            .then(data => {
                this.setState({features: data['features'], isLoading: false});
            });

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/witmin/ck48aqhzz0jjb1cny8q4qjrfp',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });


        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });

        map.on('load', () => {
            this.setState(
                {
                    features: this.state.features,
                }
            );
            map.addSource('hk-schools-loc', {
                'type': 'geojson',
                'data': geoJsonUrl,
            });

            map.loadImage('/images/pin.png',
                function (error, image) {
                    if (error) throw error;
                    map.addImage('pin', image);
                }
            );
            map.addLayer({
                'id': 'schools',
                'type': 'symbol',
                'source': 'hk-schools-loc',
                'layout': {
                    // concatenate the name to get an icon from the style's sprite sheet
                    'icon-image': ['concat', 'pin'],
                    'icon-size': 0.5,
                    'icon-allow-overlap': true,
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
        });

        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'schools', function (e) {
            let coordinates = e.features[0].geometry.coordinates.slice();
            let marker = e.features[0];
            let popupHtml = `
<span class="district tag">${marker.properties["分區"]} </span>
<span class="finance tag">${marker.properties["資助種類"]}</span>
<span class="school-level tag">${marker.properties["學校類型"]} </span>
                            <h3 class="school-title name-zh-hant"> ${marker.properties["中文名稱"]}</h3>
                            <p class="address">${marker.properties["中文地址"]}</p>
                            <p class="meta" >
                            ${marker.properties["學校授課時間"]}
                             <span class="divider">|</span>
${marker.properties["就讀學生性別"]} <span class="divider">|</span>
宗教：${marker.properties["宗教"]}
                            </p>
                            <p class="contact">聯絡電話: ${marker.properties["聯絡電話"]}</p>
                            <p class="contact">傳真號碼: ${marker.properties["傳真號碼"]}</p>
                            <p class="contact">網頁: <a href='${marker.properties["網頁"]}' target="_blank" rel="noreferrer noopenner">${marker.properties["網頁"]}</a></p>
                        `;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupHtml)
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'schools', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'schools', function () {
            map.getCanvas().style.cursor = '';
        });
    }

    render() {
        const {isLoading} = this.state;
        return (
            <div>
                {isLoading ? <div className="is-loading">正在加載數據...</div> : (
                    <div className="app-info"><h1>
                        <span lang="zh-hant">香港學校位置及资料地圖</span><span className="lang-en" lang="en">Hong Kong School Location and Profile Map</span>
                    </h1>
                        <p>數據來源： <a href="https://data.gov.hk/sc-data/dataset/hk-edb-schinfo-school-location-and-information" rel="noreferrer noopenner">data.gov.hk</a>
                        </p>{/*<p>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</p>*/}
                    </div>
                )
                }
                <div ref={el => this.mapContainer = el} className="mapContainer"/>

            </div>
        )
    }
}

export default App;