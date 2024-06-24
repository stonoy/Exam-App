-- +goose Up
create type user_role as enum ('student', 'admin');