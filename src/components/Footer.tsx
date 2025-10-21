const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Apex Renting Solutions</h3>
          <p className="text-sm font-semibold">bring your next home with confidence</p>
          <p className="text-sm mt-4 opacity-80">
            © {new Date().getFullYear()} Apex Renting Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;