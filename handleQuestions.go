package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/stonoy/Exam-App/internal/database"
)

func (cfg *apiConfig) createQuestions(w http.ResponseWriter, r *http.Request, user database.User) {
	// check for admin
	if string(user.Role) != "admin" {
		respWithError(w, 403, "not authorised")
		return
	}

	// get request inputs
	type reqStruct struct {
		Question string `json:"question"`
		Option1  string `json:"option1"`
		Option2  string `json:"option2"`
		Option3  string `json:"option3"`
		Option4  string `json:"option4"`
		Correct  string `json:"correct"`
		Testid   string `json:"test_id"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in decoding user response : %v", err))
		return
	}

	// convert str to uuid
	idUuid, err := strToUuid(reqObj.Testid)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("%v", err))
		return
	}

	// check the test exists
	test, err := cfg.DB.GetTestById(r.Context(), idUuid)
	if err != nil {
		if err == sql.ErrNoRows {
			respWithError(w, 400, "No such test exists")
		} else {
			respWithError(w, 500, fmt.Sprintf("Error in GetTestById : %v", err))
		}
		return
	}

	// create question
	question, err := cfg.DB.CreateQuestion(r.Context(), database.CreateQuestionParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Question:  reqObj.Question,
		Option1:   reqObj.Option1,
		Option2:   reqObj.Option2,
		Option3:   reqObj.Option3,
		Option4:   reqObj.Option4,
		Correct:   reqObj.Correct,
		Testid:    test.ID,
	})
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in CreateQuestion : %v", err))
		return
	}

	// send response
	type respStruct struct {
		Msg string `json:"msg"`
	}

	respWithJson(w, 201, respStruct{
		Msg: fmt.Sprintf("Question created with id : %v", question.ID),
	})
}

func (cfg *apiConfig) provideQuestionsForTest(w http.ResponseWriter, r *http.Request) {
	// get url param
	testIdStr := chi.URLParam(r, "testID")

	// convert str to uuid
	testIdUuid, err := strToUuid(testIdStr)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("%v", err))
		return
	}

	// check if the test exists
	test, err := cfg.DB.GetTestById(r.Context(), testIdUuid)
	if err != nil {
		if err == sql.ErrNoRows {
			respWithError(w, 400, "No such test exists")
		} else {
			respWithError(w, 500, fmt.Sprintf("Error in GetTestById : %v", err))
		}
		return
	}

	// get all questions
	questions, err := cfg.DB.GetAllQuestionsTest(r.Context(), test.ID)
	if err != nil {
		respWithError(w, 200, fmt.Sprintf("Error in GetAllQuestionsTest : %v", err))
		return
	}

	// send response
	type respStruct struct {
		AllQuestions []Question `json:"allQuestions"`
	}

	respWithJson(w, 200, respStruct{
		AllQuestions: questionsDbToResp(questions),
	})
}
