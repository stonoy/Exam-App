-- +goose Up
create table question(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    question text not null,
    option1 text not null,
    option2 text not null,
    option3 text not null,
    option4 text not null,
    correct text not null,
    examid uuid not null
    references exam(id)
    on delete cascade
);

-- +goose Down
drop table question;