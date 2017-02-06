import React, { Component } from 'react'

export default class Marker extends Component {
  render () {
    const {name, src} = this.props
    return (
      <a>
        <img
          src={src}
          alt={name}
         />
      </a>
    )
  }
}
