package main

import (
	"fmt"
	"net/http"

	"github.com/stonoy/Exam-App/auth"
	"github.com/stonoy/Exam-App/internal/database"
)

type forUsersOnly func(w http.ResponseWriter, r *http.Request, user database.User)

func (cfg *apiConfig) authMiddleware(givenFunc forUsersOnly) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// get the token from auth header
		token, err := getToken(r)
		if err != nil {
			respWithError(w, 401, fmt.Sprintf("Error in getToken : %v", err))
			return
		}

		// verify the token and get user id
		userIDstr, _, err := auth.ValidateToken(token, cfg.Jwt_Secret)
		if err != nil {
			respWithError(w, 401, fmt.Sprintf("Error in validate token : %v", err))
			return
		}

		// parse the id
		userIDuuid, err := strToUuid(userIDstr)
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("%v", err))
			return
		}

		// get the user
		user, err := cfg.DB.GetUserByID(r.Context(), userIDuuid)
		if err != nil {
			respWithError(w, 401, fmt.Sprintf("Error in GetUserByID : %v", err))
			return
		}

		// call givenFunc
		givenFunc(w, r, user)
	}
}
