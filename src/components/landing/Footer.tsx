
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

const Footer = () => {
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
    <footer className="bg-rich_black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 rounded-2xl -mt-12 text-white mb-12"
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
        </motion.div>

        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                <span className="text-yinmn_blue">oposita</span>
                <span className="text-oxford_blue">place</span>
              </h3>
              <p className="text-sm">
                La plataforma integral para opositores.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-medium">Funcionalidades</h4>
              <ul className="space-y-2 text-sm">
                <li>Avisos INAP</li>
                <li>Tests Gratuitos</li>
                <li>Chat Jurídico</li>
                <li>Notas y apuntes</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Términos y condiciones</li>
                <li>Política de privacidad</li>
                <li>Aviso legal</li>
                <li>Cookies</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-medium">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>Soporte</li>
                <li>Contacto</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} opositaplace. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
