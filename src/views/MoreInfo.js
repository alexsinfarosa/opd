import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

//  styled-components
import {ResultsWrapper} from '../../src/components/App/styles'

@inject('store')
@observer
export default class MoreInfo extends Component {

  render() {
    return (
      <ResultsWrapper>
        <h3>Helpfull information</h3>

        <ol>
          <li><a href='https://google.com'>Link 1</a></li>
          <li><a href='https://google.com'>Link 2</a></li>
          <li><a href='https://google.com'>Link 3</a></li>
          <li><a href='https://google.com'>Link 4</a></li>
          <li><a href='https://google.com'>Link 5</a></li>
          <li><a href='https://google.com'>Link 6</a></li>
          <li><a href='https://google.com'>Link 7</a></li>
        </ol>
      </ResultsWrapper>
    )
  }
}
