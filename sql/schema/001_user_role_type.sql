-- +goose Up
create type user_role as enum ('student', 'admin');

-- +goose Down
drop type if exists user_role;