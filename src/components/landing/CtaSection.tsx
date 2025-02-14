
import { Mail, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  email: string;
}

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

const CtaSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            email: data.email,
            name: 'Early Access User',
          },
        ]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Ya estás registrado",
            description: "Este email ya está en nuestra lista de espera.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "¡Gracias por tu interés!",
          description: "Te mantendremos informado sobre el lanzamiento.",
        });
        reset();
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: 'Error',
        description: 'No pudimos procesar tu solicitud. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section 
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="py-16 bg-oxford_blue rounded-2xl mt-24 text-white"
    >
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-6">
          ¿Listo para preparar tu oposición de manera más eficiente?
        </h2>
        <p className="text-lg mb-8 text-gray-200">
          Únete a la lista de espera y sé de los primeros en acceder a todas las funcionalidades.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-yinmn_blue hover:bg-yinmn_blue-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              "Enviando..."
            ) : (
              <>
                Unirme a la lista de espera
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.section>
  );
};

export default CtaSection;
