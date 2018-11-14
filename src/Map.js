import React from 'react'
import { Map, ImageOverlay } from 'react-leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import api from './api'
import L from 'leaflet'

class FragMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        api.get(`maps/${this.props.mapId}/heatmap/`)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    data: response.data
                })
            })
    }

    render() {
        return <Map
            style={{ height: 512 }}
            bounds={[[-16384, -16384], [32768, 32768]]}
            crs={L.CRS.Simple}
            minZoom={-7}
        >
            <ImageOverlay
                url={`/maps/${this.props.mapId}.png`}
                bounds={[[-16384, -16384], [32768, 32768]]}
            />
            <HeatmapLayer
                minOpacity={0.125}
                points={this.state.data}
                longitudeExtractor={m => m[0]}
                latitudeExtractor={m => 16384 - m[1]}
                intensityExtractor={m => 10}
            />
        </Map>
    }
}

export default class MapComponent extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div>
            <h1>{this.props.match.params.id}</h1>
            <FragMap
                mapId={this.props.match.params.id}
            />
        </div>
    }
}