import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
// import axios from "axios"

@inject('store') @observer
export default class Test extends Component {

  // async function doIt() {
  //   const x = await Math.random()
  //   const m = x * 10
  //   console.log(m)
  // }

  render() {
    return (
      <div>
        {/* {this.doIt()} */}
      </div>
    )
  }
}
