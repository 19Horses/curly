import { createHashRouter } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import JobsPage from './pages/JobsPage';
import JobPage from './pages/JobPage';
import ProjectPage from './pages/ProjectPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'contact', element: <Contact /> },
      { path: 'projects/:slug', element: <ProjectPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/:slug', element: <JobPage /> },
    ],
  },
]);
