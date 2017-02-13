import React from 'react'
import {Route} from 'mobx-router'

// components
import Map from 'views/Map'
import Results from 'views/Results'
import MoreInfo from 'views/MoreInfo'

const views = {
  map: new Route({
    id: 'map',
    path: '/map',
    component: <Map />,
    beforeEnter: (route, params, store) => {
      store.app.updatePath(route.path)
    }
  }),
  results: new Route({
    id: 'results',
    path: '/results',
    component: <Results />,
    beforeEnter: (route, param, store) => {
      const {pest, state, station} = store.app
      store.app.updatePath(route.path)
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
    component: <MoreInfo />,
    beforeEnter: (route, params, store) => {
      store.app.updatePath(route.path)
    }
  })
}

export default views
