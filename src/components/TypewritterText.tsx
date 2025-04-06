import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  delay?: number; // delay entre letras
}

const TypewriterText = ({ text, delay = 0.02 }: TypewriterTextProps) => {
  return (
    <span>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * delay }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default TypewriterText;
