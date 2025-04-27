
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = () => {
  const location = useLocation();
  
  const getPathItems = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    let breadcrumbs = [];
    let path = '';
    
    breadcrumbs.push({
      name: 'Dashboard',
      path: '/'
    });
    
    pathnames.forEach(segment => {
      path += `/${segment}`;
      
      const customNames: Record<string, string> = {
        'new': 'New Record'
      };
      
      const name = customNames[segment] || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        name,
        path
      });
    });
    
    return breadcrumbs;
  };
  
  const items = getPathItems();
  
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <nav aria-label="Breadcrumbs" className="ml-6">
      <ol className="flex items-center text-sm font-medium">  {/* Added font-medium */}
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
            {index === items.length - 1 ? (
              <span className="font-semibold text-foreground" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                to={item.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
