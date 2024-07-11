-- +goose Up
alter table test_user
add column second_counter integer not null default 59;

-- +goose Down
alter table test_user
drop column second_counter;