import React, {Component} from 'react';


export default class Week extends Component {
  render() {
    return <tr className='Week'>{this.props.children}</tr>
  }
};


