
import { useParams } from "react-router-dom";

const DetalleApunte = () => {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Detalle del apunte</h1>
      <p className="text-gray-600">ID del apunte: {id}</p>
      <p className="text-gray-600">Página en construcción</p>
    </div>
  );
};

export default DetalleApunte;
