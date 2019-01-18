import React from 'react'
import api from './api.js'
import AsyncSelect from 'react-select/lib/Async'
import { Chart, Axis, Series, Bar } from 'react-charts'
import { cloneDeep } from 'lodash'

let damageTypeOptions = inputValue => {
    return new Promise(resolve => {
        api.get('damage-types/', { search: inputValue, limit: 0 }).then(response => response.json())
            .then(response => {
                resolve(response.results.map(x => ({ label: x.id, value: x.id })))
            })
    })
}

class WeaponRangeHistogram extends React.Component {

    fetchHistogram() {
        api.get('frags/range_histogram', {
            'damage_type_ids': this.state.damageTypes
        }).then(response => response.json())
            .then(data => {
                this.histogramData = cloneDeep(data)
                this.updateChartData()
            })
    }

    updateChartData() {
        let data = cloneDeep(this.histogramData)
        if (this.state.normalize) {
            data = Object.keys(data).map(key => {
                let value = data[key]
                value.bins = value.bins.map(x => {
                    return [x[0], x[1] / value.total]
                })
                return value
            })
        }
        let chartData = Object.keys(data).map(key => {
            return {
                label: key,
                data: data[key].bins
            }
        })
        this.setState({ chartData })
    }

    constructor(props) {
        super(props)
        this.state = {
            chartData: [],
        }
    }

    render() {
        return <div>
            <h1>Kill Range Graph</h1>
            <div className="" style={{ marginBottom: 16 }}>
                <AsyncSelect
                    id='damage_type_ids'
                    cacheOptions
                    isMulti
                    defaultOptions
                    loadOptions={damageTypeOptions}
                    onChange={(value, action) => {
                        let damageTypes = value.map(x => x.label)
                        this.setState({ damageTypes }, () => {
                            this.fetchHistogram()
                        })
                    }}
                />
            </div>
            <div style={{ width: 1024, height: 500 }}>
                <Chart
                    data={this.state.chartData}
                >
                    <Axis primary type="linear" />
                    <Axis type="linear" />
                    <Series type={Bar} />
                </Chart>
            </div>
            <div>
                <input id="normalize" type="checkbox" onChange={(event) => {
                    this.setState({
                        normalize: event.target.checked
                    }, () => {
                        this.updateChartData()
                    })
                }} />
                <label for="normalize">Normalize</label>
            </div>
        </div>
    }
}

export default class Weapons extends React.Component {

    render() {
        return <WeaponRangeHistogram />
    }
}