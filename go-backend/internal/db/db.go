package db

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
  databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		// Read the secret from file Only if creating a docker secret 
		// within Docker Swarm.
		content, err := os.ReadFile(os.Getenv("DATABASE_URL_FILE"))
		if err != nil {
			log.Fatal(err)
		}
		databaseUrl = string(content)
	}

  var err error
  DB, err = gorm.Open(postgres.Open(databaseUrl), &gorm.Config{})
  if err != nil {
    log.Fatalf("failed to connect to DB: %v", err)
  }

  // Auto migrate the Message table
  if err := DB.AutoMigrate(&Message{}); err != nil {
    log.Fatalf("failed to migrate DB: %v", err)
  }
}
