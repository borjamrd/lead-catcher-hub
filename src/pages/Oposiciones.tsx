
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, BookOpen } from "lucide-react";
import { useOppositionSearch } from "@/hooks/useOppositionSearch";
import { useAuth } from "@/contexts/AuthContext";

const Oposiciones = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useOppositionSearch();
  const [selectedOppositionId, setSelectedOppositionId] = useState<string | null>(null);

  const handleAssignOpposition = async (id: string) => {
    // Lógica para asignar oposición (se implementará más adelante)
    console.log("Asignar oposición:", id);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Mis Oposiciones</h1>
      
      <div className="flex flex-col gap-6">
        {/* Primera sección - Mis oposiciones */}
        <Card>
          <CardHeader>
            <CardTitle>Mis oposiciones</CardTitle>
            <CardDescription>Oposiciones que estás preparando</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Cargando...</p>
            ) : error ? (
              <p className="text-center text-destructive">Error al cargar los datos</p>
            ) : data && data.assigned && data.assigned.length > 0 ? (
              <ul className="space-y-2">
                {data.assigned.map((opposition: any) => (
                  <li key={opposition.id} className="p-3 bg-muted rounded-md flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>{opposition.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No tienes oposiciones asignadas</p>
                <Button>Añadir oposición</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Segunda sección - Oposiciones disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Oposiciones disponibles</CardTitle>
            <CardDescription>Selecciona una oposición para comenzar a prepararla</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-6">Cargando...</p>
            ) : error ? (
              <p className="text-center text-destructive py-6">Error al cargar los datos</p>
            ) : data && data.available && data.available.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.available.map((opposition: any) => (
                    <TableRow key={opposition.id}>
                      <TableCell>{opposition.name}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          onClick={() => handleAssignOpposition(opposition.id)}
                        >
                          Añadir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No hay oposiciones disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Oposiciones;
