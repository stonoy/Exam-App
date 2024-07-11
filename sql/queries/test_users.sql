-- name: CreateTestUser :one
insert into test_user(id, created_at, updated_at, testid, userid, score, remaining_time, status)
values ($1, $2, $3, $4, $5, $6, $7, $8)
returning *;

-- name: GetTestUserPresent :one
select * from test_user where testid = $1 and userid = $2;

-- name: PauseTestUser :one
update test_user
set remaining_time = $1,
status = $2,
second_counter = $3
where testid = $4 and userid = $5 and status = $6
returning *;

-- name: RestartTestUser :one
update test_user
set status = $1
where testid = $2 and userid = $3 and status = $4
returning *;

-- name: SubmitTestAndUpdate :one
update test_user
set remaining_time = $1,
status = $2,
score = $3,
second_counter = $4
where testid = $5 and userid = $6 and status = $7
returning *;

-- name: GetTestsOfUser :many
select tu.*, t.* from test_user tu
inner join test t on tu.testid = t.id
where tu.userid = $1 and tu.status = $2;