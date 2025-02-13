
import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface FormData {
  email: string;
  name: string;
}

interface SubscriptionFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const SubscriptionForm = ({ register, errors }: SubscriptionFormProps) => {
  return (
    <div className="flex gap-4">
      <div className="w-1/4">
        <Input
          type="text"
          placeholder="Nombre"
          {...register('name', {
            required: 'El nombre es obligatorio',
          })}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="w-3/4">
        <Input
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'El email es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido',
            },
          })}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionForm;
