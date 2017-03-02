import styled from 'styled-components';
import flex from '../../styles/flex';
import {Page} from '../../styles/styled-components/page-styled-components';

export const App = styled.div`
  width: 914px;
  height: 680px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  padding: 20px;
  background-color: pink;
`;

export const Home = styled.div`
  display: flex;
  width: 100%;
`;

export const Header = styled.div`
  margin-bottom: 15px;
  font-weight: 400;
  font-size: 22px;
`;

export const Rocket = styled.div`
  font-size: 15px;
`;

export const LeftPanel = styled.div`
  border: 1px solid #eee;
  height: 400px;
  ${''/* flex: 1; */}
  flex-basis: 210px;
  margin-right: 10px;
  padding: 10px;
`

export const RightPanel = styled.div`
  border: 1px solid #eee;
  height: 600px;
  flex: 1;
  padding: 10px;

`

export const DropDown = styled.select`
  width: 100%;
`
