-- +goose Up
create table test_user(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    userid uuid not null
    references users(id)
    on delete cascade,
    testid uuid not null
    references test(id)
    on delete cascade,
    score integer not null,
    remaining_time integer not null,
    status test_user_status not null,
    unique(userid, testid)
);

-- +goose Down
drop table test_user;