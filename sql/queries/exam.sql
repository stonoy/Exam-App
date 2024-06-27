-- name: CreateExam :one
insert into exam(id, created_at, updated_at, name, description, subject, duration, total_participents, max_score, avg_score)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
returning *;