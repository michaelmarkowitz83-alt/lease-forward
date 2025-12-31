import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">APEX RENTING</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
              Elevating the rental experience with professional solutions and premium service.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Services</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link to="/property-management" className="hover:text-white transition-colors">Property Management</Link></li>
              <li><Link to="/tenant-screening" className="hover:text-white transition-colors">Tenant Screening</Link></li>
              <li><Link to="/maintenance" className="hover:text-white transition-colors">Maintenance</Link></li>
              <li><Link to="/consulting" className="hover:text-white transition-colors">Consulting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Apex Renting Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;