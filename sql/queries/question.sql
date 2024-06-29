-- name: CreateQuestion :one
insert into question(id, created_at, updated_at, question, option1, option2, option3, option4, correct, testid)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
returning *;

-- name: GetAllQuestionsTest :many
select * from question
where testid = $1;

-- name: Evaluate :one
select
case
	when correct = $1 then true
	else false
	end as evaluate
from question where id = $2 and testid = $3;