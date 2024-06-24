package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

type apiConfig struct {
	hits int
}

func main() {
	// load the env file
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading env file, going for default config... : %v", err)
	}

	// the port
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT is not assigned")
	}

	// initiate apiConfig
	apiCfg := &apiConfig{
		hits: 0,
	}

	// main router
	mainRouter := chi.NewRouter()

	// make the router cors enable
	mainRouter.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	mainRouter.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome!"))
	})

	// make a sub router for api
	apiRouter := chi.NewRouter()

	// check health
	apiRouter.Get("/checkhealth", apiCfg.checkHealth)
	apiRouter.Get("/checkerror", apiCfg.checkError)

	// mount it on main router
	mainRouter.Mount("/api/v1", apiRouter)

	// configure the server struct
	server := &http.Server{
		Addr:    ":" + port,
		Handler: mainRouter,
	}

	log.Printf("Server is listening on port %v", port)

	log.Fatal(server.ListenAndServe())
}
