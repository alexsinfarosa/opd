import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

@inject('store') @observer
export default class MoreInfo extends Component {

  render() {
    return (
    <section className='hero'>
      <div className='hero-body'>
        <div className='container has-text-centered'>

          <div className='columns'>
            <div className='column is-12'>
              <h1 className='title is-4'>Helpfull information</h1>
            </div>
          </div>

          <br/>

          <div className='columns'>
            <div className='column is-2 is-offset-5'>
              <aside className='menu'>
                <ol className='menu-list'>
                  <li><a href='https://google.com'>Link 1</a></li>
                  <li><a href='https://google.com'>Link 2</a></li>
                  <li><a href='https://google.com'>Link 3</a></li>
                  <li><a href='https://google.com'>Link 4</a></li>
                  <li><a href='https://google.com'>Link 5</a></li>
                  <li><a href='https://google.com'>Link 6</a></li>
                  <li><a href='https://google.com'>Link 7</a></li>
                  <li><a href='https://google.com'>Link 8</a></li>
                </ol>
              </aside>
            </div>

          </div>
        </div>
      </div>
    </section>
    )
  }
}
