import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Flatpickr from 'react-flatpickr';
import './DateSelector.css';

@inject('store')
@observer
class DateSelector extends Component {
  render() {
    const { updateEndDate } = this.props.store.app;
    // console.log(`startDate: ${startDate} - endDate: ${endDate}`)
    return (
      <div>
        <label className="label">Accumulation End Date:</label>
        <div className="control">
          <Flatpickr
            options={{
              // minDate: '2016-03-01',
              enableTime: false,
              altInput: true,
              altFormat: 'F j, Y',
              inline: false, // show the calendar inline
              altInputClass: 'input input-calender',
              defaultDate: new Date('2016-12-31')
            }}
            // placeholder="Select Date"
            onChange={updateEndDate}
          />
        </div>
      </div>
    );
  }
}

export default DateSelector;
