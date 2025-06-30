-- Create task-media storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-media', 'task-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-media'
  AND auth.role() = 'authenticated'
);

-- Allow public access to read files
CREATE POLICY "Allow public to read task media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'task-media');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own task media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'task-media' AND owner = auth.uid())
WITH CHECK (bucket_id = 'task-media' AND owner = auth.uid());

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own task media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'task-media' AND owner = auth.uid()); 