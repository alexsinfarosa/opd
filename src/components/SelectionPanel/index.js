import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import views from 'config/views';
import { action, observable } from 'mobx'
import axios from "axios"

import PestSelector from './PestSelector';
import StateSelector from './StateSelector';
import StationSelector from './StationSelector';
import DateSelector from './DateSelector';

@inject('store') @observer
class SelectionPanel extends Component {

  @observable temperature = ''
  @observable id = ''

  @action calculateDegreeDays = () => {
    const {ACISData, pest, cumulativeDegreeDays} = this.props.store.app
    const min = ACISData.map(day => Math.min(...day[1]))
    const max = ACISData.map(day => Math.max(...day[1]))
    const avg = min.map((val, i) => (Math.round((val + max[i])/2)))
    const base = pest.baseTemp
    const dd = avg.map(val => {
      if (val-base > 0) {
        return val
      } else {
        return 0
      }
    })
    // Store dd in the store
    this.props.store.app.degreeDay = dd

    // Store cumulativeDegreeDays in the store
    dd.reduce((prev, curr, i) => this.props.store.app.cumulativeDegreeDays[i] = prev + curr, 0)

    // If there are stages chose the one the has a current dd value between ddlo and ddhi
    if (pest.preBiofix.length > 0) {
      const selectedStage = pest.preBiofix.filter(stage => (cumulativeDegreeDays[cumulativeDegreeDays.length - 1] > stage.ddlo && cumulativeDegreeDays[cumulativeDegreeDays.length - 1] < stage.ddhi))
      this.props.store.app.stage = selectedStage[0]
    }
    // console.log(mobx.toJS(this.props.store.app.stage))

  }

  // checkMissingValues = () => {
  //   const { ACISData } = this.props.store.app
  //   const mValues = ACISData.filter(station => station[station.length - 1]).map(value => value === 'M')
  //   console.log(mValues.sclice())
  // }

  @action getACISdata = () => {
    const { station, endDate } = this.props.store.app
    const {router} = this.props.store
    const {store} = this.props

    if (station.network === 'newa' || station.network === 'icao' || station.network === 'njwx') {
      this.temperature = '23'
    } else if (station.network === 'miwx' || station.network === 'cu_log') {
      this.temperature = '126'
    }

    if (station.state === 'MI' && station.network === 'miwx') {
      // example: ew_ITH
      this.id = station.id.slice(3,6)
    } else {
      this.id = station.id
    }

    const params = {
      sid: `${this.id} ${station.network}`,
      sdate: `${endDate.getFullYear()}-01-01`,
      edate: endDate.toISOString().split('T')[0],
      elems: this.temperature
    }

    console.log(params.sid, params.sdate, params.edate, params.elems)
    return axios.post("http://data.test.rcc-acis.org/StnData", params)
      .then(res => {
        this.updateData(res.data.data)
        console.log(res.data.data)
        // this.checkMissingValues()
        this.calculateDegreeDays()
        router.goTo(views.results, {id: 111}, store)
        // console.log(this.props.store.app.ACISData.slice())
      })
      .catch(err => {
        console.log(err)
        this.updateData([])
      })
  }

  @action updateData = (d) => {
    this.props.store.app.ACISData = d
  }

  render() {
    // const {store} = this.props;
    // const {router: {goTo}} = store;
    // console.log(mobx.toJS(this.props.store.app.ACISData))

    return (
      <div className='tile is-parent is-4'>
        <div className='tile is-child box'>
          <PestSelector />
          <br/>
          <StateSelector />
          <br/>
          <StationSelector />
          <br/>
          <DateSelector />
          <br/>
          <button className="button is-primary"
            onClick={this.getACISdata}
            >
              Calculate
          </button>
        </div>
      </div>
    )
  }
}

export default SelectionPanel;
