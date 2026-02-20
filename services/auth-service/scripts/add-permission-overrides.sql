-- Add permission_overrides column to users table (idempotent).
-- From repo root: npm run dev:migrate-permission-overrides
SET @sql = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'auth_schema' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'permission_overrides') = 0,
  'ALTER TABLE users ADD COLUMN permission_overrides JSON DEFAULT NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
