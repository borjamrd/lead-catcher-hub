
import { Bell, BookOpen, MessageSquare, FileEdit } from 'lucide-react';
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

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const features = [
  {
    icon: <FileEdit className="h-6 w-6 mb-4 text-primary" />,
    title: "Notas y apuntes",
    description: "Crea tus mejores apuntes, agrega información basándote en la ley. Guárdalos en el formato que prefieras.",
  },
  {
    icon: <BookOpen className="h-6 w-6 mb-4 text-primary" />,
    title: "Tests Gratuitos",
    description: "Realiza test 100% gratuitos sobre tu oposición",
  },
  {
    icon: <Bell className="h-6 w-6 mb-4 text-primary" />,
    title: "Avisos INAP",
    description: "Recibe y configura los avisos sobre principales cambios en el INAP",
  },
  {
    icon: <MessageSquare className="h-6 w-6 mb-4 text-primary" />,
    title: "Chat Jurídico",
    description: "Chat jurídico actualizado con la normativa vigente",
  },
];

const Features = () => {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-4 gap-8"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
        >
          <div className="flex justify-center">{feature.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Features;
