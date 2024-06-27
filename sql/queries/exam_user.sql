-- name: CreateExamUser :one
insert into exam_user(id, created_at, updated_at, examid, userid, score, remaining_time, status)
values ($1, $2, $3, $4, $5, $6, $7, $8)
returning *;
