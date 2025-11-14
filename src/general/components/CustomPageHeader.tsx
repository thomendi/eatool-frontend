import type { ReactNode } from "react";



interface CustomPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const CustomPageHeader =  (({ title, description, action }: CustomPageHeaderProps) => {
  return (
    <div className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  
  );
});
