import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PERSONAL_ACCESS_TOKEN;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Hong Kong
            lng: 114.1441,
            lat: 22.3750,
            zoom: 10.5,
        }
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/witmin/ck46v5ez92o7r1cmml0s0svky',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });

        const schools = ('./data/hk-school-loc-2019.geojson');

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
                'data': schools,
            });

            map.addLayer({
                'id': 'school-location-points',
                'type': 'symbol',
                'source': 'hk-schools-loc',
                'layout': {
                    // get the icon name from the source's "icon" property
                    // concatenate the name to get an icon from the style's sprite sheet
                    'icon-image': ['concat', 'school', '-15'],
                    'icon-allow-overlap': false,
                    // get the title name from the source's "title" property
                    'text-field': ['get', '中文名稱'],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top'
                }
            });
        });
    }

    render() {
        return (
            <div>
                <div className="app-info"><h1>香港學校位置地圖 Hong Kong School Location Map</h1>
                    <p>數據來源： <a href="https://data.gov.hk/sc-data/dataset/hk-edb-schinfo-school-location-and-information" rel="noreferrer noopenner">data.gov.hk</a>
                    </p>
                    {/*<p>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</p>*/}
                </div>
                <div ref={el => this.mapContainer = el} className="mapContainer"/>
            </div>
        )
    }
}

export default App;