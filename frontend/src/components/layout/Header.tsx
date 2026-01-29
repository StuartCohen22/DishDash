import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/recipes', label: 'Recipes' },
    { path: '/meal-plans', label: 'Planner' },
    { path: '/shopping-list', label: 'Shopping' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-cookbook-200/60 bg-cookbook-50/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cookbook-900 text-cookbook-50 grid place-items-center text-sm font-bold">
              DD
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-semibold text-cookbook-900">Dish Dash</div>
              <div className="text-xs text-cookbook-500">Recipes &bull; Planner &bull; Shopping</div>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-cookbook-100 text-cookbook-900'
                    : 'text-cookbook-600 hover:text-cookbook-900 hover:bg-cookbook-100/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-cookbook-600">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-cookbook-200/70 bg-cookbook-50 px-3 py-2 text-sm text-cookbook-700 hover:bg-cookbook-100 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-cookbook-600 hover:text-cookbook-900 px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
