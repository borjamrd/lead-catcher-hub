
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

const Ajustes = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const { data: profile, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Foto de perfil actualizada correctamente');
      refetch();
    } catch (error) {
      toast.error('Error al actualizar la foto de perfil');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ajustes de perfil</h1>
      
      <div className="space-y-6">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={user.email}
            disabled
            className="mt-1"
          />
        </div>

        <div>
          <Label>Foto de perfil</Label>
          <div className="mt-1 flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button
              onClick={() => document.getElementById('avatar')?.click()}
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Cambiar foto'}
            </Button>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={uploadAvatar}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ajustes;
