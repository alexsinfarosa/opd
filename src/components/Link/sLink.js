import React from 'react'
import {
  Route,
  Link,
} from 'react-router-dom';

import './sLink.css';

export const sLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <li className={match ? 'active' : ''}>
      <Link className="sLink" to={to}>{label}</Link>
    </li>
  )}/>
)
