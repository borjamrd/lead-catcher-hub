
import { Trophy, Target, Sparkles, Crown } from 'lucide-react';
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

const Gamification = () => {
  return (
    <motion.section 
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="py-24 bg-gradient-to-b from-platinum to-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-oxford_blue">
          Haz tu estudio ameno
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-yinmn_blue/10 rounded-lg">
                <Trophy className="h-8 w-8 text-yinmn_blue" />
              </div>
              <h3 className="text-2xl font-semibold text-oxford_blue">Misiones semanales</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Enfrenta nuevos desafíos cada semana: desde casos prácticos hasta competiciones por el mejor tiempo en tests.
            </p>
            <div className="flex items-center space-x-3 text-sm text-yinmn_blue">
              <Target className="h-5 w-5" />
              <span>Supera tus mejores marcas</span>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-yinmn_blue/10 rounded-lg">
                <Sparkles className="h-8 w-8 text-yinmn_blue" />
              </div>
              <h3 className="text-2xl font-semibold text-oxford_blue">Gana LexPoints 😉</h3>
            </div>
            <p className="text-sm italic text-gray-500 mb-4 ml-[60px]">
              en latín: lex, legis
            </p>
            <p className="text-gray-600 mb-6">
              Acumula puntos mientras avanzas en tu estudio. Los LexPoints te ayudarán a seguir tu progreso y desbloquear nuevo contenido.
            </p>
            <div className="flex items-center space-x-3 text-sm text-yinmn_blue">
              <Crown className="h-5 w-5" />
              <span>Compite en el ranking semanal</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Gamification;
