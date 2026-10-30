import { toast } from 'sonner';

export const useToast = () => {
  return {
    toast: ({
      title,
      description,
      variant,
    }: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      if (variant === 'destructive') {
        toast.error(title || 'Erro', {
          description,
        });
      } else {
        toast.success(title || 'Sucesso', {
          description,
        });
      }
    },
    dismiss: (toastId?: string) => toast.dismiss(toastId),
  };
};

export { toast };
