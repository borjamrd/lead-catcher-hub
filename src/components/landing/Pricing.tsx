
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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

const Pricing = () => {
  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-oxford_blue">
          Planes y Precios
        </h2>
        <p className="text-lg text-center text-gray-600 mb-16">
          Elige el plan que mejor se adapte a tu preparación
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-semibold text-oxford_blue mb-4">Gratuito</h3>
            <p className="text-4xl font-bold text-yinmn_blue mb-6">€0<span className="text-lg font-normal text-gray-500">/mes</span></p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Acceso a tests básicos</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Avisos INAP limitados</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Chat jurídico básico</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Empezar gratis</Button>
          </div>

          {/* Premium Plan */}
          <div className="bg-oxford_blue p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow transform scale-105">
            <div className="bg-yinmn_blue/20 text-yinmn_blue text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
              Más popular
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Premium</h3>
            <p className="text-4xl font-bold text-white mb-6">€9.99<span className="text-lg font-normal text-gray-300">/mes</span></p>
            <ul className="space-y-4 mb-8 text-gray-200">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Tests ilimitados</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Todos los avisos INAP</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Chat jurídico avanzado</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Sistema de notas completo</span>
              </li>
            </ul>
            <Button className="w-full bg-yinmn_blue hover:bg-yinmn_blue-600 text-white">
              Comenzar ahora
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-xl font-semibold text-oxford_blue mb-4">Pro</h3>
            <p className="text-4xl font-bold text-yinmn_blue mb-6">€19.99<span className="text-lg font-normal text-gray-500">/mes</span></p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Todo lo de Premium</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Tutorías personalizadas</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Recursos exclusivos</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 h-6 w-6 text-yinmn_blue">•</span>
                <span>Grupos de estudio</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">Contactar</Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Pricing;
