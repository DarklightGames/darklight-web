import React from 'react'

export default class Reports extends React.Component {

    render() {
        return <div>
            <h1>Reports</h1>
        <ul>
            <li>
                <a href="/reports/damage-type-friendly-fire">
                    Damage Type Friendly Fire and Suicides
                </a>
            </li>
            <p>
                This is an aspirational list of reports that would be nice to have in the future.
            </p>
        </ul>
            <ul>
                <li>Squad Rally Points</li>
                <li>Players With Most Kills</li>
            </ul>
        </div>
    }
}