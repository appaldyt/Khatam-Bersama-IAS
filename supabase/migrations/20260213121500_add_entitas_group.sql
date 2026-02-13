-- Add new group: Entitas
INSERT INTO groups (name)
SELECT 'Entitas'
WHERE NOT EXISTS (
  SELECT 1 FROM groups WHERE name = 'Entitas'
);
