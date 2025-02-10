
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Loader, Check, Plus } from "lucide-react";
import { useBlockManagement } from "@/hooks/useBlockManagement";
import InputBlock from "@/components/Blocks/InputBlock";
import NoteTitleInput from "@/components/Notes/NoteTitleInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DetalleApunte = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const { blocks, createNewBlock, refetchBlocks } = useBlockManagement(id);

  const handleSaveStart = () => {
    setIsSaving(true);
  };

  const handleSaveEnd = () => {
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    try {
      const { error } = await supabase
        .from("notes")
        .update({ 
          title: newTitle,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Error al actualizar el título");
    }
  };

  const handleCreateBlock = async () => {
    if (!id) return;
    const newPosition = blocks?.length ? blocks.length : 0;
    await createNewBlock(newPosition, id);
  };

  const handleEmptyBlockEnter = async () => {
    // Cuando se presiona Enter en un bloque vacío, lo eliminamos
    if (!id || !blocks?.length) return;

    try {
      const { error } = await supabase
        .from("blocks")
        .delete()
        .eq("id", blocks[blocks.length - 1].id);

      if (error) throw error;
      
      await refetchBlocks();
    } catch (error) {
      console.error("Error deleting empty block:", error);
      toast.error("Error al eliminar el bloque");
    }
  };

  const handleContentBlockEnter = async (position: number) => {
    if (!id) return;
    await createNewBlock(position + 1, id);
  };

  if (!blocks) {
    return (
      <div className="p-8">
        <p>Cargando bloques...</p>
      </div>
    );
  }

  return (
    <div className="p-8 relative max-w-4xl mx-auto">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isSaving && <Loader className="h-5 w-5 animate-spin" />}
        {showSuccess && <Check className="h-5 w-5 text-green-500" />}
      </div>
      
      <div className="mb-6">
        <NoteTitleInput
          title={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <div key={block.id}>
            {block.type === "text" && block.content && typeof block.content === 'object' && 'text' in block.content ? (
              <InputBlock
                id={block.id}
                content={block.content as { text: string }}
                noteId={id!}
                position={block.position}
                onSaveStart={handleSaveStart}
                onSaveEnd={handleSaveEnd}
                onEmptyBlockEnter={handleEmptyBlockEnter}
                onContentBlockEnter={handleContentBlockEnter}
              />
            ) : (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(block, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <Button 
          onClick={handleCreateBlock}
          className="mt-4"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar bloque
        </Button>
      )}
    </div>
  );
};

export default DetalleApunte;
