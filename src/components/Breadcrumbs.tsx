import React from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

// Componente accesible de breadcrumbs compatible con ProductDetailPage
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  separator = "/",
}) => {
  return (
    <nav aria-label="Breadcrumb" className={"mb-4 " + (className || "")}>
      <ol className="flex items-center space-x-2 text-sm text-slate-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 opacity-60">{separator}</span>}
            {item.href ? (
              <Link to={item.href} className="hover:text-emerald-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};