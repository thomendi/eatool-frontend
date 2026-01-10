import { useAuth } from "@/auth/hooks/useAuth";
import { Button } from "@/general/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router";

export const Header = () => {
    const { email, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    return (
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-6">
                {/* Placeholder for left side content if needed, e.g., Breadcrumbs */}
            </div>

            <div className="flex items-center gap-4">
                <Link to="/admin">
                    <Button variant="ghost" className="gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Administración</span>
                    </Button>
                </Link>

                <div className="h-6 w-px bg-border mx-2" />

                <div className="flex items-center gap-3">
                    <div className="text-sm text-right hidden md:block">
                        <p className="font-medium leading-none">{email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{role || 'Usuario'}</p>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        title="Cerrar Sesión"
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
};
