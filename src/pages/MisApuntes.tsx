
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Note {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const MisApuntes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });

  const handleCreateNote = () => {
    navigate("/dashboard/mis-apuntes/nuevo");
  };

  const handleNoteClick = (noteId: string) => {
    navigate(`/dashboard/mis-apuntes/${noteId}`);
  };

  const handleDeleteNote = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation(); // Prevent row click event

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      // Invalidate and refetch notes
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      
      toast.success("Apunte eliminado correctamente");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error al eliminar el apunte");
    }
  };

  if (isLoading) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Apuntes</h1>
        <Button onClick={handleCreateNote}>
          <Plus className="mr-2 h-4 w-4" />
          Crear apunte
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Última modificación</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes?.map((note) => (
            <TableRow
              key={note.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleNoteClick(note.id)}
            >
              <TableCell>{note.title}</TableCell>
              <TableCell>
                {new Date(note.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(note.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={(e) => handleDeleteNote(e, note.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {notes?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tienes apuntes creados. ¡Crea uno nuevo!
        </div>
      )}
    </div>
  );
};

export default MisApuntes;
