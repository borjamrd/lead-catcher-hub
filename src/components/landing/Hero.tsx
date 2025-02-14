
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <h1 className="text-4xl sm:text-5xl font-bold mb-6">
        <span className="text-yinmn_blue">oposita</span>
        <span className="text-oxford_blue">place</span>
      </h1>
      <p className="text-xl sm:text-2xl text-gray-600 mb-12">
        Toda tu oposición, en un mismo lugar
      </p>
    </motion.div>
  );
};

export default Hero;
