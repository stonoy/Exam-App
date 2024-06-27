-- +goose Up
create table exam_user(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    userid uuid not null
    references users(id)
    on delete cascade,
    examid uuid not null
    references exam(id)
    on delete cascade,
    score integer not null,
    remaining_time integer not null,
    status exam_user_status not null,
    unique(userid, examid)
);

-- +goose Down
drop table exam_user;