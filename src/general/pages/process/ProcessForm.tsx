import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/general/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { CustomToast} from "@/general/components/CustomToast";
import type { Artefact } from "@/interfaces/artefacts.response";
import type { ArtefactRequest} from '@/interfaces/artefact.request';
import { postArtefactActions } from "@/general/actions/post-artefact.actions";

const processSchema = z.object({
  identificacion: z.string().min(1, "La identificación es requerida"),
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  propietario: z.string().min(1, "El propietario es requerido"),
  categoria: z.string().min(1, "La categoría es requerida"),
  estado: z.string().min(1, "El estado es requerido"),
  sistemas: z.string().optional(),
  personas: z.string().optional(),
  capacidades: z.string().optional(),
  riesgos: z.string().optional(),
  objetivos: z.string().optional(),
});

type ProcesoFormValues = z.infer<typeof processSchema>;

interface ProcesoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proceso?: Artefact;
}
export function ProcessForm({ open, onOpenChange, proceso }: ProcesoFormProps) {
  // const { ctoast } = CustomToast();

  const form = useForm<ProcesoFormValues>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      identificacion: proceso?.id.toString() || "",
      nombre: proceso?.name || "",
      descripcion: "",
      propietario: proceso?.owner || "",
      categoria: proceso?.category || "",
      estado: proceso?.state || "Activo",
      sistemas: "",
      personas: "",
      capacidades: "",
      riesgos: "",
      objetivos: "",
    },
  });
 const handleCreate = async (data: ProcesoFormValues) => {
  const artefact: ArtefactRequest = {
    id: data.identificacion,
    name: data.nombre,
    description: data.descripcion,
    type: "BPMN",
    level: 2,
    subtype: "Proceso",
    alias: "Alias test",
    category: data.categoria,
    subcategory: "General",
    version: "1.0",
    company: "Mi empresa",
    owner: data.propietario,
    state: data.estado,
    objetive: "Optimizar",
    range: "Corporativo"
  };

  try {
    const res = await postArtefactActions(artefact);
    CustomToast({title:data.nombre,description:"Creado Correctamente"});
    console.log("Creado correctamente:", res);
  } catch (e) {
    console.error(e);
  }
 };

  const onSubmit = (data: ProcesoFormValues) => {
    // toast({
    //   title: "Proceso guardado",
    //   description: "Los cambios se han guardado correctamente." + data.descripcion,
    // });

   // toast("Esta funcionando");


   // CustomToast({title:data.nombre,description:data.descripcion});
    handleCreate(data);
     onOpenChange(false);


  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {proceso ? "Editar Proceso" : "Nuevo Proceso"}
          </SheetTitle>
          <SheetDescription>
            Complete los campos para {proceso ? "actualizar" : "crear"} el proceso
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            <FormField
              control={form.control}
              name="identificacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificación</FormLabel>
                  <FormControl>
                    <Input placeholder="PR-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proceso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción detallada del proceso"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propietario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propietario</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del propietario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="RRHH">RRHH</SelectItem>
                      <SelectItem value="Operaciones">Operaciones</SelectItem>
                      <SelectItem value="Finanzas">Finanzas</SelectItem>
                      <SelectItem value="Servicio">Servicio</SelectItem>
                      <SelectItem value="TI">TI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="En Revisión">En Revisión</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sistemas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistemas Involucrados</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Sistemas y aplicaciones relacionadas"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Personas involucradas en el proceso"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacidades"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidades</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Capacidades organizacionales relacionadas"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riesgos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Riesgos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Riesgos asociados al proceso"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objetivos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivos que Impacta</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Objetivos estratégicos relacionados"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Guardar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

