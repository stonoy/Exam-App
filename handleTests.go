package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/Exam-App/internal/database"
)

func (cfg *apiConfig) createTests(w http.ResponseWriter, r *http.Request, user database.User) {
	// check user is admin
	if string(user.Role) != "admin" {
		respWithError(w, 403, "Not Authorised")
		return
	}

	// get the request inputs
	type reqStruct struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Subject     string `json:"subject"`
		Duration    string `json:"duration"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in decoding user response : %v", err))
		return
	}

	// verify the inputs
	if reqObj.Name == "" || reqObj.Subject == "" || reqObj.Description == "" || reqObj.Duration == "" {
		respWithError(w, 400, "Follow input instructions")
		return
	}

	// convert duration str to int
	durationInt32, err := strToInt32(reqObj.Duration)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("%v", err))
		return
	}

	// create test with default settings
	test, err := cfg.DB.CreateTest(r.Context(), database.CreateTestParams{
		ID:                uuid.New(),
		CreatedAt:         time.Now().UTC(),
		UpdatedAt:         time.Now().UTC(),
		Name:              reqObj.Name,
		Description:       reqObj.Description,
		Subject:           reqObj.Subject,
		Duration:          durationInt32,
		TotalParticipents: 0,
		MaxScore:          0,
		AvgScore:          0,
	})
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in CreateTest : %v", err))
		return
	}

	// send response
	type respStruct struct {
		Msg string `json:"msg"`
	}

	respWithJson(w, 201, respStruct{
		Msg: fmt.Sprintf("Test created with Id : %v", test.ID),
	})
}

func (cfg *apiConfig) getAllTests(w http.ResponseWriter, r *http.Request) {
	// get the query params
	queryParams := r.URL.Query()

	pageQ := queryParams.Get("page")
	nameQ := queryParams.Get("name")
	subjectQ := queryParams.Get("subject")

	// convert page to int32
	pageInt, err := strToInt32(pageQ)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("can not convert page str to int32 : %v", err))
		return
	}

	// initiate search params
	name := "%%"
	subject := "%%"

	if nameQ != "" {
		name = "%" + nameQ + "%"
	}

	if subjectQ != "" {
		subject = "%" + subjectQ + "%"
	}

	// set pagination
	var limit int32 = 2
	offset := limit * (pageInt - 1)

	// get the filtered tests
	tests, err := cfg.DB.GetAllTests(r.Context(), database.GetAllTestsParams{
		Name:    name,
		Subject: subject,
		Limit:   limit,
		Offset:  offset,
	})
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in GetAllTests : %v", err))
		return
	}

	// get the num of filtered tests
	numOfTests, err := cfg.DB.GetNumAllTests(r.Context(), database.GetNumAllTestsParams{
		Name:    name,
		Subject: subject,
	})
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in GetNumAllTests : %v", err))
		return
	}

	numOfPages := math.Ceil(float64(numOfTests) / float64(limit))

	// send response
	type respStruct struct {
		AllTest    []Test  `json:"allTests"`
		NumOfPages float64 `json:"numOfPages"`
		Page       int32   `json:"page"`
	}

	respWithJson(w, 200, respStruct{
		AllTest:    testsDbToResp(tests),
		NumOfPages: numOfPages,
		Page:       pageInt,
	})
}

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
