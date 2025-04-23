
import Header from '@/components/Header';
import CreateGroup from '@/components/CreateGroup';

const Create = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="app-container">
          <CreateGroup />
        </div>
      </main>
      
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

export default Create;
