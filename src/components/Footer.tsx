
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t border-border">
      <div className="app-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="font-semibold text-lg">FairShare</div>
            <div className="text-sm text-muted-foreground">
              A project by VIIT Students - Splitting expenses made simple
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About Us
            </Link>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FairShare
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
