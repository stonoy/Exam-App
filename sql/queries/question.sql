-- name: CreateQuestion :one
insert into question(id, created_at, updated_at, question, option1, option2, option3, option4, correct, examid)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
returning *;