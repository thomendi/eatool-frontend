
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { GitBranch, Layers, Users, AppWindow, Target, AlertTriangle, TrendingUp, Server, ChartBar } from "lucide-react";

//. Tommy acuerdate del .env

const stats = [
  { icon: GitBranch, label: "Procesos", value: 24, trend: "+12%" },
  { icon: Layers, label: "Capacidades", value: 18, trend: "+8%" },
  { icon: Users, label: "Roles", value: 32, trend: "+5%" },
  { icon: AppWindow, label: "Aplicaciones", value: 45, trend: "+15%" },
  { icon: Target, label: "Objetivos", value: 12, trend: "+3%" },
  { icon: AlertTriangle, label: "Riesgos", value: 8, trend: "-2%" },
  { icon: Server, label: "Infraestructura", value: 28, trend: "+10%" },
  { icon: ChartBar, label: "Datos", value: 28, trend: "+10%" },
];

export const HomePage = () => {


  return (
    <>
      <div className="min-h-screen">
        <CustomPageHeader
        title="Dashboard de Arquitectura Empresarial"
        description="Vista general de todos los componentes de la arquitectura"
      />
       <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-indigo-500" />
                    <span className="text-xs text-indigo-400 font-medium">{stat.trend}</span>
                    <span className="text-xs text-muted-foreground">vs mes anterior</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Nuevo proceso", item: "Gestión de Ventas", time: "Hace 2 horas" },
                  { action: "Actualización", item: "App CRM Principal", time: "Hace 5 horas" },
                  { action: "Nuevo riesgo", item: "Seguridad de Datos", time: "Hace 1 día" },
                  { action: "Nueva capacidad", item: "Análisis de Datos", time: "Hace 2 días" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Resumen de Riesgos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { level: "Crítico", count: 2, color: "bg-destructive" },
                  { level: "Alto", count: 3, color: "bg-orange-500" },
                  { level: "Medio", count: 5, color: "bg-yellow-500" },
                  { level: "Bajo", count: 8, color: "bg-green-500" },
                ].map((risk, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                      <span className="text-sm font-medium text-foreground">{risk.level}</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{risk.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  )
}
