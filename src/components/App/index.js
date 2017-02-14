import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {action, when} from 'mobx';
import axios from 'axios';
import views from 'config/views';
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

  getLocalStorage = () => {
    this.props.store.app.state = JSON.parse(localStorage.getItem('state'))
    this.props.store.app.station = JSON.parse(localStorage.getItem('station'))
    this.props.store.app.updateFilteredStations()
    this.props.store.router.goTo(views.map)
  }

  @action fetchStations = () => {
    axios.get('http://newa.nrcc.cornell.edu/newaUtil/stateStationList/all')
    .then(res => {
      const stations = res.data.stations
      this.props.store.app.stations = stations
      if(localStorage.getItem('state' && 'station')) {
        this.getLocalStorage()
      }
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
