package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/Exam-App/auth"
	"github.com/stonoy/Exam-App/internal/database"
)

func (cfg *apiConfig) register(w http.ResponseWriter, r *http.Request) {
	// get the user inputs
	type reqStruct struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in decoding user response : %v", err))
		return
	}

	// verify the inputs
	if reqObj.Email == "" || reqObj.Name == "" || (reqObj.Password == "" || len(reqObj.Password) < 6) {
		respWithError(w, 400, "Enter valid input")
		return
	}

	// hash password
	hashedPassword, err := auth.HashPassword(reqObj.Password)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in hashing password : %v", err))
		return
	}

	// set user role
	isAdmin, err := cfg.DB.AdminAvailable(r.Context())
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in AdminAvailable : %v", err))
		return
	}

	userRole := "student"
	if isAdmin {
		userRole = "admin"
	}

	// create user
	user, err := cfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Name:      reqObj.Name,
		Email:     reqObj.Email,
		Password:  hashedPassword,
		Role:      database.UserRole(userRole),
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in CreateUser : %v", err))
		return
	}

	// get token
	token, err := auth.GenerateToken(user, cfg.Jwt_Secret)
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in GenerateToken : %v", err))
		return
	}

	type respStruct struct {
		ID    uuid.UUID `json:"id"`
		Token string    `json:"token"`
	}

	// send response
	respWithJson(w, 201, respStruct{
		ID:    user.ID,
		Token: token,
	})
}

func (cfg *apiConfig) login(w http.ResponseWriter, r *http.Request) {
	// get the user inputs
	type reqStruct struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error in decoding user response : %v", err))
		return
	}

	// verify the inputs
	if reqObj.Email == "" || (reqObj.Password == "" || len(reqObj.Password) < 6) {
		respWithError(w, 400, "Enter valid input")
		return
	}

	// check user exist
	user, err := cfg.DB.GetUserByEmail(r.Context(), reqObj.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			respWithError(w, 400, "No user exist with the email")

		} else {
			respWithError(w, 500, fmt.Sprintf("Error in GetUserByEmail : %v", err))
		}
		return
	}

	// compare the password
	hasPasswordMatched := auth.ComparePassword(reqObj.Password, user.Password)
	if !hasPasswordMatched {
		respWithError(w, 400, "Password not matched")
		return
	}

	// generate token for user
	token, err := auth.GenerateToken(user, cfg.Jwt_Secret)
	if err != nil {
		respWithError(w, 500, fmt.Sprintf("Error in GenerateToken : %v", err))
		return
	}

	// send response
	type respStruct struct {
		User  User   `json:"user"`
		Token string `json:"token"`
	}

	respWithJson(w, 200, respStruct{
		User: User{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  string(user.Role),
		},
		Token: token,
	})
}

func (cfg *apiConfig) checkAdmin(w http.ResponseWriter, r *http.Request, user database.User) {
	// check user is admin
	if string(user.Role) != "admin" {
		respWithError(w, 403, "Not Authorised")
		return
	}

	type respStruct struct {
		Msg string `json:"msg"`
	}

	respWithJson(w, 200, respStruct{
		Msg: "Welcome Admin",
	})
}
