import { useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import { PersistedCaseStudyMuxPlayer } from '../../components/PersistedCaseStudyMuxPlayer';
import { useProjectChrome } from '../../hooks/useProjectChrome';
import { Main, Root } from './styles';

function Layout() {
  const projectChrome = useProjectChrome();

  useLayoutEffect(() => {
    if (projectChrome) {
      document.body.setAttribute('data-surface', 'project');
    } else {
      document.body.removeAttribute('data-surface');
    }
  }, [projectChrome]);

  return (
    <Root>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <PersistedCaseStudyMuxPlayer />
    </Root>
  );
}

export default Layout;
