-- +goose Up
create type test_user_status as enum ('available', 'paused', 'completed');

-- +goose Down
drop type if exists test_user_status;