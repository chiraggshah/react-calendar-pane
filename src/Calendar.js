import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Day from './Day';
import DayOfWeek from './DayOfWeek';
import Week from './Week';

export default class Calendar extends Component {

  constructor(props) {
    super(props);
    const {date, month} = this.props;
    this.state = {
      date,
      month: date ? date : month,
    }
  }

  componentWillMount() {
    const {locale} = this.props;
    const {date, month} = this.state;
    moment.locale(locale);

    if (date) {
      date.locale(locale)
    }

    month.locale(locale)
  }

  componentWillUpdate(nextProps, nextState) {
    const {locale} = this.props;
    const {date, month} = nextState;
    moment.locale(locale);

    if (date) {
      date.locale(locale)
    }

    month.locale(locale)
  }

  handleClick(selectedDate) {
    let dateValid = this.props.onSelect(selectedDate, this.state.date, this.state.month);
    const newDate = dateValid ? moment(selectedDate) : null;
    this.setState({date: newDate})
  }

  previous() {
    this.setState({
      month: moment(this.state.month).subtract(1, 'month')
    });
  }

  next() {
    this.setState({
      month: moment(this.state.month).add(1, 'month')
    });
  }

  render() {
    const {startOfWeekIndex, dayRenderer, className, weeklyTotals} = this.props;
    const {date, month} = this.state;

    const classes = ['Calendar', className].join(' ');
    const today = moment();

    let current = month.clone().startOf('month').day(startOfWeekIndex);
    if (current.date() > 1 && current.date() < 7) {
      current.subtract(7, 'd');
    }

    let end = month.clone().endOf('month').day(7 + startOfWeekIndex);
    if (end.date() > 7) {
      end.subtract(7, 'd');
    }

    let elements = [];
    let days = [];
    let week = 1;
    let i = 1;
    let daysOfWeek = [];
    let day = current.clone();
    for (let j = 0; j < 7; j++) {
      let dayOfWeekKey = 'dayOfWeek' + j;
      daysOfWeek.push(<DayOfWeek key={dayOfWeekKey} date={day.clone()}/>);
      day.add(1, 'days');
    }
    daysOfWeek.push(<th key="total" className="DayOfWeek">Total</th>);

    while (current.isBefore(end)) {
      let dayClasses = this.props.dayClasses(current);
      let otherMonth = false;
      if (!current.isSame(month, 'month')) {
        dayClasses = dayClasses.concat(['other-month']);
        otherMonth = true;
      }

      let props = {
        date: current.clone(),
        selected: date,
        month: month,
        today: today,
        classes: dayClasses,
        handleClick: this.handleClick.bind(this),
        otherMonth: otherMonth,
      };

      let children = dayRenderer ? dayRenderer(props) : null;

      days.push(
        <Day key={i++} {...props}>
          {children}
        </Day>
      );
      current.add(1, 'days');
      if (current.day() === startOfWeekIndex) {
        const weekTotal = weeklyTotals ? weeklyTotals[parseInt(week)-1] : 0;
        const weekTotalKey = `week-total-${week}`;
        const weekKey = `week-${week}`;

        days.push(
          <td className={dayClasses} key={weekTotalKey}>{weekTotal}</td>
        );
        elements.push(<Week key={weekKey}>{days}</Week>);
        days = [];
        week = week+1;
      }
    }

    let nav

    if (this.props.useNav) {
      nav = (
        <tr className="month-header">
          <th className="nav previous">
            <button className="nav-inner" onClick={() => this.previous()} type="button">«</button>
          </th>
          <th colSpan="6">
            <span className="month">{month.format('MMMM')}</span> <span className="year">{month.format('YYYY')}</span>
          </th>
          <th className="nav next">
            <button className="nav-inner" onClick={() => this.next()} type="button">»</button>
          </th>
        </tr>
      )
    }
    else {
      nav = (
        <tr className="month-header">
          <th colSpan="7">
            <span className="month">{month.format('MMMM')}</span> <span className="year">{month.format('YYYY')}</span>
          </th>
        </tr>
      )
    }

    return (
      <table className={classes}>
        <thead>
          {nav}
        </thead>
        <thead>
          <tr className="days-header">{daysOfWeek}</tr>
        </thead>
        <tbody>
          {elements}
        </tbody>
      </table>
    );
  }
};

Calendar.defaultProps = {
  month: moment(),
  dayClasses: function () {
    return []
  },
  useNav: true,
  locale: 'en',
  startOfWeekIndex: 0
};

Calendar.propTypes = {
  onSelect: PropTypes.func.isRequired,
  date: PropTypes.object,
  month: PropTypes.object,
  dayClasses: PropTypes.func,
  useNav: PropTypes.bool,
  locale: PropTypes.string,
  startOfWeekIndex: PropTypes.number,
  dayRenderer: PropTypes.func
};
