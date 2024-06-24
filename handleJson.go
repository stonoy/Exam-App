package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func respWithError(w http.ResponseWriter, code int, msg string) {
	type respStruct struct {
		Msg string `json:"msg"`
	}

	if code > 499 {
		log.Printf("code : %v and Msg : %v", code, msg)
	}

	respWithJson(w, code, respStruct{
		Msg: msg,
	})
}

func respWithJson(w http.ResponseWriter, code int, payload interface{}) {
	// convert payload to byte
	dataByte, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Can not marshal payload : %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(dataByte)
}
