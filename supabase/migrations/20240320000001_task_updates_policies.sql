-- Enable RLS on task_updates
ALTER TABLE task_updates ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert task updates
CREATE POLICY "Allow authenticated users to insert task updates"
ON task_updates
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to view task updates if they are admin or the assigned staff of the related task
CREATE POLICY "View task updates if admin or assigned staff"
ON task_updates
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  OR
  EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = task_updates.task_id 
    AND tasks.assigned_to = auth.uid()
  )
);

-- Allow users to update their own task updates
CREATE POLICY "Users can update their own task updates"
ON task_updates
FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Allow users to delete their own task updates
CREATE POLICY "Users can delete their own task updates"
ON task_updates
FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Update tasks table policies to allow staff to update their assigned tasks
CREATE POLICY "Staff can update assigned tasks"
ON tasks
FOR UPDATE
TO authenticated
USING (
  assigned_to = auth.uid()
  OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  assigned_to = auth.uid()
  OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
); 