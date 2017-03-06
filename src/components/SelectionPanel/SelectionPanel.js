import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { format, subDays, addDays } from 'date-fns';
// import { toJS } from 'mobx'

// Components
import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

// styled-components
import {Selector, CalculateBtn} from '../SelectionPanel/styles'

// styles
import './DateSelector.css'

// utility functions
import {
  networkTemperatureAdjustment,
  michiganIdAdjustment,
  flattenArray,
  unflattenArray,
  calculateDegreeDay,
  replaceSingleMissingValues,
  replaceConsecutiveMissingValues,
  // weightedAverage,
  calculateMissingValues
} from '../../utils';


@inject('store')
@observer
class SelectionPanel extends Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  state = {
    currentYear: format(new Date(), 'YYYY'),
    isDisabled: true
  };

  handleSubmit = (e) => {
    const {pest,state,station,endDate} = this.props.store.app
    e.preventDefault()

    // set the state for the results page
    this.props.store.app.setRpest(pest)
    this.props.store.app.setRstate(state)
    this.props.store.app.setRstation(station)
    this.props.store.app.setREndDate(endDate)

    // get data from ACIS
    this.getACISdata()
    this.props.store.app.setReady(true)
    this.context.router.push('/results')
  }

  getACISdata = () => {
    const { station, rendDate, getStartDate } = this.props.store.app;
    const rEndDate = addDays(rendDate, 5)
    // Creating the object for the POST request
    const params = {
      sid: `${michiganIdAdjustment(station)} ${station.network}`,
      sdate: format(getStartDate, 'YYYY-MM-DD'),
      edate: format(rEndDate, 'YYYY-MM-DD'),
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
          this.props.store.app.setACISData(res.data.data);
          this.replaceMissingValues(res.data.data);
        } else {
          console.log(res.data.error);
        }
      })
      .catch(err => {
        console.log(err);
        this.props.store.app.setACISData([]);
      });
  };

  // Calculate degree-days and replace missing values
  replaceMissingValues = data => {
    console.log(
      '------------------------------------------------------------------------'
    );
    const { pest, station, getStartDate, rendDate } = this.props.store.app;
    const rEndDate = addDays(rendDate, 5)
    const dataFlat = flattenArray(data);
    console.log(`current station: ${dataFlat.filter(e => e === 'M').length}`);
    // console.log(dataFlat.toString());
    // Replace ONLY single non consecutive 'M' values
    const resultsFlat = replaceSingleMissingValues(dataFlat);
    console.log(
      `current station after replaceSingleMissingValues: ${resultsFlat.filter(e =>
          e === 'M').length}`
    );
    console.log('current: ' + resultsFlat.toString());
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
          sdate: format(getStartDate, 'YYYY-MM-DD'),
          edate: format(rEndDate, 'YYYY-MM-DD'),
          elems: networkTemperatureAdjustment(res[1])
        };
        // Making the call to the API
        console.log(
          `First POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`
        );
        axios
          .post('http://data.test.rcc-acis.org/StnData', params)
          .then(res => {
            if (!res.data.hasOwnProperty('error')) {
              const sisterFlat = flattenArray(res.data.data);
              console.log('sister: ' + sisterFlat.toString());

              const currentFlat = replaceConsecutiveMissingValues(
                sisterFlat,
                resultsFlat
              );

              console.log(
                `after replacement with sister station: ${currentFlat.filter(e =>
                    e === 'M').length} missing values`
              );
              console.log('current data after replacing data with sister: ' + currentFlat.toString());

              if (currentFlat.filter(e => e === 'M').length === 0) {
                this.props.store.app.updateDegreeDay(
                  calculateDegreeDay(pest, unflattenArray(currentFlat))
                );
                return;
              } else {
                if (format(subDays(rEndDate, 5), 'YYYY') === this.state.currentYear) {
                  console.log('inside forecast')
                  return currentFlat;
                } else {

                  let results = []
                  if(currentFlat.filter(e => e === 'M').length !== 0) {
                    results = unflattenArray(currentFlat)
                    this.props.store.app.setMissingValue(
                      calculateMissingValues(results)
                    );
                    this.props.store.app.updateDegreeDay(calculateDegreeDay(pest,
                      results));
                  }

                  // let results = [];
                  // results = weightedAverage(currentFlat);
                  // if (results.filter(e => e === 'M').length !== 0) {
                  //   results = weightedAverage(results);
                  // }
                  // console.log(
                  //   `after weightedAverage: ${results.filter(e =>
                  //       e === 'M').length}`
                  // );
                  // console.log(results.toString());
                  //
                  // if (results.filter(e => e === 'M').length !== 0) {
                  //   // this.props.store.app.setMissingValue(
                  //   //   calculateMissingValues(unflattenArray(results))
                  //   // );
                  //   results = unflattenArray(results)
                  //   console.log(results)
                  //   const removedMissingValues = results.map(day => day.filter(e => e !== 'M'))
                  //   console.log(removedMissingValues)
                  //   this.props.store.app.updateDegreeDay(
                  //     calculateDegreeDay(pest, removedMissingValues)
                  //   );
                  // }
                }
              }
            } else {
              console.log(res.data.error);
            }
          })
          // FORECAST------------------------------------------------------------------------
          .then(sisterData => {
            // console.log(currentFlat.toString())
            const sDate = format(getStartDate, 'YYYY-MM-DD');
            const eDate = format(rEndDate, 'YYYY-MM-DD');
            // console.log('sisterData: ' + sisterData.toString())

            if (sisterData) {
              axios
                .get(
                  `http://newa.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/temp/${sDate}/${eDate}`
                )
                .then(res => {
                  if (!res.data.hasOwnProperty('error')) {
                    const forecastFlat = flattenArray(res.data.data);
                    console.log(
                      `forecast flat missing values: ${forecastFlat.filter(e =>
                          e === 'M').length}`
                    );
                    console.log(`forecast data: ${forecastFlat.toString()}`)

                    const currentFlat = replaceConsecutiveMissingValues(
                      forecastFlat,
                      sisterData
                    );

                    console.log(
                      `after replacement with forecast Data there are: ${currentFlat.filter(e =>
                          e === 'M').length} missing values`
                    );
                    console.log(currentFlat.toString());

                    if (currentFlat.filter(e => e === 'M').length === 0) {
                      this.props.store.app.updateDegreeDay(
                        calculateDegreeDay(pest, unflattenArray(currentFlat))
                      );
                    } else {

                      let results = []
                      if(currentFlat.filter(e => e === 'M').length !== 0) {
                        results = unflattenArray(currentFlat)
                        this.props.store.app.setMissingValue(
                          calculateMissingValues(results)
                        );
                        this.props.store.app.updateDegreeDay(calculateDegreeDay(pest,
                          results));
                      }
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
    const {getAllRequiredFields} = this.props.store.app
    return (
      <form onSubmit={this.handleSubmit}>
        <PestSelector />
        <br/>
        <StateSelector />
        <br/>
        <StationSelector />
        <br/>
        <DateSelector />
        <br/>
        <Selector>
          <CalculateBtn
            className={getAllRequiredFields ? 'noselect' : null}
            type="submit"
          >
            Calculate
          </CalculateBtn>
        </Selector>
      </form>
    );
  }
}

export default SelectionPanel;
