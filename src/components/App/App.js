import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import { when } from 'mobx';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import axios from 'axios';

// styled
import './app.css'

// styled-components
import {Page, App, AppWrapper, LeftPanel, RightPanel, Header, NavWrapper, Ul} from './styles';

// Components
import SelectionPanel from '../SelectionPanel/SelectionPanel'
import Home from '../../views/Home'
import TheMap from '../../views/TheMap'
import Results from '../../views/Results/Results'
import MoreInfo from '../../views/MoreInfo'

@inject('store')
@observer
export default class AppComponent extends Component {
  constructor(props) {
    super(props);

    when(
      // once...
      () => this.props.store.app.stations.length === 0,
      // ... then
      () => this.fetchAllStations()
    );
  };

  fetchAllStations = () => {
    axios
      .get('http://newa.nrcc.cornell.edu/newaUtil/stateStationList/all')
      .then(res => {
        this.props.store.app.setStations(res.data.stations);
      })
      .catch(err => {
        console.log(err);
        this.props.store.app.setStations([]);
      });
  };

  render() {
    return (
      <Router>
        <Page>
          <App>
            <Header>NEWA Apple Insect Models</Header>
            <AppWrapper>

              <LeftPanel>
                <SelectionPanel />
              </LeftPanel>

              <RightPanel>
                <NavWrapper>
                  <Ul>
                    <li><Link to="/map">Map</Link></li>
                    <li><Link to="/results">Results</Link></li>
                    <li><Link to="/moreinfo">More Info</Link></li>
                  </Ul>
                </NavWrapper>

                <br/>

                <Route exact path="/" component={Home}/>
                <Route path="/map" component={TheMap}/>
                <Route path="/results" component={Results}/>
                <Route path="/moreinfo" component={MoreInfo}/>

              </RightPanel>

            </AppWrapper>
          </App>
        </Page>
      </Router>
    )
  }
}
