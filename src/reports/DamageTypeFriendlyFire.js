import React from 'react'
import ReactTable from 'react-table'
import api from '../api.js'

export default class DamageTypeFriendlyFire extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: []
        }
    }

    componentWillMount() {
        this.fetchData()
    }

    // TODO: table showing all the shit
    fetchData() {
        this.setState({
            loading: true
        })
        api.get('reports/damage_type_friendly_fire/')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    data: data.results,
                    loading: false
                })
            })
    }

    render() {
        return <div>
            <h1>Damage Type Friendly Fire Report</h1>
            <ReactTable
                loading={this.state.loading}
                data={this.state.data}
                columns={[
                {
                    Header: 'Damage Type',
                    accessor: 'id'
                },
                {
                    Header: 'Kills',
                    accessor: 'kills'
                },
                {
                    Header: 'Suicides',
                    accessor: 'suicides'
                },
                {
                    Header: 'Team Kills',
                    accessor: 'team_kills'
                },
                {
                    Header: 'Team Kill %',
                    accessor: 'team_kill_ratio',
                    Cell: row => (
                        <div>
                            {(row.value * 100).toFixed(2)}
                        </div>
                    )
                },]}
            />
        </div>
    }
}