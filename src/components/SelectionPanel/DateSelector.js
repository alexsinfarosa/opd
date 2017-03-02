import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Flatpickr from 'react-flatpickr';
import './DateSelector.css';

// styled-components
import {Selector} from '../SelectionPanel/styles'

@inject('store')
@observer
class DateSelector extends Component {
  render() {
    console.log(this.props.store.app.startDate)
    console.log(this.props.store.app.endDate)
    // console.log(`startDate: ${startDate} - endDate: ${endDate}`)
    return (
      <Selector>
        <label>Accumulation End Date:</label>
        <Flatpickr
          options={{
            enableTime: false,
            altInput: true,
            altFormat: 'F j, Y',
            inline: false, // show the calendar inline
            altInputClass: 'input input-calender',
            defaultDate: new Date()
          }}
          // placeholder="Select Date"
          onChange={d => this.props.store.app.setEndDate(d)}
        />
      </Selector>
    );
  }
}

export default DateSelector;
