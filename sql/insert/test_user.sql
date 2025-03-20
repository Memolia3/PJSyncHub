INSERT INTO "user" (id, name, email, password, avatar_url, avatar_updated_at, created_at, updated_at) VALUES (gen_random_uuid(), 'test', 'test@example.com', 'password', NULL, NULL, NOW(), NOW());
