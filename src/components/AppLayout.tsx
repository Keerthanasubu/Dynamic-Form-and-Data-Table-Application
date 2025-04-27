
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Breadcrumbs } from './Breadcrumbs';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, FileText, FilePlus, BarChart, User, LogOut, Menu, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { authState, logout } = useAuth();
  const { isAuthenticated, user } = authState;

  const navigation = [
    { name: 'Dashboard', to: '/', icon: <Home size={20} /> },
    { name: 'New Record', to: '/new', icon: <FilePlus size={20} /> },
    { name: 'Records', to: '/records', icon: <FileText size={20} /> },
    { name: 'Analytics', to: '/analytics', icon: <BarChart size={20} /> },
  ];

  const userActions = [
    { name: 'Profile', to: '/profile', icon: <User size={20} /> },
    { name: 'Logout', action: logout, icon: <LogOut size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex md:flex-col md:w-72 bg-sidebar text-sidebar-foreground border-r border-border/40 shadow-sm">
        <div className="h-16 px-6 flex items-center border-b border-border/40 bg-sidebar/95 backdrop-blur-sm">
          <Link to="/" className="flex items-center space-x-3 font-medium">
            <Building className="h-7 w-7 text-primary" />
            <span className="font-bold text-lg">Medical Records</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {navigation.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <Link
                  to={item.to}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${pathname === item.to 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm border-l-4 border-primary' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'}`}
                >
                  <span className="mr-3 opacity-70">{item.icon}</span>
                  {item.name}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {item.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <div className="p-4 border-t border-border/40">
          <div className="p-3 rounded-lg bg-sidebar-accent/50 backdrop-blur-sm mb-3 flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary/5">{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <div className="space-y-1">
            {userActions.map((item) => (
              <div key={item.name}>
                {item.to ? (
                  <Link 
                    to={item.to}
                    className="flex items-center w-full px-4 py-2.5 text-sm rounded-lg hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground transition-all duration-200"
                  >
                    <span className="mr-3 opacity-70">{item.icon}</span>
                    {item.name}
                  </Link>
                ) : (
                  <button 
                    onClick={item.action} 
                    className="flex items-center w-full px-4 py-2.5 text-sm rounded-lg hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground transition-all duration-200"
                  >
                    <span className="mr-3 opacity-70">{item.icon}</span>
                    {item.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border/40 flex justify-between items-center bg-sidebar/95 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground font-medium">Theme</p>
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 px-6 flex items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="h-16 px-6 flex items-center border-b border-border/40">
                  <Link to="/" className="flex items-center space-x-3 font-medium">
                    <Building className="h-7 w-7 text-primary" />
                    <span className="font-bold text-lg">Medical Records</span>
                  </Link>
                </div>
                <nav className="flex flex-col p-4 space-y-1.5">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${pathname === item.to 
                          ? 'bg-accent text-accent-foreground shadow-sm' 
                          : 'text-foreground hover:bg-accent/70 hover:text-accent-foreground'}`}
                    >
                      <span className="mr-3 opacity-70">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                  <Separator className="my-3" />
                  {userActions.map((item) => (
                    <div key={item.name}>
                      {item.to ? (
                        <Link 
                          to={item.to}
                          className="flex items-center w-full px-4 py-2.5 text-sm rounded-lg hover:bg-accent/70 hover:text-accent-foreground transition-all duration-200"
                        >
                          <span className="mr-3 opacity-70">{item.icon}</span>
                          {item.name}
                        </Link>
                      ) : (
                        <button 
                          onClick={item.action} 
                          className="flex items-center w-full px-4 py-2.5 text-sm rounded-lg hover:bg-accent/70 hover:text-accent-foreground transition-all duration-200"
                        >
                          <span className="mr-3 opacity-70">{item.icon}</span>
                          {item.name}
                        </button>
                      )}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="md:hidden flex items-center">
              <Building className="h-6 w-6 text-primary" />
              <span className="sr-only">Medical Records</span>
            </Link>

            <div className="hidden md:flex items-center">
              <Breadcrumbs />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background">
          <div className="w-full h-full p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

