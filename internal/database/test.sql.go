// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: test.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createTest = `-- name: CreateTest :one
insert into test(id, created_at, updated_at, name, description, subject, duration, total_participents, max_score, avg_score)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
returning id, created_at, updated_at, name, description, subject, duration, total_participents, max_score, avg_score
`

type CreateTestParams struct {
	ID                uuid.UUID
	CreatedAt         time.Time
	UpdatedAt         time.Time
	Name              string
	Description       string
	Subject           string
	Duration          int32
	TotalParticipents int32
	MaxScore          int32
	AvgScore          int32
}

func (q *Queries) CreateTest(ctx context.Context, arg CreateTestParams) (Test, error) {
	row := q.db.QueryRowContext(ctx, createTest,
		arg.ID,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.Name,
		arg.Description,
		arg.Subject,
		arg.Duration,
		arg.TotalParticipents,
		arg.MaxScore,
		arg.AvgScore,
	)
	var i Test
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Description,
		&i.Subject,
		&i.Duration,
		&i.TotalParticipents,
		&i.MaxScore,
		&i.AvgScore,
	)
	return i, err
}

const getAllTests = `-- name: GetAllTests :many
select id, created_at, updated_at, name, description, subject, duration, total_participents, max_score, avg_score from test
where name like $1 and subject like $2
limit $3
offset $4
`

type GetAllTestsParams struct {
	Name    string
	Subject string
	Limit   int32
	Offset  int32
}

func (q *Queries) GetAllTests(ctx context.Context, arg GetAllTestsParams) ([]Test, error) {
	rows, err := q.db.QueryContext(ctx, getAllTests,
		arg.Name,
		arg.Subject,
		arg.Limit,
		arg.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Test
	for rows.Next() {
		var i Test
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Name,
			&i.Description,
			&i.Subject,
			&i.Duration,
			&i.TotalParticipents,
			&i.MaxScore,
			&i.AvgScore,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getNumAllTests = `-- name: GetNumAllTests :one
select count(*) from test
where name like $1 and subject like $2
`

type GetNumAllTestsParams struct {
	Name    string
	Subject string
}

func (q *Queries) GetNumAllTests(ctx context.Context, arg GetNumAllTestsParams) (int64, error) {
	row := q.db.QueryRowContext(ctx, getNumAllTests, arg.Name, arg.Subject)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getTestById = `-- name: GetTestById :one
select id, created_at, updated_at, name, description, subject, duration, total_participents, max_score, avg_score from test where id = $1
`

func (q *Queries) GetTestById(ctx context.Context, id uuid.UUID) (Test, error) {
	row := q.db.QueryRowContext(ctx, getTestById, id)
	var i Test
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Description,
		&i.Subject,
		&i.Duration,
		&i.TotalParticipents,
		&i.MaxScore,
		&i.AvgScore,
	)
	return i, err
}
