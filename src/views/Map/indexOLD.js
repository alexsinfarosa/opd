import React, {Component} from 'react';
import { action } from 'mobx';
import {inject, observer} from 'mobx-react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import {states} from '../../utils';

@inject('store') @observer
class MapView extends Component {

  defineMapOptions(maps) {
    return {
      zoomControlOptions: {
        position: maps.ControlPosition.RIGHT_BUTTOM,
        style: maps.ZoomControlStyle.SMALL
      },
      mapTypeControlOptions: {
        position: maps.ControlPosition.TOP_RIGHT
      },
      mapTypeControl: true
    }
  }

  @action onClickSetStation = (e) => {
    const id = e.split(" ")[0]
    const network = e.split(" ")[1]
    const selectedState = e.split(" ")[2]

    const {stations} = this.props.store.app
    const selectedStation = stations.filter(station => (station.id === id && station.network === network))
    if (selectedState === this.props.store.app.state.postalCode) {
      this.props.store.app.station = selectedStation[0]
    } else {
      // console.log(states.filter(state => state.postalCode === selectedState)[0].name)
      const outOfState = states.filter(state => state.postalCode === selectedState)
      alert(`Select ${outOfState[0].name} from the State menu to access this station.`)
    }
  }

  onChildMouseEnter = (key) => {
    this.setState({visible: true})
    console.log(key)
  }

  render() {
    const {filteredStations, state} = this.props.store.app;
    const MarkerList = filteredStations.map( station => (
      <Marker
        key={`${station.id} ${station.network} ${station.state}`}
        network={station.network}
        lat={station.lat}
        lng={station.lon}
        postalCode={station.state}
        src={station.icon}
        alt={station.name}
      />
    ))

    return (
      <div style={{width: '100%', height: '540px'}}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyAftetOMxP8ksyB5AW_CLWvDZG7nKmcIrI',
            language: 'en'
          }}
          onChange={this.onChange}
          onChildClick={this.onClickSetStation}
          onChildMouseEnter={this.onChildMouseEnter}
          center={ state ? [state.lat, state.lon] : {lat: 42.9543, lng: -75.5262}}
          zoom={state ? state.zoom : 6}
          options={this.defineMapOptions}
          hoverDistance={20}>

          {MarkerList}
        </GoogleMapReact>
      </div>
    )
  }
}

export default MapView;
