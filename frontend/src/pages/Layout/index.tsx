import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import { useHomeSplashChrome } from '../../context/HomeSplashChromeContext';
import { Main, Root } from './styles';

function Layout() {
  const { suppressSiteHeader } = useHomeSplashChrome();

  return (
    <Root>
      {!suppressSiteHeader ? <Header /> : null}
      <Main>
        <Outlet />
      </Main>
    </Root>
  );
}

export default Layout;
