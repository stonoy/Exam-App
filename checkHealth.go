package main

import "net/http"

func (cfg *apiConfig) checkError(w http.ResponseWriter, r *http.Request) {
	respWithError(w, 200, "Error Ok")
}

func (cfg *apiConfig) checkHealth(w http.ResponseWriter, r *http.Request) {
	type respStruct struct {
		Msg string `json:"msg"`
	}

	respWithJson(w, 200, respStruct{
		Msg: "Health Ok",
	})
}
