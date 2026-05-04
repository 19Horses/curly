import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import styled from 'styled-components';
import { HomeSplashChromeProvider } from './context/HomeSplashChromeContext';
import { router } from './router';

const queryClient = new QueryClient();

/** Re-export for tests that assert splash storage behaviour */
export { HAS_SEEN_SPLASH_STORAGE_KEY } from './constants/splash';

const AppShell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
`;

const App = () => {
  return (
    <AppShell>
      <QueryClientProvider client={queryClient}>
        <HomeSplashChromeProvider>
          <RouterProvider router={router} />
        </HomeSplashChromeProvider>
      </QueryClientProvider>
    </AppShell>
  );
};

export default App;
