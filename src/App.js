import React from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PERSONAL_ACCESS_TOKEN;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 103,
            lat: 35,
            zoom: 4
        }
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/witmin/ck46v5ez92o7r1cmml0s0svky',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        map.on('move', ()=> {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            })
        });

    }


    render() {
        return (
            <div>
                <div className="sidebarStyle">Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                <div ref={el => this.mapContainer = el} className="mapContainer"/>
            </div>
        )
    }
}

export default App;
