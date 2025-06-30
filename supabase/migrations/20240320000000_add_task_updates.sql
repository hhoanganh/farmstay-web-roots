-- Create task_updates table
CREATE TABLE IF NOT EXISTS task_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    image_urls TEXT[] DEFAULT array[]::TEXT[],
    update_type TEXT CHECK (update_type IN ('progress', 'completion')) NOT NULL
);

-- Add evidence_required boolean to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS evidence_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS completion_notes TEXT,
ADD COLUMN IF NOT EXISTS completion_image_urls TEXT[] DEFAULT array[]::TEXT[];

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_task_updates_task_id ON task_updates(task_id);
CREATE INDEX IF NOT EXISTS idx_task_updates_created_by ON task_updates(created_by); 