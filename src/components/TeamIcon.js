import React from 'react'

export default class TeamIcon extends React.Component {

    constructor(props) {
        super(props)
    }

    // TODO: move to 
    getSrc(teamIndex) {
        if (teamIndex === 0) {
            return "/axis.svg"
        } else if (teamIndex === 1) {
            return "/allies.svg"
        }
        return null
    }

    render() {
        return <img alt="" src={this.getSrc(this.props.teamIndex)} style={{ height: 20, filter: 'invert(0.75)' }} />
    }
}