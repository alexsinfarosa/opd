import React from 'react'
import {Route, Link} from 'mobx-router'

const ActiveLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <li className={match ? 'is-active' : ''}>
      <Link to={to}>{label}</Link>
    </li>
  )}/>
)

export default ActiveLink;
