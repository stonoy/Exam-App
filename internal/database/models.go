// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package database

import (
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type TestUserStatus string

const (
	TestUserStatusAvailable TestUserStatus = "available"
	TestUserStatusPaused    TestUserStatus = "paused"
	TestUserStatusCompleted TestUserStatus = "completed"
)

func (e *TestUserStatus) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = TestUserStatus(s)
	case string:
		*e = TestUserStatus(s)
	default:
		return fmt.Errorf("unsupported scan type for TestUserStatus: %T", src)
	}
	return nil
}

type NullTestUserStatus struct {
	TestUserStatus TestUserStatus
	Valid          bool // Valid is true if TestUserStatus is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullTestUserStatus) Scan(value interface{}) error {
	if value == nil {
		ns.TestUserStatus, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.TestUserStatus.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullTestUserStatus) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.TestUserStatus), nil
}

type UserRole string

const (
	UserRoleStudent UserRole = "student"
	UserRoleAdmin   UserRole = "admin"
)

func (e *UserRole) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = UserRole(s)
	case string:
		*e = UserRole(s)
	default:
		return fmt.Errorf("unsupported scan type for UserRole: %T", src)
	}
	return nil
}

type NullUserRole struct {
	UserRole UserRole
	Valid    bool // Valid is true if UserRole is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullUserRole) Scan(value interface{}) error {
	if value == nil {
		ns.UserRole, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.UserRole.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullUserRole) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.UserRole), nil
}

type Question struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	Question  string
	Option1   string
	Option2   string
	Option3   string
	Option4   string
	Correct   string
	Testid    uuid.UUID
}

type Test struct {
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

type TestUser struct {
	ID            uuid.UUID
	CreatedAt     time.Time
	UpdatedAt     time.Time
	Userid        uuid.UUID
	Testid        uuid.UUID
	Score         int32
	RemainingTime int32
	Status        TestUserStatus
	SecondCounter int32
}

type User struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	Name      string
	Email     string
	Password  string
	Role      UserRole
}
