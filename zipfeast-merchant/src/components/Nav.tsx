import { cn } from '@/lib/utils'; 
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon, LucideIcon } from 'lucide-react';

import { Link } from 'react-router-dom';

export interface NavItem {
  name?: string;
  route: string;
  // href will override route and should be used for external links and will use a normal anchor tag
  href?: string;
  disabled?: boolean;
  // external?: boolean;
  icon?: LucideIcon;
  // label: string;
  description?: string;
  children?: NavItem[];
}
interface NavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  mobile: boolean;
}

export interface NavItemProps {
  item: NavItem;
  index: number;
  mobile: boolean;
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
  path: string;
  initialOpen?: boolean;
}

export const Nav = ({ items, setOpen, mobile }: NavProps) => {
  // const path = usePathname();
  // const searchParams = useSearchParams();
  // const [hash, setHash] = useHashState();
  // const router = useRouter();

  const [url, setUrl] = useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const updateUrl = (path: string, searchParams: any, hash: string) => {
    // Rest the url
    setUrl(path);

    // Update the url with the search params and hash
    if (hash) {
      setUrl(`${path}#${hash}`);
    }
    const params = new URLSearchParams(searchParams).toString();
    if (params) {
      setUrl(`${path}?${params}`);
    }
  };

  useEffect(() => {
    // updateUrl(path, searchParams, hash);
  }, [url]);

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        return (
          item.route && (
            <MenuNavItem
              key={index}
              item={item}
              index={index}
              mobile={mobile}
              setSidebarOpen={setOpen}
              // initialOpen={// url === item.href ||
              // item.children?.some((child) => child.href === url)}
              path={url}
            />
          )
        );
      })}
    </nav>
  );
};

function MenuNavItem({
  item,
  index,
  mobile,
  setSidebarOpen,
  path,
  initialOpen,
}: NavItemProps) {
  const [open, setOpenState] = useState<boolean>(initialOpen || false);

  const isChildActive = item.children?.some(
    (child: NavItem) =>
      child.href === path ||
      child.href === path.split('#')[0] ||
      child.href === path.split('?')[0]
  );

  useEffect(() => {
    if (isChildActive) {
      setOpenState(true);
    }
  }, [isChildActive]);

  return (
    <>
      <Link
        key={index}
        to={item.disabled ? '#' : item.route}
        onClick={() => {
          // if clicked on a parent item, don't close the sidebar
          if (item.children) {
            return;
          }
          setSidebarOpen && setSidebarOpen(false);
        }}
      >
        <span
          className={cn(
            'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
            item.href === path || isChildActive ? 'bg-accent' : 'transparent',
            item.disabled && 'cursor-not-allowed opacity-80',
            'flex justify-between items-center'
          )}
        >
          <div className="nav-item--left flex">
            {item.icon && (
              <span className="mr-2">
                <item.icon size={18} />
              </span>
            )}
            {/* <span className="hidden md:hidden lg:block" >{item.name}</span> */}
            <span className={mobile ? 'block' : 'hidden md:hidden lg:block'}>
              {item.name}
            </span>
          </div>
          <div className="nav-item--right">
            {item.children && (
              <span
                className="ml-auto"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenState((prev) => !prev);
                }}
              >
                {open ? (
                  <ChevronDownIcon
                    className={cn(
                      'transition-transform transform group-hover:rotate-180',
                      item.children && 'rotate-180'
                    )}
                    size={18}
                  />
                ) : (
                  <ChevronUpIcon
                    className={cn(
                      'transition-transform transform group-hover:rotate-180',
                      item.children && 'rotate-180'
                    )}
                    size={18}
                  />
                )}
              </span>
            )}
          </div>
        </span>
      </Link>

      {open && item.children && (
        <div className="ml-4">
          <Nav items={item.children} setOpen={setSidebarOpen} mobile={mobile} />
        </div>
      )}
    </>
  );
}