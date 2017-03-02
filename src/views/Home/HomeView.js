import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

//styled-components
import {Page} from '../../styles/styled-components/page-styled-components'
import {App, Home, DropDown, LeftPanel, RightPanel, Header} from './styles';

@inject('store')
@observer
class HomeView extends Component {

  render() {

    return (
      <Page>
        <App>
          <Header>NEWA Degree Day Calculator</Header>
          <Home>
            <LeftPanel>
              <label>Pest:</label>
              <DropDown name="Pests">
                <option value="">sdfsdfsfdsdsfdsfsdfsdffsdfsdfsdfsdfsdffsdfsdf</option>
                <option value="1">sdf</option>
                <option value="1">sdfsdfsdfsdfsdf</option>
              </DropDown>
            </LeftPanel>
            <RightPanel>
              RIGHT
            </RightPanel>
          </Home>
        </App>
      </Page>
    )
  }
}

export default HomeView;
