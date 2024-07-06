package main

import (
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/Exam-App/internal/database"
)

type User struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
	Role  string    `json:"role"`
}

type Test struct {
	ID                uuid.UUID `json:"id"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	Name              string    `json:"name"`
	Description       string    `json:"description"`
	Subject           string    `json:"subject"`
	Duration          int32     `json:"duration"`
	TotalParticipents int32     `json:"total_participents"`
	MaxScore          int32     `json:"max_score"`
	AvgScore          int32     `json:"avg_score"`
}

type Test_User_Pre struct {
	ID            uuid.UUID `json:"id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Name          string    `json:"name"`
	Subject       string    `json:"subject"`
	RemainingTime int32     `json:"remaining_time"`
	Status        string    `json:"status"`
}

type Test_User_Post struct {
	ID                uuid.UUID `json:"id"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	Name              string    `json:"name"`
	Subject           string    `json:"subject"`
	MyScore           int32     `json:"my_score"`
	TotalParticipents int32     `json:"total_participents"`
	MaxScore          int32     `json:"max_score"`
	AvgScore          int32     `json:"avg_score"`
	Status            string    `json:"status"`
}

type Question struct {
	ID       uuid.UUID `json:"id"`
	Question string    `json:"question"`
	Option1  string    `json:"option1"`
	Option2  string    `json:"option2"`
	Option3  string    `json:"option3"`
	Option4  string    `json:"option4"`
	Testid   uuid.UUID `json:"test_id"`
}

type Answer_Set struct {
	QuestionID uuid.UUID `json:"question_id"`
	Answer     string    `json:"answer"`
}

func testsDbToResp(allDbTests []database.Test) []Test {
	allTests := []Test{}

	for _, test := range allDbTests {
		allTests = append(allTests, Test{
			ID:                test.ID,
			CreatedAt:         test.CreatedAt,
			UpdatedAt:         test.UpdatedAt,
			Name:              test.Name,
			Description:       test.Description,
			Subject:           test.Subject,
			Duration:          test.Duration,
			TotalParticipents: test.TotalParticipents,
			MaxScore:          test.MaxScore,
			AvgScore:          test.AvgScore,
		})
	}

	return allTests
}

func questionsDbToResp(DbQuestions []database.Question) []Question {
	allQuestions := []Question{}

	for _, question := range DbQuestions {
		allQuestions = append(allQuestions, Question{
			ID:       question.ID,
			Question: question.Question,
			Option1:  question.Option1,
			Option2:  question.Option2,
			Option3:  question.Option3,
			Option4:  question.Option4,
			Testid:   question.Testid,
		})
	}

	return allQuestions
}
