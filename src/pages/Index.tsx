import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { ArrowRight, Check, DollarSign, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="app-container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-2 animate-fade-in">
              Simple Expense Splitting
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance animate-slide-in">
              Split expenses with friends, <span className="text-primary">without the drama</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance animate-slide-in" style={{ animationDelay: '0.1s' }}>
              The simplest way to share costs with friends and family. Create a group, add expenses, and let us do the math.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <Button asChild size="lg" className="button-transition">
                <Link to="/create">
                  Create a Group
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="button-transition">
                <Link to="/groups">
                  My Groups
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="app-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              HissabBarabar makes it easy to manage shared expenses without the confusion or awkward money conversations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-background shadow-subtle animate-scale-in"
                style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
        <div className="app-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <h2 className="text-3xl font-bold">Why Use FairShare?</h2>
              <p className="text-muted-foreground text-lg">
                Our platform makes expense management with groups simple and transparent.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li 
                    key={benefit} 
                    className="flex items-start gap-3 animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mt-1 flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button asChild className="mt-4 button-transition">
                <Link to="/create">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="order-1 lg:order-2 glass-panel rounded-2xl p-8 animate-scale-in">
              {/* Styled mockup of the app */}
              <div className="w-full aspect-[4/3] bg-background rounded-lg shadow-subtle overflow-hidden border border-border/60">
                <div className="h-12 border-b border-border/60 bg-muted/30 flex items-center px-4">
                  <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                </div>
                <div className="p-4">
                  <div className="text-xl font-medium mb-4 text-left">Weekend Trip to Barcelona</div>
                  <div className="space-y-3">
                    {mockExpenses.map((expense, index) => (
                      <div 
                        key={index} 
                        className="py-2 px-3 bg-secondary/50 rounded border border-border/40 flex justify-between items-center text-sm"
                      >
                        <div>
                          <div className="font-medium">{expense.title}</div>
                          <div className="text-xs text-muted-foreground">Paid by {expense.paidBy}</div>
                        </div>
                        <div className="font-medium">₹{expense.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="app-container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to split expenses fairly?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create your first group now and experience how easy it is to manage shared expenses without the hassle.
            </p>
            <Button asChild size="lg" className="button-transition">
              <Link to="/create">
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border">
        <div className="app-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="font-semibold text-lg">FairShare</div>
              <div className="text-sm text-muted-foreground">Splitting expenses made simple</div>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FairShare. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: 'Create a Group',
    description: 'Set up a group for your trip, roommates, or any shared expense situation in seconds.',
    icon: Users
  },
  {
    title: 'Add Expenses',
    description: 'Record who paid for what. Split costs equally or specify custom amounts for each person.',
    icon: DollarSign
  },
  {
    title: 'Settle Up',
    description: 'See who owes what to whom, with the fewest possible transactions to settle all debts.',
    icon: Check
  }
];

const benefits = [
  'No sign-up required - just create a group and share the link',
  'Simplified expense tracking for trips, events, and everyday costs',
  'Automatic calculations to minimize the number of transactions needed',
  'Works on all devices with a clean, responsive interface',
  'Completely free to use with no hidden fees'
];

const mockExpenses = [
  { title: 'Airbnb (3 nights)', amount: 450, paidBy: 'Alex' },
  { title: 'Dinner at La Tapería', amount: 120, paidBy: 'Jordan' },
  { title: 'Museum tickets', amount: 60, paidBy: 'Taylor' },
  { title: 'Taxi from airport', amount: 35, paidBy: 'Alex' }
];

export default Index;
