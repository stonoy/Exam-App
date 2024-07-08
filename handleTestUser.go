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

func (cfg *apiConfig) takeTests(w http.ResponseWriter, r *http.Request, user database.User) {
	// get test id as input
	type reqStruct struct {
		TestID string `json:"test_id"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in decoding user response : %v", err))
		return
	}

	// verify the inputs
	if reqObj.TestID == "" {
		respWithError(w, 400, "follow input instructions")
		return
	}

	// parse str to uuid
	TestIDuuid, err := strToUuid(reqObj.TestID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("%v", err))
		return
	}

	// get the test
	test, err := cfg.DB.GetTestById(r.Context(), TestIDuuid)
	if err != nil {
		if err == sql.ErrNoRows {
			respWithError(w, 400, "No such test exists")
		} else {
			respWithError(w, 500, fmt.Sprintf("Error in GetTestById : %v", err))
		}
		return
	}

	// create test user
	test_user, err := cfg.DB.CreateTestUser(r.Context(), database.CreateTestUserParams{
		ID:            uuid.New(),
		CreatedAt:     time.Now().UTC(),
		UpdatedAt:     time.Now().UTC(),
		Userid:        user.ID,
		Testid:        TestIDuuid,
		Score:         0,
		RemainingTime: test.Duration,
		Status:        database.TestUserStatus("available"),
	})
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in CreateTestUser : %v", err))
		return
	}

	// send response
	type respStruct struct {
		Test_Taken_Info Test_User_Pre `json:"test_taken_info"`
	}

	respWithJson(w, 201, respStruct{
		Test_Taken_Info: Test_User_Pre{
			ID:            test_user.ID,
			CreatedAt:     test_user.CreatedAt,
			UpdatedAt:     test_user.UpdatedAt,
			Name:          test.Name,
			Subject:       test.Subject,
			RemainingTime: test_user.RemainingTime,
			Status:        string(test_user.Status),
		},
	})
}

func (cfg *apiConfig) checkTestPresent(w http.ResponseWriter, r *http.Request, user database.User) {
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

	// create empty struct
	type respStruct struct {
		IsPresent       bool          `json:"is_present"`
		Test_Taken_Info Test_User_Pre `json:"test_taken_info"`
	}

	// check tset user is present
	test_user, err := cfg.DB.GetTestUserPresent(r.Context(), database.GetTestUserPresentParams{
		Testid: test.ID,
		Userid: user.ID,
	})
	if err != nil {
		if err == sql.ErrNoRows {
			// send response when test user is not present
			respWithJson(w, 200, respStruct{
				IsPresent:       false,
				Test_Taken_Info: Test_User_Pre{},
			})
		} else {
			respWithError(w, 500, fmt.Sprintf("Error in GetTestUserPresent : %v", err))
		}
		return
	}

	// send response when test user is present
	respWithJson(w, 200, respStruct{
		IsPresent: true,
		Test_Taken_Info: Test_User_Pre{
			ID:            test_user.ID,
			CreatedAt:     test_user.CreatedAt,
			UpdatedAt:     test_user.UpdatedAt,
			Name:          test.Name,
			Subject:       test.Subject,
			RemainingTime: test_user.RemainingTime,
			Status:        string(test_user.Status),
		},
	})
}

func (cfg *apiConfig) setTestPause(w http.ResponseWriter, r *http.Request, user database.User) {
	// get the remaining time from request
	type reqStruct struct {
		RemainingTime string `json:"remaining_time"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in decoding user response : %v", err))
		return
	}

	// convert remaining time to int32
	timeInt32, err := strToInt32(reqObj.RemainingTime)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in strToInt32 : %v", err))
		return
	}

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

	// update test_user status and remaining time when status is available
	test_user, err := cfg.DB.PauseTestUser(r.Context(), database.PauseTestUserParams{
		RemainingTime: timeInt32,
		Status:        database.TestUserStatus("paused"),
		Testid:        test.ID,
		Userid:        user.ID,
		Status_2:      database.TestUserStatus("available"),
	})
	if err != nil {
		if err == sql.ErrNoRows {
			respWithError(w, 400, "No such test taken by user or the test is alreay paused or completed by user")
		} else {
			respWithError(w, 500, fmt.Sprintf("Error in PauseTestUser : %v", err))
		}
		return
	}

	// send response
	type respStruct struct {
		Msg string `json:"msg"`
	}

	respWithJson(w, 200, respStruct{
		Msg: fmt.Sprintf("New status is : %v and remaining time : %v", test_user.Status, test_user.RemainingTime),
	})
}

func (cfg *apiConfig) setTestAvailable(w http.ResponseWriter, r *http.Request, user database.User) {
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

	test_user, err := cfg.DB.RestartTestUser(r.Context(), database.RestartTestUserParams{
		Status:   database.TestUserStatus("available"),
		Testid:   test.ID,
		Userid:   user.ID,
		Status_2: database.TestUserStatus("paused"),
	})
	if err != nil {
		if err == sql.ErrNoRows {
			respWithError(w, 400, "No such test taken by user or the test is alreay available or completed by user")
		} else {
			respWithError(w, 500, fmt.Sprintf("Error in RestartTestUser : %v", err))
		}
		return
	}

	// send response
	type respStruct struct {
		Test_Taken_Info Test_User_Pre `json:"test_taken_info"`
	}

	respWithJson(w, 200, respStruct{
		Test_Taken_Info: Test_User_Pre{
			ID:            test_user.ID,
			CreatedAt:     test_user.CreatedAt,
			UpdatedAt:     test_user.UpdatedAt,
			Name:          test.Name,
			Subject:       test.Subject,
			RemainingTime: test_user.RemainingTime,
			Status:        string(test_user.Status),
		},
	})
}

func (cfg *apiConfig) submitTest(w http.ResponseWriter, r *http.Request, user database.User) {
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

	// get input
	type reqStruct struct {
		Answer_Set []Answer_Set `json:"answer_set"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err = decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in decoding user response : %v", err))
		return
	}

	// initiate score float64
	var final_score int32 = 0

	// evaluate answer by looping answer set array
	for _, answer := range reqObj.Answer_Set {
		isAnswerCorrect, err := cfg.DB.Evaluate(r.Context(), database.EvaluateParams{
			Correct: answer.Answer,
			ID:      answer.QuestionID,
			Testid:  test.ID,
		})
		if err != nil {
			if err == sql.ErrNoRows {
				respWithError(w, 400, "No such question exist")
			} else {
				respWithError(w, 500, fmt.Sprintf("Error in Evaluate : %v", err))
			}
			return
		}

		if isAnswerCorrect {
			final_score += 4
		} else {
			final_score -= 1
		}
	}

	// update test user
	test_user, err := cfg.DB.SubmitTestAndUpdate(r.Context(), database.SubmitTestAndUpdateParams{
		RemainingTime: 0,
		Status:        database.TestUserStatus("completed"),
		Score:         final_score,
		Testid:        test.ID,
		Userid:        user.ID,
		Status_2:      database.TestUserStatus("available"),
	})
	if err != nil {
		if err == sql.ErrNoRows {
			respWithError(w, 400, "No such test taken by user or the test is alreay paused or completed by user")
		} else {
			respWithError(w, 500, fmt.Sprintf("Error in SubmitTestAndUpdate : %v", err))
		}
		return
	}

	// calculate avg_score
	avg_score := (test.TotalParticipents*test.AvgScore + final_score) / (test.TotalParticipents + 1)

	// update test with latest stats
	updated_test, err := cfg.DB.UpdateTest(r.Context(), database.UpdateTestParams{
		AvgScore: avg_score,
		MaxScore: final_score,
		ID:       test.ID,
	})
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in UpdateTest : %v", err))
		return
	}

	// send response
	type respStruct struct {
		Test_Taken_Final_Info Test_User_Post `json:"test_taken_final_info"`
	}

	respWithJson(w, 200, respStruct{
		Test_Taken_Final_Info: Test_User_Post{
			ID:                test_user.ID,
			CreatedAt:         test_user.CreatedAt,
			UpdatedAt:         test_user.UpdatedAt,
			Name:              test.Name,
			Subject:           test.Subject,
			MyScore:           test_user.Score,
			TotalParticipents: updated_test.TotalParticipents,
			AvgScore:          updated_test.AvgScore,
			MaxScore:          updated_test.MaxScore,
			Status:            string(test_user.Status),
		},
	})
}

func (cfg *apiConfig) testsOfUser(w http.ResponseWriter, r *http.Request, user database.User) {
	// get all the tests details of a user where status is completed

	test_users, err := cfg.DB.GetTestsOfUser(r.Context(), database.GetTestsOfUserParams{
		Userid: user.ID,
		Status: database.TestUserStatus("completed"),
	})
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in GetTestsOfUser : %v", err))
		return
	}

	// send response
	type respStruct struct {
		My_Tests []Test_User_Post `json:"my_tests"`
	}

	respWithJson(w, 200, respStruct{
		My_Tests: mytestsDbToResp(test_users),
	})
}
