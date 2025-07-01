import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RentTreeModalProps {
  open: boolean;
  onClose: () => void;
  refreshTrees: () => void;
}

export function RentTreeModal({ open, onClose, refreshTrees }: RentTreeModalProps) {
  const [trees, setTrees] = useState<any[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState<any>(null);
  const [overwriteTarget, setOverwriteTarget] = useState<'email' | 'phone' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchTrees();
      setSelectedTreeId('');
    }
  }, [open]);

  const fetchTrees = async () => {
    const { data } = await supabase
      .from('trees')
      .select('*')
      .eq('status', 'available')
      .order('name');
    setTrees(data || []);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setStartDate('');
    setEndDate('');
    setError(null);
    setConfirmOverwrite(false);
    setExistingCustomer(null);
    setOverwriteTarget(null);
    setSelectedTreeId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedTreeId || !name.trim() || !email.trim() || !phone.trim() || !startDate || !endDate) {
      setError('Tree, name, email, phone, start date, and end date are required.');
      return;
    }
    if (startDate > endDate) {
      setError('Start date must be before end date.');
      return;
    }
    setLoading(true);
    try {
      // 1. Check for existing customer by email and phone
      const { data: emailCustomer } = await supabase.from('customers').select('*').eq('email', email).single();
      const { data: phoneCustomer } = await supabase.from('customers').select('*').eq('phone', phone).single();
      // If both match and are the same customer, use that customer
      if (emailCustomer && phoneCustomer && emailCustomer.id === phoneCustomer.id) {
        await proceedWithRental(emailCustomer.id);
        return;
      }
      // If only one matches, prompt for confirmation
      if (emailCustomer && (!phoneCustomer || emailCustomer.id !== phoneCustomer.id)) {
        setExistingCustomer(emailCustomer);
        setOverwriteTarget('email');
        setConfirmOverwrite(true);
        setLoading(false);
        return;
      }
      if (phoneCustomer && (!emailCustomer || emailCustomer.id !== phoneCustomer.id)) {
        setExistingCustomer(phoneCustomer);
        setOverwriteTarget('phone');
        setConfirmOverwrite(true);
        setLoading(false);
        return;
      }
      // If neither matches, create a new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({ full_name: name, email, phone })
        .select()
        .single();
      if (customerError) throw customerError;
      await proceedWithRental(newCustomer.id);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setLoading(false);
    }
  };

  // Called after confirmation or new customer creation
  const proceedWithRental = async (customerId: string, updateCustomer = false) => {
    setLoading(true);
    try {
      // Optionally update customer info if confirmed
      if (updateCustomer && existingCustomer) {
        await supabase.from('customers').update({ full_name: name, email, phone }).eq('id', existingCustomer.id);
        customerId = existingCustomer.id;
      }
      // Ensure customerId is valid before proceeding
      if (!customerId) {
        setError('Customer creation failed. Please try again.');
        setLoading(false);
        return;
      }
      // Double-check customer exists in DB
      const { data: checkCustomer, error: checkError } = await supabase
        .from('customers')
        .select('id')
        .eq('id', customerId)
        .single();
      if (checkError || !checkCustomer) {
        setError('Customer not found in database after creation. Please try again.');
        setLoading(false);
        return;
      }
      // Use the selected tree
      const tree = trees.find((t) => t.id === selectedTreeId);
      if (!tree) {
        setError('Selected tree not found.');
        setLoading(false);
        return;
      }
      // Check for overlapping rentals for this tree
      const { data: overlappingRentals, error: overlapError } = await supabase
        .from('tree_rentals')
        .select('*')
        .eq('tree_id', tree.id)
        .eq('status', 'active')
        .lte('start_date', endDate)
        .gte('end_date', startDate);
      if (overlapError) throw overlapError;
      if (overlappingRentals && overlappingRentals.length > 0) {
        setError('This tree is already rented for the selected period.');
        setLoading(false);
        return;
      }
      // Create tree_rental
      const { error: rentalError } = await supabase
        .from('tree_rentals')
        .insert({
          tree_id: tree.id,
          customer_id: customerId,
          start_date: startDate,
          end_date: endDate,
          status: 'active',
        });
      if (rentalError) throw rentalError;
      // Update tree status and current_renter_id
      const { error: updateTreeError } = await supabase
        .from('trees')
        .update({ status: 'rented', current_renter_id: customerId })
        .eq('id', tree.id);
      if (updateTreeError) throw updateTreeError;
      toast({ title: 'Rental created successfully!' });
      resetForm();
      onClose();
      refreshTrees();
    } catch (err: any) {
      setError((err && err.message) || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for confirmation prompt
  const handleConfirmOverwrite = async (overwrite: boolean) => {
    setConfirmOverwrite(false);
    if (overwrite && existingCustomer) {
      await proceedWithRental(existingCustomer.id, true);
    } else if (!overwrite && existingCustomer) {
      // Create a new customer
      setLoading(true);
      try {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({ full_name: name, email, phone })
          .select()
          .single();
        if (customerError) throw customerError;
        await proceedWithRental(newCustomer.id);
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Renter</DialogTitle>
        </DialogHeader>
        {confirmOverwrite && existingCustomer ? (
          <div className="space-y-4">
            <div className="text-yellow-700 bg-yellow-100 p-3 rounded">
              <div className="font-semibold mb-2">A customer with this {overwriteTarget} already exists:</div>
              <div><b>Existing:</b> Name: {existingCustomer.full_name}, Email: {existingCustomer.email}, Phone: {existingCustomer.phone}</div>
              <div><b>New Info:</b> Name: {name}, Email: {email}, Phone: {phone}</div>
              <div className="mt-2">Do you want to update the existing customer with the new info?</div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleConfirmOverwrite(true)} className="w-full">Yes, update existing customer</Button>
              <Button variant="outline" onClick={() => handleConfirmOverwrite(false)} className="w-full">No, create a new customer</Button>
            </DialogFooter>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tree">Tree</Label>
            <Select value={selectedTreeId} onValueChange={setSelectedTreeId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a tree" />
              </SelectTrigger>
              <SelectContent>
                {trees.map((tree) => (
                  <SelectItem key={tree.id} value={tree.id}>
                    {tree.name}{tree.type ? ` (${tree.type})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="name">Renter Name *</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} required disabled={loading} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start Date *</Label>
              <Input id="start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="end">End Date *</Label>
              <Input id="end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required disabled={loading} />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Saving...' : 'Add Rental'}</Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full">Cancel</Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 