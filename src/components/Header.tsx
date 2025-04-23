
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-subtle" 
          : "bg-transparent"
      )}
    >
      <div className="app-container flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] duration-200"
        >
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            FairShare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/groups">My Groups</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <Button asChild size="sm" className="ml-2 button-transition">
            <Link to="/create">Create Group</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="flex md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-subtle animate-fade-in">
          <nav className="flex flex-col gap-4">
            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/groups" onClick={() => setMobileMenuOpen(false)}>My Groups</MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</MobileNavLink>
            <Button asChild size="sm" className="mt-2 w-full button-transition">
              <Link to="/create" onClick={() => setMobileMenuOpen(false)}>Create Group</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <Link 
      to={to} 
      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string, children: React.ReactNode, onClick?: () => void }) {
  return (
    <Link 
      to={to} 
      className="py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default Header;
