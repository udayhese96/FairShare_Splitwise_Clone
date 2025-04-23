import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="app-container space-y-10">
          {/* College Information */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-6 text-center">About FairShare</h1>
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <img 
                src="/lovable-uploads/2a771da7-91d5-4c01-b2cc-7ec1a170ed9f.png" 
                alt="VIIT College Logo" 
                className="h-32 object-contain"
              />
              <div>
                <h2 className="text-2xl font-semibold mb-2">BRACT's Vishwakarma Institute of Information Technology</h2>
                <p className="text-lg mb-2">Subject: Engineering Economics and Fintech</p>
                <p className="text-muted-foreground">Subject Code: IOEUA32205A</p>
              </div>
            </div>
            
            <div className="bg-muted/30 p-6 rounded-lg">
              <p className="mb-4">
                This expense app was developed as a project for the Engineering Economics and Fintech subject. 
                The application helps users to split expenses among group members, track balances, and simplify 
                the process of managing shared expenses.
              </p>
              <p>
                The project aims to demonstrate practical knowledge of fintech applications and economic principles 
                through the development of a useful expense tracking tool that can be used in real-world scenarios.
              </p>
            </div>
          </section>
          
          {/* Faculty Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Faculty Mentor</h2>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img 
                      src="/lovable-uploads/c0821243-b065-482d-9165-2774785197e0.png" 
                      alt="Dr. Disha Wankhede" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h3 className="text-xl font-medium mb-2">Dr. Disha Wankhede</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ph.D.(Computer Sci & Engg, Specialization in Artificial Intelligence in Healthcare) | 
                      ACM Head | Researcher | Mentor | AI | ML | Data Analytics | Python | 
                      Data Science Trainer | Microsoft Power BI
                    </p>
                    <p className="text-base">
                      Dr. Wankhede provided valuable guidance and mentorship throughout the development 
                      of this project, offering insights into both the technical implementation and the 
                      economic principles underlying the application.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Student Team */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Student Team</h2>
            <p className="mb-4 text-muted-foreground">3rd Year Department-Computer Science Engineering (AI)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Uday Hese",
                "Sahil Nagarkar",
                "Aditya Chorghade",
                "Yash Mali"
              ].map((student, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {student.split(' ')[0][0]}{student.split(' ')[1][0]}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg">{student}</h3>
                    <p className="text-sm text-muted-foreground">
                      CSE (AI) - 3rd Year
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
