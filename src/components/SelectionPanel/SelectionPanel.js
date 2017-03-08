import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import axios from "axios";
import { format, addDays } from "date-fns";
// import { toJS } from 'mobx'

// Components
import PestSelector from "./PestSelector";
import StateSelector from "./StateSelector";
import StationSelector from "./StationSelector";
import DateSelector from "./DateSelector";

// styled-components
import { Selector, CalculateBtn } from "../SelectionPanel/styles";

// styles
import "./DateSelector.css";

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
} from "../../utils";

@inject("store")
@observer
class SelectionPanel extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  };

  state = {
    currentYear: format(new Date(), "YYYY"),
    isDisabled: true
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.store.app.setReady(false);
    const { pest, state, station, endDate } = this.props.store.app;

    // set the state for the results page
    this.props.store.app.setRpest(pest);
    this.props.store.app.setRstate(state);
    this.props.store.app.setRstation(station);
    this.props.store.app.setRendDate(endDate);

    this.run();
    // Go to Results Page
    this.context.router.push("/results");
  };

  getACISData() {
    const { pest, station, getStartDate } = this.props.store.app;

    const params = {
      sid: `${michiganIdAdjustment(station)} ${station.network}`,
      sdate: getStartDate,
      edate: format(addDays(this.props.store.app.rEndDate, 5), "YYYY-MM-DD"),
      elems: networkTemperatureAdjustment(station.network)
    };
    console.log(params);
    return axios
      .post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          this.props.store.app.setACISData(res.data.data);
          console.log(`ACIS length: ${this.props.store.app.ACISData.length}`);
          const acisFlat = flattenArray(res.data.data);
          console.log(
            `%cAcis missing values: ${acisFlat.filter(e => e === "M").length}`,
            "color: red"
          );
          console.log(`AcisFlat: ${acisFlat}`);
          console.log(`AcisFlat: ${acisFlat.length}`);
          const acis = replaceSingleMissingValues(acisFlat);
          console.log(`acis lenght: ${acis.length}`);
          console.log(
            `%cAfter replaceSingleMissingValues: ${acis.filter(e =>
                e === "M").length}`,
            "color: red"
          );
          console.log(`Acis: ${acis}`);
          if (acis.filter(e => e === "M").length === 0) {
            this.props.store.app.updateDegreeDay(
              calculateDegreeDay(pest, unflattenArray(acis))
            );
            this.props.store.app.setReady(true);
            console.log(
              `degreeDay lenght: ${this.props.store.app.degreeDay.lenght}`
            );
            return;
          }
          return acis;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getSisterStationIdAndNetwork() {
    console.log("getSisterStationIdAndNetwork");
    const { station } = this.props.store.app;
    return axios(
      `http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/${station.id}/${station.network}`
    )
      .then(res => {
        return res.data.temp;
      })
      .catch(err => {
        console.log(err);
      });
  }

  getSisterStationData(idAndNetwork, acis) {
    console.log("getSisterStationData");
    const [id, network] = idAndNetwork.split(" ");
    const { pest, getStartDate, rEndDate } = this.props.store.app;

    const params = {
      sid: `${id} ${network}`,
      sdate: getStartDate,
      edate: format(addDays(this.props.store.app.rEndDate, 5), "YYYY-MM-DD"),
      elems: networkTemperatureAdjustment(network)
    };
    console.log(params);
    return axios
      .post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          const sisterFlat = flattenArray(res.data.data);
          console.log(sisterFlat.length);
          console.log(acis.length);
          const acisSister = replaceConsecutiveMissingValues(sisterFlat, acis);
          console.log(
            `%cAfter replaceConsecutiveMissingValues: ${acisSister.filter(e =>
                e === "M").length}`,
            "color: red"
          );
          console.log(`Acis: ${acisSister}`);
          // If not missing values
          if (acisSister.filter(e => e === "M").length === 0) {
            this.props.store.app.updateDegreeDay(
              calculateDegreeDay(pest, unflattenArray(acisSister))
            );
            this.props.store.app.setReady(true);
            return;
          }

          // if missing values and current year go to forecast
          if (format(rEndDate, "YYYY") === this.state.currentYear) {
            console.log("YEAR 2017");
            return acisSister;
          } else {
            console.log("YEAR 2016");
            // if missing values and not current year
            const results = unflattenArray(acisSister);
            this.props.store.app.setMissingValue(
              calculateMissingValues(results)
            );
            this.props.store.app.updateDegreeDay(
              calculateDegreeDay(pest, results)
            );
            this.props.store.app.setReady(true);
            return;
          }
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  forecast(acisSister) {
    const { pest, station, getStartDate } = this.props.store.app;
    const eDate = format(
      addDays(this.props.store.app.rEndDate, 5),
      "YYYY-MM-DD"
    );
    return axios
      .get(
        `http://newa.nrcc.cornell.edu/newaUtil/getFcstData/${station.id}/${station.network}/temp/${getStartDate}/${eDate}`
      )
      .then(res => {
        if (!res.data.hasOwnProperty("error")) {
          const forecastFlat = flattenArray(res.data.data);
          console.log(`forecastFlat length: ${forecastFlat.length}`);
          console.log(`forecastFlat: ${forecastFlat}`);

          const acisSisterForecast = replaceConsecutiveMissingValues(
            forecastFlat,
            acisSister
          );
          console.log(
            `%cacisSisterForecast after replaceConsecutiveMissingValues: ${acisSisterForecast.filter(e =>
                e === "M").length}`,
            "color: red"
          );
          console.log(`acisSisterForecast: ${acisSisterForecast}`);
          // If not missing values
          if (acisSisterForecast.filter(e => e === "M").length === 0) {
            this.props.store.app.updateDegreeDay(
              calculateDegreeDay(pest, unflattenArray(acisSisterForecast))
            );
            this.props.store.app.setReady(true);
            return;
          }
          // if missing values
          const results = unflattenArray(acisSisterForecast);
          this.props.store.app.setMissingValue(calculateMissingValues(results));
          this.props.store.app.updateDegreeDay(
            calculateDegreeDay(pest, results)
          );
          this.props.store.app.setReady(true);
          return;
        }
        console.log(res.data.error);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async run() {
    try {
      const acis = await this.getACISData();
      console.log("one");
      if (acis) {
        console.log("two");
        const idAndNetwork = await this.getSisterStationIdAndNetwork();
        console.log("three");
        const acisSister = await this.getSisterStationData(idAndNetwork, acis);
        console.log("four");
        if (acisSister) return this.forecast(acisSister);
        console.log("five");
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { getAllRequiredFields } = this.props.store.app;
    return (
      <form onSubmit={this.handleSubmit}>
        <PestSelector />
        <br />
        <StateSelector />
        <br />
        <StationSelector />
        <br />
        <DateSelector />
        <br />
        <Selector>
          <CalculateBtn
            className={getAllRequiredFields ? "noselect" : null}
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
