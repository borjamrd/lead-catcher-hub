
import { useOppositionSearch } from "@/hooks/useOppositionSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Opposition = {
  id: string;
  name: string;
  is_assigned: boolean;
};

export default function Oposiciones() {
  const { data, isLoading, isError, error } = useOppositionSearch();

  // Safely access data.assigned and data.available with type checking
  const assigned = data && 'assigned' in data ? data.assigned : [];
  const available = data && 'available' in data ? data.available : [];

  return (
    <div className="space-y-8">
      {/* Mis Oposiciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mis Oposiciones</CardTitle>
          <CardDescription>
            Oposiciones a las que estás inscrito
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p className="text-red-500">Error: {error?.message || "No se pudieron cargar las oposiciones"}</p>
          ) : assigned.length === 0 ? (
            <p className="text-muted-foreground">No tienes oposiciones asignadas actualmente.</p>
          ) : (
            <div className="grid gap-4">
              {assigned.map((opp: Opposition) => (
                <div key={opp.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <span>{opp.name}</span>
                  <Button variant="outline" size="sm">Ver detalles</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Oposiciones Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Oposiciones Disponibles</CardTitle>
          <CardDescription>
            Explora las oposiciones disponibles en nuestra plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p className="text-red-500">Error: {error?.message || "No se pudieron cargar las oposiciones"}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {available.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">No hay oposiciones disponibles</TableCell>
                  </TableRow>
                ) : (
                  available.map((opp: Opposition) => (
                    <TableRow key={opp.id}>
                      <TableCell>{opp.name}</TableCell>
                      <TableCell>Disponible</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Añadir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
