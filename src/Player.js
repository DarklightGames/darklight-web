import React from 'react'
import api from './api.js'
import PlayerDamageTypeTable from './PlayerDamageTypeTable.js'
import { List } from 'react-content-loader'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

class PlayerSummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
        this.fetchData()
    }

    fetchData() {
        api.get(`players/${this.props.playerId}/summary/`)
        .then(response => response.json())
        .then(response => {
            this.setState({
                data: response
            })
        })
    }

    render() {
        return <div>
            {this.state.data && <div>
                <table>
                    <tr>
                        <td>
                            Kills
                        </td>
                        <td>
                            {this.state.data.kills}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Deaths
                        </td>
                        <td>
                            {this.state.data.deaths}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            K:D Ratio
                        </td>
                        <td>
                            {this.state.data.kd_ratio.toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            FF Kills
                        </td>
                        <td>
                            {this.state.data.ff_kills} ({(this.state.data.ff_kills / this.state.data.kills * 100).toFixed(2)}%)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            FF Deaths
                        </td>
                        <td>
                            {this.state.data.ff_deaths} ({(this.state.data.ff_deaths / this.state.data.deaths * 100).toFixed(2)}%)
                        </td>
                    </tr>
                </table>
            </div>}
        </div>
    }
}

export default class Player extends React.Component {

    constructor(props) {
        super(props)
        this.fetchPlayer()
        this.state = [
        ]
    }

    fetchPlayer() {
        api.get(`players/${this.props.match.params.id}`)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    player: response
                })
            })
    }

    fetchSummary() {
        api.get(`players/${this.props.match.params.id}/summary/`)
            .then(response => response.json())
            .then(response => {
                this.setState({

                })
            })
    }

    fetchDamageTypeData() {
    }

    render() {
        return <div class="container">
            <div style={{justifyContent: 'space-between'}}>
                <h1 style={{display: 'inline-block'}}>
                    {this.state.player && this.state.player.names[0].name}
                </h1>
                <h2 style={{display: 'inline-block'}}>
                    {this.props.match.params.id}
                </h2>
            </div>
            <h2 style={{display: 'inline-block'}}>
                {this.state.player && this.state.player.ips[0].ip}
            </h2>
            <hr />
            <div>
                <PlayerSummary
                    playerId={this.props.match.params.id}
                    data={this.state.summary}
                />
            </div>
            <hr />
            <PlayerDamageTypeTable
                playerId={this.props.match.params.id}
            />
        </div>
    }
}