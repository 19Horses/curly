import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';
import Header from '../components/Header';

const Root = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

function Layout() {
  return (
    <Root>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </Root>
  );
}

export default Layout;
