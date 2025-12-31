import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Shield, Clock, Users, Target, Heart, TrendingUp, ArrowRight } from "lucide-react";
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 md:py-32 lg:py-40">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg-v2.png"
            alt="Luxury Apartment"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80 mix-blend-multiply"></div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="text-sm font-medium tracking-wide uppercase">Premium Rental Solutions</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                Living Experience
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Discover a curated collection of premium properties. We bridge the gap between luxury and comfort, ensuring your next move is your best move.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white shadow-xl hover:shadow-2xl transition-all px-10 py-7 text-lg rounded-full group">
                  Find Your Home
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#about">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm px-10 py-7 text-lg rounded-full">
                  Our Philosophy
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Floating */}
      <section className="relative z-20 -mt-16 container mx-auto px-4">
        <div className="bg-white dark:bg-card shadow-2xl rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 border border-border/50">
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">
              {isLoading ? "..." : `${clientsCount}+`}
            </div>
            <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Satisfied Clients</div>
          </div>
          <div className="text-center space-y-2 md:border-l md:border-r border-border/50">
            <div className="text-4xl md:text-5xl font-bold text-primary">
              {isLoading ? "..." : `${propertiesCount}+`}
            </div>
            <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Premium Properties</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">{yearsExperience}+</div>
            <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Years of Excellence</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              The Apex Standard
            </h2>
            <p className="text-lg text-muted-foreground">
              We don't just rent properties; we curate lifestyles. Experience the difference of working with a team dedicated to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Home, title: "Curated Portfolio", desc: "Access to exclusive, high-quality listings not found elsewhere." },
              { icon: Shield, title: "Secure & Private", desc: "Your data and privacy are paramount in every transaction." },
              { icon: Clock, title: "Effortless Process", desc: "Digital-first approach for swift approvals and move-ins." },
              { icon: Users, title: "Concierge Support", desc: "Dedicated agents available to assist you 24/7." }
            ].map((feature, idx) => (
              <Card key={idx} className="group border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="bg-primary/5 group-hover:bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                More Than Just <br />
                <span className="text-primary">Property Management</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Apex Renting Solutions was founded on a simple premise: renting should be a dignified, transparent, and enjoyable experience. We've reimagined the traditional model to put people first.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Target, title: "Our Purpose", desc: "Simplifying complex processes into seamless experiences." },
                  { icon: Heart, title: "Our Values", desc: "Built on a foundation of integrity, trust, and respect." },
                  { icon: TrendingUp, title: "Our Vision", desc: "Setting new benchmarks for the rental industry." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 bg-white dark:bg-card p-2 rounded-lg shadow-sm h-fit">
                      <item.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl transform rotate-3 scale-105 blur-lg"></div>
              <div className="relative bg-card border border-border p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Why We Lead</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "At Apex, we believe that your home is your sanctuary. That's why we go above and beyond to ensure that every property in our portfolio meets our rigorous standards for quality, safety, and comfort."
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div>
                    <div className="font-bold text-foreground">The Apex Team</div>
                    <div className="text-sm text-muted-foreground">Dedicated to your comfort</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white tracking-tight">
            Ready to Elevate Your Lifestyle?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join the thousands of satisfied residents who have found their perfect home with Apex Renting Solutions.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white shadow-xl hover:shadow-2xl transition-all px-12 py-8 text-xl rounded-full">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Landing;