import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {action, when} from 'mobx';
import axios from 'axios';
import './App.css';

import AppHeader from '../AppHeader'
import SelectionPanel from '../SelectionPanel'
import Home from '../../views/Home'

import DevTools from 'mobx-react-devtools';

@inject('store')
@observer
class AppComponent extends Component {
  constructor(props) {
    super(props)

    when(
      // once...
      () => this.props.store.app.stations.length === 0,
      // ... then
      () => this.fetchStations()
    )
  }

  @action fetchStations = () => {
    axios.get('http://newa.nrcc.cornell.edu/newaUtil/stateStationList/all')
    .then(res => {
      const stations = res.data.stations
      this.props.store.app.stations = stations
      // console.log('Fetch method fired')
      // stations.filter(station => station.state === 'MI').map(station => console.log(station))
    })
    .catch(err => {
      console.log(err)
      this.props.store.app.stations = []
    })
  }

  render() {
    // const {store:{router}} = this.props;
    return (
      <section className='hero is-fullheight'>
        <DevTools />
        <div className='hero-body'>
          <div className='container'>
            <AppHeader />
            <div className='tile is-ancestor'>
              <SelectionPanel />
              <Home />
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default AppComponent;
