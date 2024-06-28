package main

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/google/uuid"
)

func getToken(r *http.Request) (string, error) {
	header := r.Header.Get("Authorization")

	if header == "" {
		return "", fmt.Errorf("no Auth header provided")
	}

	headerArray := strings.Fields(header)

	if len(headerArray) == 2 && headerArray[0] == "Bearer" {
		return headerArray[1], nil
	} else {
		return "", fmt.Errorf("send valid auth header")
	}
}

func strToUuid(idStr string) (uuid.UUID, error) {
	idUUID, err := uuid.Parse(idStr)
	if err != nil {
		return uuid.Nil, fmt.Errorf("error in parsing uuid")
	}

	return idUUID, nil
}

func strToInt32(str string) (int32, error) {
	num, err := strconv.Atoi(str)
	if err != nil {
		return 0, fmt.Errorf("error in converting str to int32")
	}

	return int32(num), nil
}
