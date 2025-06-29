
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoomManagement } from './RoomManagement';
import { TreeManagement } from './TreeManagement';

interface AssetManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export function AssetManagementModal({ open, onClose }: AssetManagementModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle 
            className="text-[hsl(var(--text-accent))]"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            Manage Farm Assets
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="trees">Trees</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms" className="mt-6">
            <RoomManagement />
          </TabsContent>
          
          <TabsContent value="trees" className="mt-6">
            <TreeManagement />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
