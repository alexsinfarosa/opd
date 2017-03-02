import React, {Component} from 'react';
import { inject, observer } from 'mobx-react';
import { when } from 'mobx';
import {
  BrowserRouter as Router,
  // Route,
  // Link
} from 'react-router-dom';
import axios from 'axios';

// styled-components
import {Page, App, Wrapper, LeftPanel, RightPanel, Header} from './styles';

// Components
import SelectionPanel from '../SelectionPanel/SelectionPanel'


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
  }

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
            <Wrapper>

              <LeftPanel>
                <SelectionPanel />
              </LeftPanel>

              <RightPanel>
                RIGHT
              </RightPanel>

            </Wrapper>
          </App>
        </Page>
      </Router>
    )
  }
}
