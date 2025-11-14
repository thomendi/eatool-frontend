import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  GitBranch, 
  Layers, 
  Users, 
  AppWindow, 
  Target, 
  AlertTriangle, 
  Server, 
  CombineIcon
} from "lucide-react";
import { cn } from "@/lib/utils";



const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: GitBranch, label: "Procesos", path: "/process" },
  { icon: Layers, label: "Capacidades", path: "/capacidades" },
  { icon: Users, label: "Roles y Funciones", path: "/roles" },
  { icon: AppWindow, label: "Aplicaciones", path: "/aplicaciones" },
  { icon: Target, label: "Objetivos", path: "/objetivos" },
  { icon: AlertTriangle, label: "Riesgos", path: "/riesgos" },
  { icon: Server, label: "Infraestructura", path: "/infraestructura" },
  { icon: CombineIcon, label: "Modelos", path: "/models" },
];


export const Sidebar = () => {
const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border shadow-lg">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-blue-500 bg-clip-text text-transparent">
         SCI EA Manager
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Arquitectura Empresarial</p>
      </div>        
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-indigo-800 text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
