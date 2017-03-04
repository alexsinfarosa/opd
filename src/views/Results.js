import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

//  styled-components
import {MoreInfoWrapper} from '../../src/components/App/styles'

@inject('store')
@observer
export default class Results extends Component {

  render() {
    const {rPest,rState,rStation,rEndDate,rStartDate} = this.props.store.app
    return (
      <MoreInfoWrapper>
        <h3>Results</h3>
        <p>{rPest.informalName}</p>
        <p>{rState.name}</p>
        <p>{rStation.name}</p>
        <p>{rEndDate}</p>
        <p>{rStartDate}</p>
      </MoreInfoWrapper>
    )
  }
}
