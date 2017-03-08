import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import mobx from 'mobx';

// styled-components
import { Select, Selector } from "./styles";

@inject("store")
@observer
class PestSelector extends Component {
  state = {
    isDisabled: false
  };

  handleChange = e => {
    this.setState({ isDisabled: true });
    this.props.store.app.setPest(e.target.value);
  };

  render() {
    // console.log(toJS(this.props.store.app.pest))
    const { pests } = this.props.store.app;
    const { isDisabled } = this.state;

    const pestList = pests.map(pest => (
      <option key={pest.id} value={pest.informalName}>
        {pest.informalName}
      </option>
    ));

    return (
      <Selector>
        <label>Pest:</label>
        <Select
          name="pest"
          autoFocus
          value={this.props.store.app.pest.informalName}
          onChange={this.handleChange}
        >
          {isDisabled ? null : <option>Select Pest</option>}
          {pestList}
        </Select>
      </Selector>
    );
  }
}

export default PestSelector;
