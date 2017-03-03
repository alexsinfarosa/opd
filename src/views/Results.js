import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

//  styled-components
import {ViewWrapper} from '../../src/components/App/styles'

@inject('store')
@observer
export default class Results extends Component {

  render() {
    return (
      <ViewWrapper>
        <h3>Results</h3>
      </ViewWrapper>
    )
  }
}
