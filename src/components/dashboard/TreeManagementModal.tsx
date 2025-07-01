import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TreeManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export function TreeManagementModal({ open, onClose }: TreeManagementModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Trees</DialogTitle>
        </DialogHeader>
        <div className="py-8 text-center text-[hsl(var(--text-secondary))]">
          Tree management UI will go here.
        </div>
        <Button onClick={onClose} className="w-full mt-4">Close</Button>
      </DialogContent>
    </Dialog>
  );
} 