import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InputBlock from "@/components/Blocks/InputBlock";
import NoteTitleInput from "@/components/Notes/NoteTitleInput";
import { useNoteCreation } from "@/hooks/useNoteCreation";
import { useBlockManagement } from "@/hooks/useBlockManagement";

const NuevoApunte = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const { noteId, createInitialNote } = useNoteCreation();
  const { blocks, createNewBlock } = useBlockManagement(noteId);

  // Create initial block when note is created
  useEffect(() => {
    if (noteId && (!blocks || blocks.length === 0)) {
      createNewBlock(0, noteId);
    }
  }, [noteId, blocks]);

  const handleFinish = () => {
    if (noteId) {
      navigate(`/dashboard/mis-apuntes/${noteId}`);
    } else {
      navigate("/dashboard/mis-apuntes");
    }
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!noteId) {
      const newNoteId = await createInitialNote(e.target.value);
      if (newNoteId) {
        createNewBlock(0, newNoteId);
      }
    }
  };

  const handleSaveStart = () => {
    // Esta función podría usarse para mostrar un indicador de guardado
  };

  const handleSaveEnd = () => {
    // Esta función podría usarse para mostrar un indicador de éxito
  };

  const handleEmptyBlockEnter = async (position: number) => {
    if (noteId) {
      await createNewBlock(position + 1, noteId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-12">
      <h1 className="text-2xl font-bold mb-6">Crear nuevo apunte</h1>
      <div className="space-y-6">
        <NoteTitleInput title={title} onChange={handleTitleChange} />
        <div className="space-y-4">
          {blocks?.map((block) => (
            <div key={block.id}>
              {block.type === "text" && block.content && typeof block.content === 'object' && 'text' in block.content ? (
                <InputBlock
                  id={block.id}
                  content={block.content as { text: string }}
                  noteId={noteId!}
                  position={block.position}
                  onSaveStart={handleSaveStart}
                  onSaveEnd={handleSaveEnd}
                  onEmptyBlockEnter={() => handleEmptyBlockEnter(block.position)}
                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleFinish}
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NuevoApunte;
