import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'mobx-router';
import views from '../../config/views';
import {MobxRouter} from 'mobx-router';
import './styles.css'
// import {StyledLink} from './styles'

@inject('store') @observer
class HomeView extends Component {
  render() {
    const {store} = this.props;
    // const {store:{router}} = this.props;
    return (
      <div className='tile is-parent'>
        <div className='tile is-child box'>

          {/* NAVIGATION */}

          <div className="tabs is-boxed">
            <ul>
              {/* TODO: Style the Links */}
              <li>
                <Link view={views.map} store={store}>
                  <span>Map</span>
                </Link>
              </li>
              <li>
                <Link view={views.results} store={store}>
                  <span>Results</span>
                </Link>
              </li>
              <li>
                <Link view={views.moreinfo} store={store}>
                  <span>More Info</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* VIEWS */}

          <MobxRouter />
          {/* {router.currentView && router.currentView.component} */}

        </div>
      </div>
    )
  }
}
export default HomeView;
