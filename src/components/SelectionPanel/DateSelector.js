import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DayPicker from 'react-day-picker';
import './DateSelector.css'

import {action} from 'mobx';

@inject('store') @observer
class DateSelector extends Component {

  @action handleDayClick = (e, endDate) => {
    this.props.store.app.endDate = endDate
    const startDate = `01/01/${endDate.getFullYear()}`
    this.props.store.app.startDate = startDate
  }

  render () {
    const {startDate, endDate} = this.props.store.app
    console.log(`startDate: ${startDate} - endDate: ${endDate}`)
    return (
      <div>
        <label className="label">Accumulation End Date:</label>
        <DayPicker
          onDayClick={this.handleDayClick}
          selectedDays={this.isDaySelected}
        />
        <p>
          The selected date is:
          <span className="primary-color">
            {endDate.toLocaleDateString()}
          </span>
        </p>
      </div>
    )
  }
}

export default DateSelector;
