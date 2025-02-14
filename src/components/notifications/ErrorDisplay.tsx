
interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

const ErrorDisplay = ({ error, onRetry, className = "" }: ErrorDisplayProps) => {
  return (
    <div className={className}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
