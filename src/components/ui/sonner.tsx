import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[#0E1322] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl',
          description: 'group-[.toast]:text-slate-400',
          actionButton:
            'group-[.toast]:bg-[#E31837] group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-white/10 group-[.toast]:text-slate-300',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
