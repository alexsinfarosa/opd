import styled from 'styled-components';
import {Link} from 'mobx-router';


const active = (activeStyle) => ({
  default: (defaultStyle) => (props) => {
    const { router, view } = props
    const isCurrent = router.currentView === view

    return isCurrent ? activeStyle : defaultStyle
  }
})

export const StyledLink = styled(Link)`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 250ms ease;
  background: ${
    active('linear-gradient(-42deg, #D264C6 0%, #FB4078 100%)')
    .default('none')
  };
`
