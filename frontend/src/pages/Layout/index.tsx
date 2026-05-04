import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import { Main, Root } from './styles';

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
