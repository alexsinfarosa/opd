import styled from 'styled-components';
// import flex from '../../styles/flex';

export const Page = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  ${''/* background-color: lightgreen; */}
`;

export const App = styled.div`
  width: 910px;
  height: 680px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  padding: 20px;
  ${''/* background-color: pink; */}
`;

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  ${''/* background-color: yellow; */}
`;

export const Wrapper2 = styled.div`
    max-width: 960px;
    margin: auto;
    width: 100%;
    padding: 0 30px;
`;

export const Header = styled.div`
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 22px;
`;

export const LeftPanel = styled.div`
  border: 1px solid #808080;
  height: 280px;
  ${''/* display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch; */}
  flex-basis: 220px;
  margin-right: 10px;
  padding: 10px;
  font-size: 15px;
  font-weight: 500;
`

export const RightPanel = styled.div`
  border: 1px solid #eee;
  height: 608px;
  flex: 1;
  padding: 10px;

`
