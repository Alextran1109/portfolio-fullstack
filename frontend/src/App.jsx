import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import Projects from './pages/Projects';
import Services from './pages/Services';
import References from './pages/References';

export default function App() {
  return (
    <>
      <header className="app-header">
        <div>Portfolio Admin</div>
        <nav>
          <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
            Users
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
            Projects
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>
            Services
          </NavLink>
          <NavLink to="/references" className={({ isActive }) => (isActive ? 'active' : '')}>
            References
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/references" element={<References />} />
        </Routes>
      </main>
    </>
  );
}
