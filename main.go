package main

import (
	"database/sql"
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/stonoy/Exam-App/internal/database"
)

//go:embed client/dist/*
var staticFiles embed.FS

type apiConfig struct {
	hits       int
	Jwt_Secret string
	DB         *database.Queries
}

func (cfg *apiConfig) countTheHits(fileServer http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// I want to serve the fileserver root directory for request with any url path except those js,css and png files

		if !strings.HasSuffix(r.URL.Path, ".js") && !strings.HasSuffix(r.URL.Path, ".css") && !strings.HasSuffix(r.URL.Path, ".png") && !strings.HasSuffix(r.URL.Path, ".svg") {
			r.URL.Path = "/"
			cfg.hits++
		}

		fileServer.ServeHTTP(w, r)
	})
}

func (cfg *apiConfig) clientHandler() http.Handler {
	fsys := fs.FS(staticFiles)
	contentStatic, _ := fs.Sub(fsys, "client/dist")
	return cfg.countTheHits(http.FileServer(http.FS(contentStatic)))

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

	// the jwt secret
	jwt_secret := os.Getenv("JWT_SECRET")
	if jwt_secret == "" {
		log.Println("Jwt secret not provided")
	}

	// initiate apiConfig
	apiCfg := &apiConfig{
		hits:       0,
		Jwt_Secret: jwt_secret,
	}

	// get database connection string
	db_uri := os.Getenv("DB_URI")
	if db_uri == "" {
		log.Println("database connection not established")
	} else {
		connection, err := sql.Open("postgres", db_uri)
		if err != nil {
			log.Fatalf("Error in opening sql driver")
		}

		db := database.New(connection)

		apiCfg.DB = db
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

	// make a sub router for api
	apiRouter := chi.NewRouter()

	// check health
	apiRouter.Get("/checkhealth", apiCfg.checkHealth)
	apiRouter.Get("/checkerror", apiCfg.checkError)

	// user
	apiRouter.Post("/register", apiCfg.register)
	apiRouter.Post("/login", apiCfg.login)
	apiRouter.Get("/checkadmin", apiCfg.authMiddleware(apiCfg.checkAdmin))

	// tests
	apiRouter.Post("/createtest", apiCfg.authMiddleware(apiCfg.createTests))
	apiRouter.Get("/tests", apiCfg.getAllTests)
	apiRouter.Delete("/deletetest/{testID}", apiCfg.authMiddleware(apiCfg.deleteTest))

	// test_user
	apiRouter.Post("/taketests", apiCfg.authMiddleware(apiCfg.takeTests))
	apiRouter.Get("/checktestpresent/{testID}", apiCfg.authMiddleware(apiCfg.checkTestPresent))
	apiRouter.Put("/submittest/{testID}", apiCfg.authMiddleware(apiCfg.submitTest))
	apiRouter.Put("/pauseexam/{testID}", apiCfg.authMiddleware(apiCfg.setTestPause))
	apiRouter.Put("/restartexam/{testID}", apiCfg.authMiddleware(apiCfg.setTestAvailable))
	apiRouter.Get("/mytests", apiCfg.authMiddleware(apiCfg.testsOfUser))

	// question
	apiRouter.Post("/createquestions", apiCfg.authMiddleware(apiCfg.createQuestions))
	apiRouter.Get("/testquestions/{testID}", apiCfg.provideQuestionsForTest)

	// mount it on main router
	mainRouter.Mount("/api/v1", apiRouter)

	// provides client
	mainRouter.Handle("/*", apiCfg.clientHandler())

	// configure the server struct
	server := &http.Server{
		Addr:    ":" + port,
		Handler: mainRouter,
	}

	log.Printf("Server is listening on port %v", port)

	log.Fatal(server.ListenAndServe())
}
