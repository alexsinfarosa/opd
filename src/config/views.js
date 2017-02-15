import React from 'react'
import {Route} from 'mobx-router'

// components
import Home from '../views/Home/Home'
import TheMap from '../views/Map/TheMap'
import Results from '../views/Results/Results'
import MoreInfo from '../views/MoreInfo/MoreInfo.js'

const views = {
  home: new Route({
    id: 'home',
    path: '/',
    component: <Home />
  }),
  map: new Route({
    id: 'map',
    path: '/map',
    component: <TheMap />
  }),
  results: new Route({
    id: 'results',
    path: '/results',
    component: <Results />,
    beforeEnter: (route, param, store) => {
      const {pest, state, station} = store.app
      const isPest = Object.keys(pest).length === 0
      const isState = Object.keys(state).length === 0
      const isStation = Object.keys(station).length === 0

      if (isPest || isState || isStation) {
        alert(`Please make sure all fields on the left panel are selected`)
        return false
      }
    }
  }),
  moreinfo: new Route({
    id: 'moreinfo',
    path: '/moreinfo',
    component: <MoreInfo />
  })
}

export default views
