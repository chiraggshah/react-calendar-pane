import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Day extends Component {
  render() {
    const {today, date, selected, children, handleClick, classes} = this.props;
    let newClasses = ['Day'];
    if (today.isSame(date, 'day')) {
      newClasses.push('today');
    }
    if (selected && selected.isSame(date, 'day')) {
      newClasses.push('selected');
    }
    newClasses = newClasses.concat(classes);

    let body;
    if (children) {
      body = children;
    } else {
      body = (
        <button
          className="Day-inner"
          onClick={() => handleClick(date)}
          type="button"
        >
          {date.format('D')}
        </button>
      )
    }

    return (
      <td className={newClasses.join(' ')}
          data-date={date.toISOString()}
          data-day={date.format('D')}
      >
        {body}
      </td>
    );
  }
};

Day.propTypes = {
  handleClick: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
  month: PropTypes.object.isRequired,
  today: PropTypes.object.isRequired,
  selected: PropTypes.object,
  children: PropTypes.node,
};
