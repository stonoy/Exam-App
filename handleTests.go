package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
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
		Test Test `json:"test"`
	}

	respWithJson(w, 201, respStruct{
		Test: Test{
			ID:                test.ID,
			CreatedAt:         test.CreatedAt,
			UpdatedAt:         test.UpdatedAt,
			Name:              test.Name,
			Subject:           test.Subject,
			Description:       test.Description,
			TotalParticipents: test.TotalParticipents,
			MaxScore:          test.MaxScore,
			AvgScore:          test.AvgScore,
			Duration:          test.Duration,
		},
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

func (cfg *apiConfig) deleteTest(w http.ResponseWriter, r *http.Request, user database.User) {
	// check user is admin
	if string(user.Role) != "admin" {
		respWithError(w, 403, "Not Authorised")
		return
	}

	// get the test id from url
	testIdStr := chi.URLParam(r, "testID")

	// convert id to uuid
	testId, err := strToUuid(testIdStr)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in strToUuid : %v", err))
		return
	}

	// delete test
	test, err := cfg.DB.DeleteTest(r.Context(), testId)
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in DeleteTest : %v", err))
		return
	}

	type respStruct struct {
		Msg string `json:"msg"`
	}

	respWithJson(w, 200, fmt.Sprintf("test id : %v deleted", test.ID))
}
