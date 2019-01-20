import React from 'react'
import api from './api'
import PropTypes from 'prop-types'
import { Doughnut } from 'react-chartjs-2'
import crc16 from 'crc/crc16'

export default class RoundPlayerSummary extends React.Component {

    static propTypes = {
        roundId: PropTypes.number.isRequired,
        playerId: PropTypes.number.isRequired
    }

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
        api.get(`rounds/${this.props.roundId}/player_summary/`, {
            player_id: this.props.playerId
        }).then(response => response.json())
        .then(response => {
            let kills = response.kills
            let labels = kills.map(x => x.damage_type)
            let data = {
                labels,
                datasets: [{
                    data: kills.map(x => x.total),
                    backgroundColor: labels.map(x => `hsl(${crc16(x) % 360}, 25%, 50%)`)
                }]
            }
            // alert(JSON.stringify(data))
            this.setState({
                data: data
            })
        })
    }

    render() {
        return <div style={{height: 250, flex: 1}}>
            <div style={{flexDirection: 'row', flex: 1}}>
                <div style={{flex: 1}}>
                    <Doughnut
                        height={25}
                        width={120}
                        data={this.state.data}
                    />
                </div>
            </div>
        </div>
    }
}