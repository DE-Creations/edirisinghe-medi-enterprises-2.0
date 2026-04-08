import React, { forwardRef } from "react";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const isActive = typeof window !== "undefined" && window.location.pathname === href;

    return (
      <Link
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
        ref={ref as never}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
