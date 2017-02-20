import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import CustomLabel from './CustomLabel';

import { cumulativeDegreeDayDataGraph } from '../../utils';

@inject('store')
@observer
export default class ResultsTable extends Component {
  render() {
    const { ACISData, cumulativeDegreeDay } = this.props.store.app;
    return (
      <div className="columns">
        <div className="column has-text-centered">
          {/* <div className="title is-5">Accumulated Degree-Days</div> */}
          <br/>
          <LineChart
            width={730}
            height={260}
            data={cumulativeDegreeDayDataGraph(cumulativeDegreeDay, ACISData)}
          >
            <XAxis dataKey="Date" tick={<CustomLabel />} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="Accumulated Degree-Days"
              dot={false}
              stroke="#3273DC"
              activeDot={{ r: 6 }}
            />
            {/* <Line type="monotone" dataKey="pv" stroke="#82ca9d" /> */}
          </LineChart>
        </div>
      </div>
    );
  }
}
