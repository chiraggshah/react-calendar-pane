import React, {Component} from 'react';


export default class DayOfWeek extends Component {
  render() {
    return <th className="DayOfWeek">{this.props.date.format('dd')}</th>
  }
}


