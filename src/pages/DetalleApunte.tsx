import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { Loader, Check } from "lucide-react";
import { useBlockManagement } from "@/hooks/useBlockManagement";
import InputBlock from "@/components/Blocks/InputBlock";
import NoteTitleInput from "@/components/Notes/NoteTitleInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { BlockRenderer } from "@/components/Blocks/BlockRenderer";

const DetalleApunte = () => {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const { blocks, createNewBlock, refetchBlocks } = useBlockManagement(id);
  const firstBlockRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchNoteTitle = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("notes")
          .select("title")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setTitle(data.title);
        }
      } catch (error) {
        console.error("Error fetching note title:", error);
        toast.error("Error al cargar el título del apunte");
      }
    };

    fetchNoteTitle();
  }, [id]);

  useEffect(() => {
    if (blocks && blocks.length === 0 && id) {
      createNewBlock(0, id);
    }
  }, [blocks, id]);

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

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: newTitle,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Error al actualizar el título");
    }
  };

  const handleEmptyBlockEnter = async () => {
    if (!id || !blocks?.length) return;

    try {
      const { error } = await supabase
        .from("note_blocks")
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

  const handleBlockDelete = async () => {
    await refetchBlocks();
  };

  const focusFirstBlock = () => {
    if (firstBlockRef.current) {
      firstBlockRef.current.focus();
    }
  };

  if (!blocks) {
    return (
      <div className="p-8">
        <p>Cargando bloques...</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isSaving && <Loader className="h-5 w-5 animate-spin" />}
        {showSuccess && <Check className="h-5 w-5 text-green-500" />}
      </div>

      <div className="mb-4">
        <NoteTitleInput
          title={title}
          onChange={handleTitleChange}
          onEnter={focusFirstBlock}
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-4 mt-8">
        <div className="space-y-4 mt-8">
          {blocks.map((block, index) => (
            <div key={block.id}>
              <BlockRenderer
                block={block}
                noteId={id!}
                onSaveStart={handleSaveStart}
                onSaveEnd={handleSaveEnd}
                onEmptyBlockEnter={handleEmptyBlockEnter}
                onContentBlockEnter={handleContentBlockEnter}
                onDelete={handleBlockDelete}
                refProp={index === 0 ? firstBlockRef : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetalleApunte;
