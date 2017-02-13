import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import mobx, {action} from 'mobx';

@inject("store")
@observer
class Graph extends Component {
  render() {
    return <div />;
  }
}

export default Graph;
