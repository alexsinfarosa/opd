import React, {Component} from 'react';
import { action } from 'mobx';
import {inject, observer} from 'mobx-react';
import {states} from '../../utils';
import { Map, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import './theMap.css'

const myIcon = (e) => L.icon({
  iconUrl: e
})

@inject('store') @observer
export default class TheMap extends Component {

  @action onClickSetStation = (e) => {
    const {lat, lng} = e.latlng
    const {stations, state} = this.props.store.app
    const selectedStation = stations.filter(station => (station.lat === lat && station.lon === lng))[0]
    if (selectedStation.state === state.postalCode) {
      this.props.store.app.updateStation(selectedStation)
    } else {
      const selectedStation = stations.filter(station => (station.lat === lat && station.lon === lng))[0]
      const state = states.filter(state => state.postalCode === selectedStation.state)[0]
      alert(`Select ${state.name} from the State menu to access this station.`)
    }
  }

  render() {
    // const position = [this.state.lat, this.state.lng];
    const {filteredStations, state} = this.props.store.app
    const MarkerList = filteredStations.map( station => (
      <Marker
        key={`${station.id} ${station.network}`}
        // network={station.network}
        position={[station.lat,station.lon]}
        // postalCode={station.state}
        icon={myIcon(station.icon)}
        title={station.name}
        onClick={this.onClickSetStation}
        >
      </Marker>
    ))

    return (
      <Map
        ref='map'
        center={Object.keys(state).length === 0 ? [42.9543,-75.5262] : [state.lat,state.lon]}
        zoom={Object.keys(state).length === 0 ? 6 : state.zoom}>
      <TileLayer
        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      {MarkerList}
      </Map>
    )
  }
}
