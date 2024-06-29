-- name: CreateTest :one
insert into test(id, created_at, updated_at, name, description, subject, duration, total_participents, max_score, avg_score)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
returning *;

-- name: GetTestById :one
select * from test where id = $1;

-- name: GetAllTests :many
select * from test
where name like $1 and subject like $2
limit $3
offset $4;

-- name: GetNumAllTests :one
select count(*) from test
where name like $1 and subject like $2;

-- name: UpdateTest :one
update test
set total_participents = total_participents + 1,
updated_at = NOW(),
avg_score = $1,
max_score = GREATEST(max_score, $2)
where id = $3
returning *;