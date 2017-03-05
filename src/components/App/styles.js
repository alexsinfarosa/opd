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

export const AppWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const ViewWrapper = styled(AppWrapper)`
  justify-content: center;
  align-items: flex-start;
`;

export const ResultsWrapper = styled.div`
  font-family: 'Times New Roman'
`;

export const NavWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

export const Ul = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  border: 1px solid #d49768;
  background: #cb842e;
  border-radius: 5px;
  font-family: Helvetica,Arial,sans-serif;
  color: #3f3731;
`;

export const Header = styled.div`
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 22px;
`;

export const LeftPanel = styled.div`
  border: 1px solid #808080;
  height: 280px;
  flex-basis: 220px;
  margin-right: 10px;
  padding: 10px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 5px;
`

export const RightPanel = styled.div`
  border: 1px solid #E0CFC2;
  background-color: #F4F0EC;
  height: 608px;
  flex: 1;
  padding: 10px;
  border-radius: 5px;

`

export const Images = styled.div`
  display: flex;
  justify-content: space-between;
`
export const Img = styled.img`
  width: 70px;
  height: auto;
`
