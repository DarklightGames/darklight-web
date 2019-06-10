import React from 'react'
import Select from 'react-select'
import ReactWordCloud from 'react-wordcloud'
import api from '../api.js'
import { Radar } from 'react-chartjs-2'


class LogWordCloud extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            words: [],
            filters: {
                team_index: null,
                type: null
            }
        }
    }

    componentWillMount() {
        this.fetchWords()
    }

    fetchWords() {
        let filters = this.state.filters
        filters = {
            ...Object.keys(filters)
                .filter(key => filters[key] != null)
                .reduce((newFilters, key) => {
                    return {
                        ...newFilters, [key]: filters[key]
                    }
                }, {})
        }
        let params = {
            log: this.props.logId,
            ...filters
        }
        api.get(`text-messages/words`, params)
        .then(response => response.json())
        .then(data => {
            this.setState({words: data.data})
        })
    }

    render() {
        let options = {
            deterministic: true,
            rotations: 0,
            fontSizes: [20, 60]
        }
        let teamOptions = [
            { value: null, label: 'All' },
            { value: 0, label: 'Axis' },
            { value: 1, label: 'Allies' },
        ]
        let typeOptions = [
            { value: null, label: 'All' },
            { value: 'Say', label: 'Global' },
            { value: 'TeamSay', label: 'Team' },
            { value: 'SquadSay', label: 'Squad' },
            { value: 'VehicleSay', label: 'Vehicle' },
            { value: 'CommandSay', label: 'Command' },
        ]
        return <div>
            Team
            <Select
                defaultValue={null}
                options={teamOptions}
                onChange={(option) => {
                    let filters = this.state.filters
                    filters.team_index = option.value
                    this.setState({filters}, () => {
                        this.fetchWords()
                    })
                }}
            />
            Channel
            <Select
                defaultValue={-1}
                options={typeOptions}
                onChange={(option) => {
                    let filters = this.state.filters
                    filters.type = option.value
                    this.setState({filters}, () => {
                        this.fetchWords()
                    })
                }}
            />
            <ReactWordCloud {...this.props} words={this.state.words} options={options}/>
        </div>
    }
}

export default class Communication extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            summary: null,
            data: null
        }
    }

    fetchSummary() {
        api.get(`text-messages/summary/`, {
            log: this.props.logId
        })
        .then(response => response.json())
        .then(response => {
            let datasets = []
            let labels = ['Say', 'TeamSay', 'SquadSay', 'CommandSay', 'VehicleSay']
            var data = [0, 0, 0, 0, 0]
            // axis
            Object.entries(response.axis.types).forEach(element => {
                let type = element[0]
                let index = labels.indexOf(type)
                if (index !== -1) {
                    data[index] = element[1]
                }
            });
            datasets.push({
                label: 'Axis',
                backgroundColor: 'rgba(200,72,72,0.2)',
                borderColor: 'rgba(200,72,72,1)',
                pointBackgroundColor: 'rgba(200,72,72,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(200,72,72,1)',
                data
            })
            data = [0, 0, 0, 0, 0]
            // allies
            Object.entries(response.allies.types).forEach(element => {
                let type = element[0]
                let index = labels.indexOf(type)
                if (index !== -1) {
                    data[index] = element[1]
                }
            });
            datasets.push({
                label: 'Allies',
                backgroundColor: 'rgba(70,118,200,0.2)',
                borderColor: 'rgba(70,118,200,1)',
                pointBackgroundColor: 'rgba(70,118,200,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(70,118,200,1)',
                data
            })
            data = {
                labels: Array.from(labels),
                datasets
            }
            this.setState({ data })
        })
    }

    componentWillMount() {
        this.fetchSummary()
    }

    render() {
        return <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <div style={{justifyItems: 'center'}}>
                <h2>Summary</h2>
                {this.state.data && <Radar data={this.state.data} width={400} height={400} />}
            </div>
            <div>
                <h2>Word Cloud</h2>
                <LogWordCloud logId={this.props.logId} />
            </div>
        </div>
    }
}