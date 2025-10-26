import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import apexLogo from "@/assets/apex-logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img 
                src={apexLogo} 
                alt="Apex Logo" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground font-medium transition-all duration-200 rounded-lg hover:bg-accent/50"
            >
              Home
            </Link>
            <a 
              href="/#about" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground font-medium transition-all duration-200 rounded-lg hover:bg-accent/50"
            >
              About Us
            </a>
            <Link 
              to="/contact" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground font-medium transition-all duration-200 rounded-lg hover:bg-accent/50"
            >
              Contact
            </Link>
            <Link to="/auth" className="ml-4">
              <Button 
                variant="default" 
                className="bg-secondary hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6"
              >
                Client Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 space-y-2 border-t border-border/40 animate-fade-in">
            <Link
              to="/"
              className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg transition-all font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="/#about"
              className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg transition-all font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
            <Link
              to="/contact"
              className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg transition-all font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block pt-2">
              <Button 
                variant="default" 
                className="w-full bg-secondary hover:bg-secondary/90 shadow-lg font-semibold"
              >
                Client Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;