
import { useOppositionStore } from "@/stores/useOppositionStore";
import { useTests } from "@/hooks/useTests";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, Plus, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Tests = () => {
  const { currentSelectedOppositionId } = useOppositionStore();
  const { data: tests, isLoading, error } = useTests(currentSelectedOppositionId);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Tests</h1>
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          Error al cargar los tests. Por favor, inténtalo de nuevo.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tests</h1>
        <Button>
          <Shuffle className="h-4 w-4 mr-2" />
          Test aleatorio
        </Button>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="todos">Todos los tests</TabsTrigger>
          <TabsTrigger value="examen">Examen</TabsTrigger>
          <TabsTrigger value="tema">Tema actual</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : tests && tests.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableCaption>Lista de todos los tests disponibles</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tema</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-medium">{test.title}</TableCell>
                      <TableCell>{test.topic_id || "General"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/dashboard/tests/${test.id}`}>
                            Comenzar
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
              <CheckSquare className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay tests disponibles</h3>
              <p className="text-muted-foreground mb-4">
                {currentSelectedOppositionId 
                  ? "No se encontraron tests para esta oposición. Crea uno nuevo para empezar." 
                  : "Selecciona una oposición para ver sus tests."}
              </p>
              {currentSelectedOppositionId && (
                <Button>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Test aleatorio
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="examen">
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
            <CheckSquare className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Próximamente</h3>
            <p className="text-muted-foreground">
              Los tests de examen estarán disponibles en breve.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="tema">
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
            <CheckSquare className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Próximamente</h3>
            <p className="text-muted-foreground">
              Los tests por tema estarán disponibles en breve.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tests;
