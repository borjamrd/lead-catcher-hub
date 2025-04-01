interface BlockViewerProps {
    value: string;
    type: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  }
  
  const typeStyles: Record<string, string> = {
    heading_1: "text-4xl font-bold",
    heading_2: "text-2xl font-semibold",
    heading_3: "text-xl font-medium",
    paragraph: "text-base",
    to_do: "pl-6", // pendiente de diseño
    bulleted_list_item: "pl-6 list-disc list-inside",
    numbered_list_item: "pl-6 list-decimal list-inside",
  };
  
  const BlockViewer = ({ value, type, onClick }: BlockViewerProps) => {
    const styles = typeStyles[type] || "";
  
    return (
      <div
        onClick={onClick}
        className={`p-2 rounded-md hover:bg-gray-100 whitespace-pre-wrap break-words min-h-[42px] overflow-visible cursor-text text-gray-800 ${styles}`}
      >
        {value}
      </div>
    );
  };
  
  
  export default BlockViewer;
  