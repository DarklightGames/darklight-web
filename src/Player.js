import React from 'react'
import api from './api.js'
import PlayerDamageTypeTable from './PlayerDamageTypeTable.js'
import { List } from 'react-content-loader'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import moment from 'moment'

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
                    <tr>
                        <td>
                            Total Playtime
                        </td>
                        <td>
                            {moment.duration(this.state.data.total_playtime).humanize()}
                        </td>
                    </tr>
                </table>
            </div>}
        </div>
    }
}

class PlayerSessionHeatmap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            values: []
        }
    }

    componentDidMount() {
        api.get(`players/${this.props.playerId}/sessions/`)
        .then(response => response.json())
        .then(response => {
            this.setState({
                values: response.results.map(x => ({
                    date: x
                }))
            })
        })
    }

    render() {
        return <CalendarHeatmap
            showWeekdayLabels={true}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            values={this.state.values}
            titleForValue={value => value && value.date}    /* this should actually be a duration (get this from api) */
        />
    }
}

export default class Player extends React.Component {

    constructor(props) {
        super(props)
        this.fetchPlayer()
        this.state = {
        }
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

    render() {
        return <div class="container">
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div>
                    <h1 style={{display: 'inline-block'}}>
                        {this.state.player && this.state.player.names[0].name}
                    </h1>
                </div>
                <div>
                    <h2 style={{display: 'inline-block'}}>
                        <img src="/steam.svg"/>
                        <a href={`https://steamcommunity.com/profiles/${this.props.match.params.id}`}>
                            #{this.props.match.params.id}
                        </a>
                    </h2>
                </div>
            </div>
            <div style={{flexDirection: 'row'}}>
                <PlayerSummary
                    playerId={this.props.match.params.id}
                    data={this.state.summary}
                />
            </div>
            <div>
                <h1>Sessions</h1>
                <PlayerSessionHeatmap
                    playerId={this.props.match.params.id}
                    endDate={moment().toDate()}
                    startDate={moment().subtract('year', 1).toDate()}
                />
            </div>
            <h1>
                Damage Types
            </h1>
            <PlayerDamageTypeTable
                playerId={this.props.match.params.id}
            />
        </div>
    }
}