/**
 * Filename: Landing.tsx
 *
 * Desc: Landing page for webapp, start at route '/'
 *
 * Author: Jerry Meng
 *
 * Last Modified: Dec 2025
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { ArrowRight, Sparkles, Shield, Zap, Users, ClipboardList, Leaf, Heart, CreditCard, PiggyBank } from "lucide-react";
import type { ReactNode } from "react";

const Landing = () => {
  const navigate = useNavigate();

  const features: { icon: ReactNode; title: string; subtitle: string; linkText: string }[] = [
    {
      icon: <ClipboardList className="w-8 h-8 text-primary" />,
      title: "Feel organized about my finances",
      subtitle: "Track every dollar with clarity and purpose",
      linkText: "Enjoy Adulthood"
    },
    {
      icon: <Leaf className="w-8 h-8 text-success" />,
      title: "Be less stressed about money",
      subtitle: "Build confidence with a clear financial picture",
      linkText: "Make Change"
    },
    {
      icon: <Heart className="w-8 h-8 text-destructive" />,
      title: "Stop arguing about money with my partner",
      subtitle: "Get on the same page with shared budgets",
      linkText: "Conquer Conflict"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-warning" />,
      title: "Pay off debt and stay out for good",
      subtitle: "Create a plan to become debt-free",
      linkText: "Destroy Debt"
    },
    {
      icon: <PiggyBank className="w-8 h-8 text-primary" />,
      title: "Save more money without feeling restricted",
      subtitle: "Build savings while enjoying life",
      linkText: "Save Yourself"
    },
  ];

  const stats = [
    { value: "3+", label: "Active Users" },
    { value: "$50B+", label: "Money Managed" },
    { value: "4.5★", label: "Rating in My Heart" },
  ];

  return (
    <div className="min-h-screen bg-sidebar relative overflow-hidden" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
      {/* Static background gradient orbs - optimized for performance */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/15 rounded-full blur-2xl" style={{ willChange: 'transform' }} />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-success/15 rounded-full blur-2xl" style={{ willChange: 'transform' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-warning/10 rounded-full blur-2xl" style={{ willChange: 'transform' }} />
      
      {/* Decorative wave shapes */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none">
        <svg
          viewBox="0 0 1440 400"
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 Q360,80 720,200 T1440,180 L1440,400 L0,400 Z"
            className="fill-primary/20"
          />
          <path
            d="M0,280 Q360,160 720,280 T1440,260 L1440,400 L0,400 Z"
            className="fill-success/30"
          />
          <path
            d="M0,340 Q360,280 720,340 T1440,320 L1440,400 L0,400 Z"
            className="fill-background/50"
          />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">BudgetFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sidebar-muted hover:text-sidebar-foreground transition-colors text-sm font-medium">
              Features
            </button>
            <button className="text-sidebar-muted hover:text-sidebar-foreground transition-colors text-sm font-medium">
              Pricing
            </button>
            <Button 
              variant="outline"
              onClick={() => navigate("/app")}
              className="border-sidebar-muted/50 bg-sidebar-accent/30 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-8 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
          {/* Left side - Text content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Smart budgeting made simple</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-sidebar-foreground leading-[1.1] mb-6 tracking-tight">
              Take control of
              <br />
              <span className="bg-gradient-to-r from-primary via-success to-primary bg-clip-text text-transparent">
                your money.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-sidebar-muted mb-8 leading-relaxed max-w-lg">
              Track spending, build budgets, and reach your financial goals with ease. 
              Join millions who've transformed their relationship with money.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <Button 
                size="lg"
                onClick={() => navigate("/app")}
                className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-success-foreground font-semibold px-8 py-7 text-lg rounded-xl shadow-lg shadow-success/30 hover:shadow-xl hover:shadow-success/40 transition-all hover:scale-105 w-full sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-sidebar-muted/50 bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground px-8 py-7 text-lg rounded-xl w-full sm:w-auto"
              >
                Watch Demo (Work in Progress)
              </Button>
            </div>
            
            <p className="text-sm text-sidebar-muted flex items-center justify-center lg:justify-start gap-2">
              <Shield className="w-4 h-4 text-success" />
              Free forever. No credit card required.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 pt-10 border-t border-sidebar-border/50">
              {stats.map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-2xl md:text-3xl font-bold text-sidebar-foreground">{stat.value}</p>
                  <p className="text-sm text-sidebar-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - Phone mockup */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-background/95 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What will you accomplish?
            </h2>
            <p className="text-lg text-muted-foreground">I want to...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {features.map((feature, i) => (
              <FeatureCard 
                key={i}
                icon={feature.icon}
                title={feature.title}
                subtitle={feature.subtitle}
                linkText={feature.linkText}
                delay={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-gradient-to-br from-primary/10 via-background to-success/10 py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to transform your finances?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Start your journey to financial freedom today. It only takes a few minutes to get started.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/app")}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-10 py-7 text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 transition-all"
          >
            Start Budgeting Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-sidebar border-t border-sidebar-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <span className="text-sidebar-foreground font-semibold">BudgetFlow</span>
            </div>
            <p className="text-sidebar-muted text-sm">© 2026 BudgetFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

