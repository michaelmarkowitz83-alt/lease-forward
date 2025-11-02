import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Shield, Clock, Users, Target, Heart, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const [clientsCount, setClientsCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [clientsResponse, propertiesResponse] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("properties").select("*", { count: "exact", head: true }),
      ]);

      setClientsCount(clientsResponse.count || 0);
      setPropertiesCount(propertiesResponse.count || 0);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const yearsExperience = new Date().getFullYear() - 2014;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary py-24 md:py-32">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-primary-foreground">
            <div className="mb-6 inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm font-semibold">Your Trusted Rental Partner</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight text-right">
              Bring Your Next Home
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              Professional rental solutions that make finding and securing your perfect home effortless. 
              Experience seamless service from search to move-in.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg">
                  Get Started Today
                </Button>
              </Link>
              <a href="#about">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm px-8 py-6 text-lg">
                  Learn More
                </Button>
              </a>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap gap-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{isLoading ? "..." : `${clientsCount}+`} Happy Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{isLoading ? "..." : `${propertiesCount}+`} Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{yearsExperience}+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose Apex?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Properties</h3>
                <p className="text-muted-foreground">
                  Carefully curated rental properties that meet the highest standards
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Process</h3>
                <p className="text-muted-foreground">
                  Your information and transactions are protected every step of the way
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast & Easy</h3>
                <p className="text-muted-foreground">
                  Streamlined process gets you into your new home quickly
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Support</h3>
                <p className="text-muted-foreground">
                  Dedicated team ready to assist you throughout your rental journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About Apex Renting Solutions</h2>
              <p className="text-xl text-muted-foreground">
                Empowering people to find their perfect home with confidence and ease
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Our Purpose</h3>
                  <p className="text-muted-foreground">
                    To simplify the rental process and connect people with homes that truly fit their lives
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Our Values</h3>
                  <p className="text-muted-foreground">
                    Trust, transparency, and exceptional service guide everything we do
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To be the most trusted name in rental solutions, known for innovation and care
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 md:p-12 mb-12">
              <h3 className="text-2xl font-bold mb-4">Who We Are</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Apex Renting Solutions is more than just a rental service – we're your partner in finding the perfect home. 
                With years of experience in the real estate and rental industry, we understand that finding the right place 
                to live is about more than just four walls and a roof.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Our team of dedicated professionals works tirelessly to ensure that every client receives personalized 
                attention and expert guidance throughout their rental journey. We believe in building lasting relationships 
                based on trust, integrity, and exceptional service.
              </p>
              <p className="text-lg text-muted-foreground">
                At Apex, we're committed to making the rental process smooth, transparent, and stress-free. Whether you're 
                looking for your first apartment or upgrading to a larger space, we're here to help you every step of the way.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 text-center bg-primary text-primary-foreground rounded-lg p-8 md:p-12">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {isLoading ? "..." : `${clientsCount}+`}
                </div>
                <div className="text-lg opacity-90">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {isLoading ? "..." : `${propertiesCount}+`}
                </div>
                <div className="text-lg opacity-90">Properties</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{yearsExperience}+</div>
                <div className="text-lg opacity-90">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied clients who found their ideal rental with Apex
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Contact Us Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;