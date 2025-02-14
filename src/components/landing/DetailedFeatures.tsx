import { motion } from 'framer-motion';
import NotificacionesOposicion from '@/pages/NotificacionesOposicion';

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const DetailedFeatures = () => {
  return (
    <>
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Sistema de Notas Inteligente</h2>
            <p className="text-lg text-gray-600">
              Organiza y mejora tus apuntes con nuestras herramientas avanzadas:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Editor de texto enriquecido con formato legal</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Referencias automáticas a la legislación</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Organización por temas y subtemas</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Exportación a múltiples formatos (PDF, Word, HTML)</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="aspect-video bg-white rounded-lg shadow-sm"></div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-100 p-8 rounded-lg order-2 md:order-1">
            <div className="aspect-video bg-white rounded-lg shadow-sm"></div>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900">Tests de Preparación</h2>
            <p className="text-lg text-gray-600">
              Practica y evalúa tus conocimientos con nuestra amplia biblioteca de tests:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Tests específicos por tema y bloque</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Preguntas actualizadas según la última normativa</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Explicaciones detalladas de cada respuesta</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Seguimiento de tu progreso y áreas de mejora</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Avisos INAP Personalizados</h2>
            <p className="text-lg text-gray-600">
              Mantente al día con todos los cambios relevantes del INAP para tu oposición:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Notificaciones instantáneas sobre nuevas convocatorias</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Alertas sobre cambios en el temario</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Seguimiento de plazos y fechas importantes</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Filtros personalizados por tipo de oposición</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <NotificacionesOposicion />
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-100 p-8 rounded-lg order-2 md:order-1">
            <div className="aspect-video bg-white rounded-lg shadow-sm"></div>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900">Chat Jurídico Inteligente</h2>
            <p className="text-lg text-gray-600">
              Resuelve tus dudas jurídicas al instante con nuestro asistente especializado:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Base de conocimiento actualizada con la última legislación</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Respuestas precisas con referencias a la normativa</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                <span>Ejemplos prácticos y casos de estudio</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default DetailedFeatures;
