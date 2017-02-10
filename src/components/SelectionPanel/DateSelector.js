import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DayPicker from 'react-day-picker';
import './DateSelector.css'

@inject('store') @observer
class DateSelector extends Component {

  render () {
    const {endDate, handleDayClick} = this.props.store.app
    // console.log(`startDate: ${startDate} - endDate: ${endDate}`)
    return (
      <div>
        <label className="label">Accumulation End Date:</label>
        <DayPicker
          onDayClick={handleDayClick}
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
