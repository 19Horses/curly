import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import { useHomeSplashChrome } from '../../context/HomeSplashChromeContext';
import { useProjectChrome } from '../../hooks/useProjectChrome';
import { Main, Root } from './styles';

const PROJECT_PATH_RE = /^\/projects\/[^/]+/;

function Layout() {
  const { pathname } = useLocation();
  const { suppressSiteHeader } = useHomeSplashChrome();
  const projectChrome = useProjectChrome();
  const projectBleed = PROJECT_PATH_RE.test(pathname);

  useLayoutEffect(() => {
    if (projectChrome) {
      document.body.setAttribute('data-surface', 'project');
    } else {
      document.body.removeAttribute('data-surface');
    }
  }, [projectChrome]);

  return (
    <Root $projectBleed={projectBleed}>
      {!suppressSiteHeader ? <Header /> : null}
      <Main $projectBleed={projectBleed}>
        <Outlet />
      </Main>
    </Root>
  );
}

export default Layout;
