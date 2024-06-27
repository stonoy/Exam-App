-- +goose Up
create type exam_user_status as enum ('available', 'paused', 'completed');