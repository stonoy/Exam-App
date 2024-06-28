-- +goose Up
create table test(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    name text not null,
    description text not null,
    subject text not null,
    duration integer not null,
    total_participents integer not null,
    max_score integer not null,
    avg_score integer not null
);

-- +goose Down
drop table test;