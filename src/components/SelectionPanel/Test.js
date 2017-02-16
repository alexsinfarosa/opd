import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import axios from "axios"

@inject('store') @observer
export default class Test extends Component {

  requestSisterStationAndReplaceMultipleMValues = () => {
    axios.get(`http://newa.nrcc.cornell.edu/newaUtil/stationSisterInfo/kbdr/icao`)
    .then(res => {

      console.log('inside sister')
      const idAndNetwork = res.data.temp.split(' ')
      return idAndNetwork
    })
    .then(res => {

      const params = {
        sid: `${res[0]} ${res[1]}`,
        sdate: "2016-01-01",
        edate: "2016-01-03",
        elems: "23"
      }

      console.log(`POST request: sid: ${params.sid}, sdate: ${params.sdate}, edate: ${params.edate}, elems: ${params.elems}`)

      // Axios
      axios.post("http://data.test.rcc-acis.org/StnData", params)
        .then(res => {
          console.log('inside getACISdata2')
          const data = res
          if(!res.data.hasOwnProperty('error')) {
            console.info(data)
          } else {
            console.log(res.data.error)
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div>
        {this.requestSisterStationAndReplaceMultipleMValues()}
      </div>
    )
  }
}
