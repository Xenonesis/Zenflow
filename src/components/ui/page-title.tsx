import React from "react";
import { cn } from "@/lib/utils";
import { Breadcrumb, BreadcrumbHome, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface PageTitleProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageTitle({ 
  title, 
  description, 
  breadcrumbs, 
  actions, 
  className 
}: PageTitleProps) {
  return (
    <div className={cn("mb-6 space-y-2", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="animate-in slide-in-from-top">
          <BreadcrumbList>
            <BreadcrumbHome />
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href={item.href} 
                    active={item.active}
                  >
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm md:text-base">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
} 