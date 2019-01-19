import React from 'react'
import { Map, ImageOverlay } from 'react-leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import api from './api'
import L from 'leaflet'
import RoundsTable from './RoundsTable';

class FragMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            map: null,
            summary: null,
        }
    }

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        api.get(`maps/${this.props.mapId}/`)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    map: response
                })
                api.get(`maps/${this.props.mapId}/heatmap/`)
                    .then(response => response.json())
                    .then(response => {
                        console.log(JSON.stringify(response))
                        this.setState({
                            data: response.data
                        })
                    })
            })
    }

    render() {
        if (this.state.map) {
            let bounds = this.state.map.bounds
            // there is a translation problem when the min/max are not even, so let's make them evenly away from the center
            for (let i = 0; i < 2; ++i) {
                let min = bounds[0][i]
                let max = bounds[1][i]
                let center = (max - min) / 2
                min += -center
                max += -center
                bounds[0][i] = min
                bounds[1][i] = max
            }
            return <Map
            style={{ height: 512 }}
            bounds={bounds}
            crs={L.CRS.Simple}
            minZoom={-7}
        >
            <ImageOverlay
                url={`/maps/${this.props.mapId}.png`}
                bounds={bounds}
            />
            <HeatmapLayer
                minOpacity={0.125}
                points={this.state.data}
                longitudeExtractor={m => m[0]}
                latitudeExtractor={m => m[1]}   // some sort of lat thing (needs to be flipped)
                intensityExtractor={m => 10}
            />
        </Map>
        }
        return null
    }
}

export default class MapComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            summary: null
        }
    }

    componentWillMount() {
        this.fetchSummary()
    }

    fetchSummary() {
        api.get(`maps/${this.props.match.params.id}/summary`)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    summary: response
                })
            })
    }

    render() {
        return <div>
            <h1>{this.props.match.params.id}</h1>
            {this.state.summary && <div>
                <table>
                    <tr>
                        <td>Axis Wins</td>
                        <td>{this.state.summary.axis_wins}</td>
                    </tr>
                    <tr>
                        <td>Allied Wins</td>
                        <td>{this.state.summary.allied_wins}</td>
                    </tr>
                    <tr>
                        <td>Axis Deaths</td>
                        <td>{this.state.summary.axis_deaths}</td>
                    </tr>
                    <tr>
                        <td>Allied Deaths</td>
                        <td>{this.state.summary.allied_deaths}</td>
                    </tr>
                </table>
            </div>}
            <h1>Rounds</h1>
            <RoundsTable
                defaultPageSize={5}
                map={this.props.match.params.id}
            />
            <h1>Heatmap</h1>
            <FragMap
                mapId={this.props.match.params.id}
            />
        </div>
    }
}