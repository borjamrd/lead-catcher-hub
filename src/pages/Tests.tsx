
import { useOppositionStore } from "@/stores/useOppositionStore";
import { useTests } from "@/hooks/useTests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, Plus } from "lucide-react";
import { Link } from "react-router-dom";

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
          <Plus className="h-4 w-4 mr-2" />
          Crear nuevo test
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : tests && tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <Card key={test.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>
                  Tema: {test.topic_id || "General"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center text-muted-foreground py-6">
                  <CheckSquare className="h-8 w-8" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link to={`/dashboard/tests/${test.id}`}>
                    Comenzar Test
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
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
              <Plus className="h-4 w-4 mr-2" />
              Crear nuevo test
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Tests;
