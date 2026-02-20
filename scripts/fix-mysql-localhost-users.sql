CREATE USER IF NOT EXISTS 'studycafe_user'@'%' IDENTIFIED BY 'studycafe_pass';
GRANT ALL ON studycafe_db.* TO 'studycafe_user'@'%';
FLUSH PRIVILEGES;
