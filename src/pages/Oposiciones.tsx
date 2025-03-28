
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const Oposiciones = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Mis Oposiciones</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-dashed border-2 flex flex-col items-center justify-center py-10">
          <CardContent className="text-center flex flex-col items-center gap-4 pt-6">
            <PlusCircle className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-xl font-medium mb-2">Añadir nueva oposición</h3>
              <p className="text-muted-foreground">Configura una nueva oposición para comenzar a estudiar</p>
            </div>
            <Button className="mt-4">Añadir oposición</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Oposiciones;
