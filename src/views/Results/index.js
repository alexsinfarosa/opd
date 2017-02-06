import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import mobx, { action, computed } from 'mobx';

import newaPic from './newa_logo.jpg'
import pmepPic from './pmep_logo.jpg'
import acisPic from './PoweredbyACIS_NRCC.jpg'
import moment from 'moment'

import './Results.css'

@inject('store') @observer
class ResultsView extends Component {

  @action setStage = (e) => {
    const { pest } = this.props.store.app
    const selectedStage = pest.preBiofix.filter(stage => stage.stage === e.target.value)[0]
    this.props.store.app.stage = selectedStage
  }

  @computed get getStageList() {
    const { pest } = this.props.store.app
    if (Object.keys(pest).length !== 0) {
      return pest.preBiofix.map(stage =>
        <option key={stage.id}>{stage.stage}</option>)
    }
  }

  render () {
  const { pest, degreeDay, station, startDate, endDate, stage, ACISData, cumulativeDegreeDays } = this.props.store.app
  console.log(degreeDay.slice(), cumulativeDegreeDays.slice(), mobx.toJS(stage))
  return (
    <section className="hero">
      <div className="hero-body">
        <div className="container has-text-centered">

          {/* HEADER */}

          <div className="columns">
            <div className="column has-text-centered">
              <h1 className="title is-4">
                {pest.informalName} Results for {station.name}
              </h1>
              <h2 className="subtitle is-6">
                Accumulated Degree Days (<strong>{pest.baseTemp}°F</strong>) <strong>{startDate}</strong> through <strong>{endDate.toLocaleDateString()}</strong>: <strong>{cumulativeDegreeDays[cumulativeDegreeDays.length - 1]}</strong> (0 days missing)
              </h2>
            </div>
          </div>

          <br/>

          {/* DATA */}

          <div className="columns">
            <div className="column has-text-centered">
              <table className="table is-bordered is-striped is-narrow">
                <thead className="t-header">
                  <tr>
                    <th></th>
                    <th className="before">Past</th>
                    <th className="before">Past</th>
                    <th className="before">Current</th>
                    <th className="after"></th>
                    <th className="after"></th>
                    <th className="after">Ensuing 5 Days</th>
                    <th className="after"></th>
                    <th className="after"></th>
                  </tr>
                  <tr>
                    <th></th>
                    <th className="before">{moment(ACISData[ACISData.length - 3][0]).format('MMM D')}</th>
                    <th className="before">{moment(ACISData[ACISData.length - 2][0]).format('MMM D')}</th>
                    <th className="before">{moment(ACISData[ACISData.length - 1][0]).format('MMM D')}</th>
                    <th className="after">-</th>
                    <th className="after">-</th>
                    <th className="after">-</th>
                    <th className="after">-</th>
                    <th className="after">-</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Daily Degree Days (Base {pest.baseTemp}BE)</th>
                    <td>{degreeDay[degreeDay.length - 3]}</td>
                    <td>{degreeDay[degreeDay.length - 2]}</td>
                    <td>{degreeDay[degreeDay.length - 1]}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Accumulation since January 1st</th>
                    <td>{cumulativeDegreeDays[cumulativeDegreeDays.length - 3]}</td>
                    <td>{cumulativeDegreeDays[cumulativeDegreeDays.length - 2]}</td>
                    <td>{cumulativeDegreeDays[cumulativeDegreeDays.length - 1]}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DETAILS */}

          <div className="columns">
            <div className="column has-text-centered">
              <span className="select">
                <select
                  onChange={this.setStage}
                  value={stage ? stage.stage : ''}
                >
                  <option>Select a stage</option>
                  {this.getStageList}
                </select>
              </span>
              <p><small>Change the pest stage above and the model will recalculate recommendations.</small></p>
            </div>
          </div>

          <div className="columns">
            <div className="column has-text-centered">
              <table className="table is-bordered is-striped">
                <thead>
                  <tr>
                    <th>Pest Status</th>
                    <th>Pest Management</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{stage ? stage.management : ''}</td>
                    <td>{stage ? stage.status : ''}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>



          {/* DISCLAIMER */}

          <div className="columns">
            <div className="column has-text-centered">
              <p><small><strong>Disclaimer: These are theoretical predictions and forecasts</strong>. The theoretical models predicting pest development or disease risk use the weather data collected (or forecasted) from the weather station location. These results should not be substituted for actual observations of plant growth stage, pest presence, and disease occurrence determined through scouting or insect pheromone traps.</small></p>
            </div>
          </div>

        </div>
      </div>

      {/* IMAGES */}
      <div className="hero-foot">
        <div className="columns">

          <div className="column is-one-third">
            <figure className="image is-64x64 center-image">
              <a href="http://newa.cornell.edu/">
                <img src={newaPic} alt="newa"/>
              </a>
            </figure>

          </div>
          <div className="column is-one-third">
            <figure className="image is-64x64 center-image">
              <a href="http://treefruitipm.info/">
                <img src={pmepPic} alt="pmep"/>
              </a>
            </figure>
          </div>
          <div className="column is-one-third">
            <figure className="image is-64x64 center-image">
              <a href="http://www.rcc-acis.org/">
                <img src={acisPic} alt="acis"/>
              </a>
            </figure>
          </div>

        </div>
      </div>

    </section>
  )
  }
}

export default ResultsView;
