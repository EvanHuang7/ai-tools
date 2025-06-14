package db

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
  dsn := os.Getenv("DATABASE_URL")
  var err error
  DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
  if err != nil {
    log.Fatalf("failed to connect to DB: %v", err)
  }

  // Auto migrate the Message table
  if err := DB.AutoMigrate(&Message{}); err != nil {
    log.Fatalf("failed to migrate DB: %v", err)
  }
}
