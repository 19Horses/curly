import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';
import Header from '../components/Header';

const Root = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
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
