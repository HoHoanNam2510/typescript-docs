import { NavLink } from 'react-router-dom';

const MODULES = [
  { to: '/', label: '00' },
  { to: '/01-co-ban', label: '01' },
  { to: '/02-kieu-du-lieu', label: '02' },
  { to: '/03-oop', label: '03' },
  { to: '/04-generics', label: '04' },
  { to: '/05-nang-cao', label: '05' },
  { to: '/06-thuc-chien', label: '06' },
];

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
          <rect width="20" height="20" rx="5" fill="#3178c620" />
          <path d="M3 14v-8h5.5v2H5v1.5h3v2H5V14H3z" fill="#5ba4e5" />
          <path
            d="M9.5 6h4c1.1 0 2 .9 2 2v.5c0 .8-.5 1.5-1.2 1.8L15.5 14H13l-1-3.5H12V14h-2.5V6z"
            fill="#5ba4e5"
          />
        </svg>
        TypeScript·<span style={{ color: 'var(--ts-light)' }}>Docs</span>
      </NavLink>
      <div className="nav-links">
        {MODULES.map(m => (
          <NavLink
            key={m.to}
            to={m.to}
            end={m.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {m.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
