import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// Images
import newaPic from './images/newa_logo.jpg';
import acisPic from './images/PoweredbyACIS_NRCC.jpg';

// Components
import ResultsHeader from './ResultsHeader';
import ResultsTable from './ResultsTable';
// import ResultsStage from './ResultsStage';

// style
// import './results.css';

//  styled-components
import {ResultsWrapper, Images, Img} from '../../components/App/styles'

@inject('store')
@observer
export default class Results extends Component {
  render() {
    return (
      <ResultsWrapper>

        {/* HEADER */}
        <ResultsHeader />

        <br />

        {/* DATA */}
        <ResultsTable />

        {/* DETAILS STAGE */}
        {/* <ResultsStage /> */}

        <br />

        {/* DISCLAIMER */}
        <div>
            <p>
              <small>
                <strong>
                  Disclaimer: These are theoretical predictions and forecasts
                </strong>
                . The theoretical models predicting pest development or disease risk use the weather data collected (or forecasted) from the weather station location. These results should not be substituted for actual observations of plant growth stage, pest presence, and disease occurrence determined through scouting or insect pheromone traps.
              </small>
            </p>
        </div>

        {/* IMAGES */}
        <Images>
          <figure>
            <a href="http://newa.cornell.edu/">
              <Img src={newaPic} alt="newa" />
            </a>
          </figure>
          <figure>
            <a href="http://www.rcc-acis.org/">
              <Img src={acisPic} alt="acis" />
            </a>
          </figure>
        </Images>

      </ResultsWrapper>
    );
  }
}
