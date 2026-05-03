import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/jobs">Jobs</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
