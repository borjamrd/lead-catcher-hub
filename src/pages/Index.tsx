import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight, Bell, BookOpen, MessageSquare, FileEdit, Trophy, Target, Sparkles, Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Index = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            ¿Te interesa?
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Sé el primero en enterarte cuando lancemos
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="pl-10"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                "Enviando..."
              ) : (
                <>
                  Mantenerme informado
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-24">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <Bell className="h-6 w-6 mb-4 text-primary" />,
                title: "Avisos INAP",
                description: "Recibe y configura los avisos sobre principales cambios en el INAP",
              },
              {
                icon: <BookOpen className="h-6 w-6 mb-4 text-primary" />,
                title: "Tests Gratuitos",
                description: "Realiza test 100% gratuitos sobre tu oposición",
              },
              {
                icon: <MessageSquare className="h-6 w-6 mb-4 text-primary" />,
                title: "Chat Jurídico",
                description: "Chat jurídico actualizado con la normativa vigente",
              },
              {
                icon: <FileEdit className="h-6 w-6 mb-4 text-primary" />,
                title: "Notas y apuntes",
                description: "Crea tus mejores apuntes, agrega información basándote en la ley. Guárdalos en el formato que prefieras.",
              },
            ].map((feature, index) => (
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
                    <span>Disponible 24/7 para consultas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-primary">•</span>
                    <span>Ejemplos prácticos y casos de estudio</span>
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
            </div>
          </motion.section>

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
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-yinmn_blue/10 rounded-lg">
                      <Sparkles className="h-8 w-8 text-yinmn_blue" />
                    </div>
                    <h3 className="text-2xl font-semibold text-oxford_blue">Gana LexPoints 😉</h3>
                  </div>
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
        </div>
      </div>

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

      <footer className="bg-rich_black text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </footer>
    </div>
  );
};

export default Index;
