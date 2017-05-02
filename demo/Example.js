import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Calendar from '../lib/Calendar.js';
import moment from 'moment';
import momentFr from 'moment/locale/fr';

function customDayRenderer(props) {

  const dayHours = props.otherMonth ? null : <span>
    <br />
    {(Math.random() * 10).toFixed(2)}
  </span>;

  return (
    <a onClick={() => props.handleClick(props.date)}>
      <div className="Day-inner" >
        {props.date.format('D')}
        {dayHours}
      </div>
    </a>
  )
}

class Example extends Component {

  onSelect(date, previousDate, currentMonth) {
    if (moment(date).isSame(previousDate)) {
      console.info('onSelect: false', date);
      return false;
    } else if (currentMonth.isSame(date, 'month')) {
      console.info('onSelect: true', date);
      return true;
    } else {
      console.info('onSelect: none', date);
    }
  };

  render() {
    let dayClasses = function (date) {
      let day = date.isoWeekday();
      if (day == 6 || day == 7) {
        return (['weekend'])
      }
      return ([])
    };

    return (
      <div>
        <p>Calendar with weekend</p>
        <Calendar onSelect={(d, pD, cM) => this.onSelect(d, pD, cM)} dayClasses={dayClasses}/>
        <p>Calendar without nav</p>
        <Calendar onSelect={(d, pD, cM) => this.onSelect(d, pD, cM)} dayClasses={dayClasses} useNav={false}/>
        <p>French calendar</p>
        <Calendar onSelect={(d, pD, cM) => this.onSelect(d, pD, cM)} dayClasses={dayClasses} locale="fr" startOfWeekIndex={1}/>
        <p>Calendar with custom day renderer</p>
        <Calendar onSelect={(d, pD, cM) => this.onSelect(d, pD, cM)} dayRenderer={customDayRenderer} weeklyTotals={[10, 20, 30, 40, 50]} />
      </div>
    );
  }
};

ReactDOM.render(<Example />, document.getElementById("container"));
