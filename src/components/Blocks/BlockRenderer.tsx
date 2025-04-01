import InputBlock from "./InputBlock";

interface BlockRendererProps {
  block: any;
  noteId: string;
  onSaveStart: () => void;
  onSaveEnd: () => void;
  onEmptyBlockEnter: () => void;
  onContentBlockEnter: (pos: number) => void;
  onDelete: () => void;
  refProp?: React.Ref<HTMLTextAreaElement>;
  onFocusNavigate?: (position: number) => void;
  autoFocus?: boolean;
}

export const BlockRenderer = ({
  block,
  noteId,
  onSaveStart,
  onSaveEnd,
  onEmptyBlockEnter,
  onContentBlockEnter,
  onDelete,
  refProp,
  onFocusNavigate,
  autoFocus
}: BlockRendererProps) => {
  const content = block.content || block[block.type]; // fallback por seguridad
  const type = block.type === "text" ? "paragraph" : block.type;

  switch (type) {
    case "paragraph":
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "to_do":
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <InputBlock
          type={type}
          id={block.id}
          content={content}
          noteId={noteId}
          position={block.position}
          onSaveStart={onSaveStart}
          onSaveEnd={onSaveEnd}
          onEmptyBlockEnter={onEmptyBlockEnter}
          onContentBlockEnter={onContentBlockEnter}
          onDelete={onDelete}
          ref={refProp}
          onFocusNavigate={onFocusNavigate} 
          autoFocus={autoFocus}
        />
      );

    default:
      return null;
  }
};
