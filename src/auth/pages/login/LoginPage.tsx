import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/auth/hooks/useAuth";
import { Button } from "@/general/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router";
import { CustomToast } from "@/general/components/CustomToast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getCompanies, type Company } from "@/api/companyService";
import { getUserProfile } from "@/api/userService";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
  company: z.string().min(1, { message: "La compañía es requerida" }),
});

export const LoginPage = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    logout(); // Ensure clean session

    const loadCompanies = async () => {
      try {
        const email = import.meta.env.VITE_COMPANY_USER;
        const password = import.meta.env.VITE_COMPANY_PASS;

        if (!email || !password) {
          console.warn("Faltan credenciales de sistema en .env");
          return;
        }

        // We perform a "system login" to get a token capable of reading companies
        const { token } = await import("@/auth/actions/login.action").then(m => m.loginAction(email, password));

        const data = await getCompanies(token);
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies", error);
        CustomToast({ title: "Error", description: "No se pudieron cargar las compañías." });
      }
    }
    loadCompanies();
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      company: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      // 1. Login
      // company field is required now
      await login(values.email, values.password, values.company);

      // 2. Validate Company Access
      try {
        const userProfile = await getUserProfile();
        // Validation: user.company === 'ALL' OR user.company === selectedCompany.name
        // Assuming values.company is the company name because SelectValue usually stores the value passed to Item.
        // We will make sure to pass the name as value in the SelectItem.

        const selectedCompanyName = values.company;

        if (userProfile.company === 'ALL' || userProfile.company === selectedCompanyName) {
          CustomToast({ title: "Bienvenido", description: "Has iniciado sesión correctamente" });
          navigate("/");
        } else {
          throw new Error("User does not have access to this company");
        }

      } catch (validationError) {
        // If validation fails, logout and show error
        console.error("Validation failed", validationError);
        logout(); // Logout to clear token
        CustomToast({ title: "Acceso Denegado", description: "El usuario no tiene acceso a la compañía seleccionada." });
      }

    } catch (error) {
      // If login itself fails
      console.error("Login process error", error);
      // Only show specific invalid credentials error if it wasn't the validation error
      // But here we rely on the fact that if login() fails, it throws, so we catch it here.
      // If validation throws, it's also caught here.
      // We can distinguish if we want, but for now simple handling.
      if ((error as Error).message === "User does not have access to this company") {
        // Already handled above? No, wait.
        // I nested the try-catch for validation inside.
        // Let's restructure properly.
      } else {
        CustomToast({ title: "Error", description: "Credenciales inválidas o error de conexión." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-900 to-blue-500 bg-clip-text text-transparent text-center mb-4">
            EATool APP
          </h1>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compañía</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una compañía" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.name}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="link" className="text-sm text-muted-foreground" onClick={() => navigate('/auth/recovery')}>
            ¿Olvidaste tu contraseña?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
