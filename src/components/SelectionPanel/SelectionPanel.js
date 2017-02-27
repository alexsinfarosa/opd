import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import views from 'config/views';
// import { toJS } from 'mobx'
import axios from 'axios';
import { format } from 'date-fns';

import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

import {
  networkTemperatureAdjustment,
  michiganIdAdjustment,
  flattenArray,
  unflattenArray,
  calculateDegreeDay,
  replaceSingleMissingValues,
  replaceConsecutiveMissingValues,
  weightedAverage,
  removedMissingValues
} from '../../utils';

@inject('store')
@observer
class SelectionPanel extends Component {
  state = {
    currentYear: new Date().getFullYear()
  };
  getACISdata = () => {
    const { station, endDate, startDate } = this.props.store.app;
    const { router } = this.props.store;
    const { store } = this.props;

    // Creating the object for the POST request
    const params = {
      sid: `${michiganIdAdjustment(station)} ${station.network}`,
      sdate: format(startDate, 'YYYY-MM-DD'),
      edate: format(endDate, 'YYYY-MM-DD'),
      elems: networkTemperatureAdjustment(station.network)
    };

    // Making the call to the API
    console.log(
      `First POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`
    );

    // POST request
    axios
      .post('http://data.test.rcc-acis.org/StnData', params)
      .then(res => {
        if (!res.data.hasOwnProperty('error')) {
          this.props.store.app.updateACISData(res.data.data);
          this.replaceMissingValues(res.data.data);
          router.goTo(views.results, { id: 111 }, store);
        } else {
          console.log(res.data.error);
        }
      })
      .catch(err => {
        console.log(err);
        this.props.store.app.updateACISData([]);
      });
  };

  replaceMissingValues = data => {
    console.log(
      '------------------------------------------------------------------------'
    );
    const { pest, station, startDate, endDate } = this.props.store.app;
    const dataFlat = flattenArray(data);
    console.log(`current station: ${dataFlat.filter(e => e === 'M').length}`);
    // console.log(dataFlat.toString());
    // Replace ONLY single non consecutive 'M' values
    const resultsFlat = replaceSingleMissingValues(dataFlat);
    console.log(
      `current station after replaceSingleMissingValues: ${resultsFlat.filter(e =>
          e === 'M').length}`
    );
    // console.log(resultsFlat.toString());
    // Update store with replaced values
    if (resultsFlat.filter(e => e === 'M').length === 0) {
      this.props.store.app.updateDegreeDay(
        calculateDegreeDay(pest, unflattenArray(resultsFlat))
      );
      return;
    }

    // SISTER ---------------------------------------------------------------------------------
    axios
      .get(
        `http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`
      )
      // Get id and network of sister station
      .then(res => {
        return res.data.temp.split(' ');
      })
      // Post request to get data from sister station
      .then(res => {
        const params = {
          sid: `${res[0]} ${res[1]}`,
          sdate: format(startDate, 'YYYY-MM-DD'),
          edate: format(endDate, 'YYYY-MM-DD'),
          elems: networkTemperatureAdjustment(res[1])
        };
        axios
          .post('http://data.test.rcc-acis.org/StnData', params)
          .then(res => {
            if (!res.data.hasOwnProperty('error')) {
              const sisterFlat = flattenArray(res.data.data);
              // console.log(sisterFlat.toString());

              const currentFlat = replaceConsecutiveMissingValues(
                sisterFlat,
                resultsFlat
              );

              console.log(
                `after replaceConsecutiveMissingValues: ${currentFlat.filter(e =>
                    e === 'M').length}`
              );
              console.log(currentFlat.toString());

              if (currentFlat.filter(e => e === 'M').length === 0) {
                this.props.store.app.updateDegreeDay(
                  calculateDegreeDay(pest, unflattenArray(currentFlat))
                );
                return;
              } else {
                if (endDate.slice(0, 4) === this.state.currentYear) {
                  return currentFlat;
                } else {
                  let results = [];
                  results = weightedAverage(currentFlat);
                  if (results.filter(e => e === 'M').length !== 0) {
                    results = weightedAverage(results);
                  }
                  if (results.filter(e => e === 'M').length !== 0) {
                    results = weightedAverage(results);
                  }
                  if (results.filter(e => e === 'M').length !== 0) {
                    // this.props.store.app.setMissingValue(
                    //   removedMissingValues(results)
                    // );
                    this.props.store.app.updateDegreeDay(
                      calculateDegreeDay(pest, unflattenArray(resultsFlat))
                    );
                  }
                }
              }
            } else {
              console.log(res.data.error);
            }
          })
          // FORECAST------------------------------------------------------------------------
          .then(sisterData => {
            // console.log(currentFlat.toString())
            const sDate = format(startDate, 'YYYY-MM-DD');
            const eDate = format(endDate, 'YYYY-MM-DD');

            if (sisterData) {
              axios
                .get(
                  `http://newatest.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/temp/${sDate}/${eDate}`
                )
                .then(res => {
                  if (!res.data.hasOwnProperty('error')) {
                    const forecastFlat = flattenArray(res.data.data);
                    console.log(
                      `forecast flat: ${forecastFlat.filter(e =>
                          e === 'M').length}`
                    );
                    console.log(forecastFlat.toString());

                    const currentFlat = replaceConsecutiveMissingValues(
                      forecastFlat,
                      forecastFlat
                    );

                    console.log(
                      `after replaceConsecutiveMissingValues: ${currentFlat.filter(e =>
                          e === 'M').length}`
                    );
                    console.log(currentFlat.toString());

                    if (currentFlat.filter(e => e === 'M').length === 0) {
                      this.props.store.app.updateDegreeDay(
                        calculateDegreeDay(pest, unflattenArray(currentFlat))
                      );
                      return;
                    } else {
                      return currentFlat;
                    }
                  }
                });
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { getAllRequiredFields } = this.props.store.app;
    return (
      <div className="box">
        <PestSelector />
        <br />
        <StateSelector />
        <br />
        <StationSelector />
        <br />
        <DateSelector />
        <br />
        <button
          className={
            `button is-primary ${getAllRequiredFields ? 'is-disabled' : null}`
          }
          onClick={this.getACISdata}
        >
          Calculate
        </button>
      </div>
    );
  }
}

export default SelectionPanel;
