package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/stonoy/Exam-App/internal/database"
)

type MyCustomClaims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(user database.User, secret string) (string, error) {

	claims := MyCustomClaims{
		string(user.Role),
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "exam1-app",
			Subject:   "any_user",
			ID:        fmt.Sprintf("%v", user.ID),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return ss, nil
}

func ValidateToken(tokenStr, secret string) (string, string, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &MyCustomClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return "", "", fmt.Errorf("%v", err)
	}

	if claims, ok := token.Claims.(*MyCustomClaims); ok && token.Valid {
		return claims.ID, claims.Role, nil
	} else {
		return "", "", fmt.Errorf("token is not valid")
	}
}
