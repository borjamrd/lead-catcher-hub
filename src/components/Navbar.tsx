
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Note: This is a placeholder. We'll implement real auth state later
  const isAuthenticated = false;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl">OpositaPlace</span>
          </Link>
          
          <Link
            to="/inicia-sesion"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isAuthenticated ? "Cierra sesión" : "Inicia sesión"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
