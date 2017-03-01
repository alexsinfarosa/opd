import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action, when } from 'mobx';
import axios from 'axios';
import views from 'config/views';
import { Link } from 'mobx-router';
import { MobxRouter } from 'mobx-router';

// style
import './App.css';

// components
import AppHeader from '../AppHeader/AppHeader';
import SelectionPanel from '../SelectionPanel/SelectionPanel';
import Test from '../../components/SelectionPanel/Test'

// devTools
import DevTools from 'mobx-react-devtools';

@inject('store')
@observer
class AppComponent extends Component {
  constructor(props) {
    super(props);

    when(
      // once...
      () => this.props.store.app.stations.length === 0,
      // ... then
      () => this.fetchStations()
    );
  }

  getLocalStorage = () => {
    this.props.store.app.state = JSON.parse(localStorage.getItem('state'));
    this.props.store.app.station = JSON.parse(localStorage.getItem('station'));
    this.props.store.app.pest = JSON.parse(localStorage.getItem('pest')); // TESTING...
    this.props.store.app.updateFilteredStations();
    this.props.store.router.goTo(views.map);
  };

  @action fetchStations = () => {
    axios
      .get('http://newa.nrcc.cornell.edu/newaUtil/stateStationList/all')
      .then(res => {
        const stations = res.data.stations;
        this.props.store.app.stations = stations;
        if (localStorage.getItem('state' && 'station')) {
          this.getLocalStorage();
        }
      })
      .catch(err => {
        console.log(err);
        this.props.store.app.stations = [];
      });
  };

  render() {
    const { store } = this.props;
    const { path } = this.props.store.app;
    // const {store:{router}} = this.props;
    return (
      <section className="hero is-fullheight">
        <DevTools />
        <div className="hero-body">
          <div className="container">

            {/* FOR TESTING ONLY */}
            <Test />

            {/* HEADER */}
            <div className="columns">
              <div className="column">
                <AppHeader />
              </div>
            </div>

            {/* BODY */}
            <div className="columns">
              {/* LEFT */}
              <div className="column is-one-third">
                <SelectionPanel />
              </div>
              {/* RIGHT */}
              <div className="column">

                <div className="box hasFixedHeight">

                  {/* NAVIGATION */}
                  <div className="tabs is-boxed">
                    <ul>
                      <li className={path === '/map' ? 'is-active' : null}>
                        <Link view={views.map} store={store}>
                          <span>Map</span>
                        </Link>
                      </li>
                      <li className={path === '/results' ? 'is-active' : null}>
                        <Link view={views.results} store={store}>
                          <span>Results</span>
                        </Link>
                      </li>
                      <li className={path === '/moreinfo' ? 'is-active' : null}>
                        <Link view={views.moreinfo} store={store}>
                          <span>More Info</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* VIEWS */}
                  <MobxRouter />

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }
}

export default AppComponent;
