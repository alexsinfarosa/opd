import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

//  styled-components
import {ResultsWrapper} from '../../src/components/App/styles'

import '../index.css'

@inject('store')
@observer
export default class MoreInfo extends Component {

  render() {
    return (
      <ResultsWrapper>
        <h3>Helpfull information</h3>

        <ol>
          <li><a className="more-info" href='https://google.com' target="_blank">Link 1</a></li>
          <li><a className="more-info" href='https://google.com' target="_blank">Link 2</a></li>
          <li><a className="more-info" href='https://google.com' target="_blank">Link 3</a></li>
          <li><a className="more-info" href='https://google.com' target="_blank">Link 4</a></li>
          <li><a className="more-info" href='https://google.com' target="_blank">Link 5</a></li>
          <li><a className="more-info" href='https://google.com' target="_blank">Link 6</a></li>
          <li><a className="more-info" href='https://google.com' target="_blank">Link 7</a></li>
        </ol>
      </ResultsWrapper>
    )
  }
}
