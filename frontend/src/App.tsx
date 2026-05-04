import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import styled from 'styled-components';
import { router } from './router';

const queryClient = new QueryClient();


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
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppShell>
  );
};

export default App;
