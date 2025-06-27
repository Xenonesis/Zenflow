import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.LIHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("text-muted-foreground/50", className)}
    {...props}
  >
    {children || <ChevronRight className="h-3.5 w-3.5" />}
  </span>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <span className="text-muted-foreground">...</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

interface BreadcrumbPageProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  active?: boolean;
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbPageProps>(
  ({ className, href, asChild, active, children, ...props }, ref) => {
    const Comp = asChild ? Slot : Link;

    return (
      <Comp
        to={href}
        ref={ref}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors hover:text-foreground",
          active ? "text-foreground font-medium" : "text-muted-foreground",
          "hover:bg-muted",
          className
        )}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbHome = () => (
  <BreadcrumbItem>
    <BreadcrumbLink href="/">
      <Home className="h-3.5 w-3.5" />
      <span className="sr-only">Home</span>
    </BreadcrumbLink>
  </BreadcrumbItem>
);

BreadcrumbHome.displayName = "BreadcrumbHome";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbHome,
}
