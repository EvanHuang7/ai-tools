package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"go-backend/utils"
)

var DB *gorm.DB

func Init() {
	databaseUrl := utils.GetEnvOrFile("DATABASE_URL")

	var err error
	DB, err = gorm.Open(postgres.Open(databaseUrl), &gorm.Config{})
	if err != nil {
	log.Fatalf("failed to connect to DB: %v", err)
	}

	// Auto migrate the Message table
	if err := DB.AutoMigrate(&Message{}, &Image{}, &Video{}); err != nil {
	log.Fatalf("failed to migrate DB: %v", err)
	}
}
