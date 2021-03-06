import React from 'react'
import api from './api.js'
import PlayerDamageTypeTable from './PlayerDamageTypeTable.js'
import 'react-placeholder/lib/reactPlaceholder.css'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'

class PlayerSummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
        this.fetchData()
    }

    fetchData() {
        api.get(`players/${this.props.playerId}/stats/`)
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
                            <b>Kills</b>
                        </td>
                        <td>
                            {this.state.data.kills}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Deaths</b>
                        </td>
                        <td>
                            {this.state.data.deaths}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>K:D Ratio</b>
                        </td>
                        <td>
                            {this.state.data.kd_ratio.toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>FF Kills</b>
                        </td>
                        <td>
                            {this.state.data.ff_kills} ({(this.state.data.ff_kills / this.state.data.kills * 100).toFixed(2)}%)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>FF Deaths</b>
                        </td>
                        <td>
                            {this.state.data.ff_deaths} ({(this.state.data.ff_deaths / this.state.data.deaths * 100).toFixed(2)}%)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Total Playtime</b>
                        </td>
                        <td>
                            {moment.duration(this.state.data.playtime).humanize()}
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
            let entries = Object.keys(response.results).map(key => ({
                date: key,
                value: response.results[key]
            }))
            this.setState({
                values: entries
            })
        })
    }

    render() {
        return <div style={{flexShrink: 1, marginTop: 32}}>
        {/* TODO: different colorings for different lengths of play (<15 min, <1hr, <2hr) */}
            <CalendarHeatmap
                // classForValue={(value) => value && moment.duration(value).minutes() > 15 ? {fill: '#ff00ff'} : {fill: '#ff0000'}}
                showWeekdayLabels={true}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                values={this.state.values}
                titleForValue={value => value && moment.duration(value.value).humanize()}
            />
        </div>
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
                    {this.state.player &&
                        <div>
                            {this.state.player.names.length > 0 && <ReactTooltip place="right"/>}
                            <h1 data-tip={this.state.player.names.map(x => x.name)} style={{display: 'inline-block'}}>
                                {this.state.player.names[0].name}
                            </h1>
                        </div>
                    }
                </div>
                <div>
                    <h2 style={{display: 'inline-block'}}>
                        <img alt="Steam" src="/steam.svg"/>
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