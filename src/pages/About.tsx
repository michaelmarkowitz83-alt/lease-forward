import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Apex Renting Solutions</h1>
              <p className="text-xl opacity-90">
                Empowering people to find their perfect home with confidence and ease
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Mission</h2>
              
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

              <div className="bg-muted rounded-lg p-8 md:p-12">
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
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <div className="text-lg opacity-90">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-lg opacity-90">Properties</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
                <div className="text-lg opacity-90">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;