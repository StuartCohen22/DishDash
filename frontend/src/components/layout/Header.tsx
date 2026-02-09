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
    { path: '/recipes', label: 'Recipes', icon: '📖' },
    { path: '/planner', label: 'Planner', icon: '📅' },
    { path: '/shopping', label: 'Shopping', icon: '🛒' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/60 bg-cream-50/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 text-white grid place-items-center text-sm font-bold shadow-soft-sm group-hover:shadow-glow-coral transition-smooth">
              DD
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-semibold text-espresso-800">Dish Dash</div>
              <div className="text-xs text-espresso-600/70">Recipes &bull; Planner &bull; Shopping</div>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 bg-cream-100/80 rounded-xl p-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-smooth flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-white text-espresso-800 shadow-soft-sm'
                    : 'text-espresso-600 hover:text-espresso-800 hover:bg-white/50'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-espresso-600 font-medium">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border-2 border-cream-200 bg-white px-4 py-2 text-sm font-medium text-espresso-700 hover:bg-cream-100 hover:border-cream-300 transition-smooth press-scale"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-espresso-600 hover:text-espresso-800 px-4 py-2 transition-smooth"
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
