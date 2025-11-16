import { MetricCard } from "@/general/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/general/components/ui/badge";
import { CustomPageHeader } from "@/general/components/CustomPageHeader";
import { 
  Database, 
  Layers,
  Box,
  GitBranch,
  User
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/general/components/ui/table";

export const DataPage = () => {
  return (
    <div className="min-h-screen">
          <CustomPageHeader
            title="Gestión de Datos"
            description="Cátalogo, calidad y gorbenanza de datos empresariales"
    
      />

      <div className="container mx-auto px-6 py-8">
        <div className="hover:shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Dominios de Datos" 
              value={8} 
              change="2 nuevos este mes" 
              icon={Layers} 
            />
            <MetricCard 
              title="Entidades" 
              value={156} 
              change="+12 vs mes anterior" 
              icon={Box} 
            />
            <MetricCard 
              title="Atributos" 
              value={1247} 
              change="+89 vs mes anterior" 
              icon={GitBranch} 
            />
            <MetricCard 
              title="Bases de Datos" 
              value={12} 
              change="Todas documentadas" 
              icon={Database} 
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Modelo Conceptual - Dominios de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Entidades</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DOM-001</TableCell>
                    <TableCell className="font-medium">Clientes</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Información de clientes y prospectos</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">María García</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DOM-002</TableCell>
                    <TableCell className="font-medium">Productos</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Catálogo de productos y servicios</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Juan Pérez</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">8</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DOM-003</TableCell>
                    <TableCell className="font-medium">Transacciones</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Operaciones comerciales y financieras</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Carlos Ruiz</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">15</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DOM-004</TableCell>
                    <TableCell className="font-medium">Empleados</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Recursos humanos y nómina</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Ana López</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DOM-005</TableCell>
                    <TableCell className="font-medium">Inventario</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Stocks y almacenes</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Laura Martín</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">7</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Modelo Lógico - Entidades</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Dominio</TableHead>
                      <TableHead className="text-right">Atributos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ENT-001</TableCell>
                      <TableCell className="font-medium">Cliente</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Clientes</Badge>
                      </TableCell>
                      <TableCell className="text-right">18</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ENT-002</TableCell>
                      <TableCell className="font-medium">Pedido</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Transacciones</Badge>
                      </TableCell>
                      <TableCell className="text-right">24</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ENT-003</TableCell>
                      <TableCell className="font-medium">Producto</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Productos</Badge>
                      </TableCell>
                      <TableCell className="text-right">15</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ENT-004</TableCell>
                      <TableCell className="font-medium">Factura</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Transacciones</Badge>
                      </TableCell>
                      <TableCell className="text-right">20</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ENT-005</TableCell>
                      <TableCell className="font-medium">Empleado</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Empleados</Badge>
                      </TableCell>
                      <TableCell className="text-right">22</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diccionario de Atributos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Entidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ATR-001</TableCell>
                      <TableCell className="font-medium">cliente_id</TableCell>
                      <TableCell>
                        <Badge variant="outline">UUID</Badge>
                      </TableCell>
                      <TableCell className="text-sm">Cliente</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ATR-002</TableCell>
                      <TableCell className="font-medium">nombre_completo</TableCell>
                      <TableCell>
                        <Badge variant="outline">VARCHAR(200)</Badge>
                      </TableCell>
                      <TableCell className="text-sm">Cliente</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ATR-003</TableCell>
                      <TableCell className="font-medium">email</TableCell>
                      <TableCell>
                        <Badge variant="outline">VARCHAR(100)</Badge>
                      </TableCell>
                      <TableCell className="text-sm">Cliente</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ATR-004</TableCell>
                      <TableCell className="font-medium">fecha_registro</TableCell>
                      <TableCell>
                        <Badge variant="outline">TIMESTAMP</Badge>
                      </TableCell>
                      <TableCell className="text-sm">Cliente</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ATR-005</TableCell>
                      <TableCell className="font-medium">producto_id</TableCell>
                      <TableCell>
                        <Badge variant="outline">UUID</Badge>
                      </TableCell>
                      <TableCell className="text-sm">Producto</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Modelo Físico - Bases de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Tablas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DB-001</TableCell>
                    <TableCell className="font-medium">CRM_Production</TableCell>
                    <TableCell>
                      <Badge variant="secondary">PostgreSQL</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">Base de datos principal CRM</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">María García</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DB-002</TableCell>
                    <TableCell className="font-medium">ERP_Main</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Oracle</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">Sistema ERP empresarial</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Carlos Ruiz</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">128</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DB-003</TableCell>
                    <TableCell className="font-medium">Analytics_DW</TableCell>
                    <TableCell>
                      <Badge variant="outline">Data Warehouse</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">Almacén de datos analíticos</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Juan Pérez</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">67</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">DB-004</TableCell>
                    <TableCell className="font-medium">DataLake_Raw</TableCell>
                    <TableCell>
                      <Badge variant="outline">Data Lake</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">Lago de datos no estructurados</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Ana López</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tablas Físicas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Base de Datos</TableHead>
                      <TableHead className="text-right">Registros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">TBL-001</TableCell>
                      <TableCell className="font-medium">customers</TableCell>
                      <TableCell className="text-sm">CRM_Production</TableCell>
                      <TableCell className="text-right">45,234</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">TBL-002</TableCell>
                      <TableCell className="font-medium">orders</TableCell>
                      <TableCell className="text-sm">ERP_Main</TableCell>
                      <TableCell className="text-right">128,456</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">TBL-003</TableCell>
                      <TableCell className="font-medium">products</TableCell>
                      <TableCell className="text-sm">CRM_Production</TableCell>
                      <TableCell className="text-right">3,421</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">TBL-004</TableCell>
                      <TableCell className="font-medium">invoices</TableCell>
                      <TableCell className="text-sm">ERP_Main</TableCell>
                      <TableCell className="text-right">89,234</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">TBL-005</TableCell>
                      <TableCell className="font-medium">employees</TableCell>
                      <TableCell className="text-sm">ERP_Main</TableCell>
                      <TableCell className="text-right">1,245</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lineaje de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-sm font-medium mb-1">customers.customer_id</div>
                    <div className="text-xs text-muted-foreground mb-2">Origen: CRM_Production.customers</div>
                    <div className="flex items-center gap-2 text-xs">
                      <GitBranch className="h-3 w-3" />
                      <span>→ orders.customer_id</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <GitBranch className="h-3 w-3" />
                      <span>→ invoices.customer_id</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <GitBranch className="h-3 w-3" />
                      <span>→ Analytics_DW.dim_customer</span>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-sm font-medium mb-1">products.product_id</div>
                    <div className="text-xs text-muted-foreground mb-2">Origen: CRM_Production.products</div>
                    <div className="flex items-center gap-2 text-xs">
                      <GitBranch className="h-3 w-3" />
                      <span>→ order_items.product_id</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <GitBranch className="h-3 w-3" />
                      <span>→ Analytics_DW.dim_product</span>
                    </div>
                  </div>

                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-sm font-medium mb-1">orders.order_id</div>
                    <div className="text-xs text-muted-foreground mb-2">Origen: ERP_Main.orders</div>
                    <div className="flex items-center gap-2 text-xs">
                      <GitBranch className="h-3 w-3" />
                      <span>→ invoices.order_id</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <GitBranch className="h-3 w-3" />
                      <span>→ Analytics_DW.fact_sales</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
