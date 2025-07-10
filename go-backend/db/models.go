package db

import "time"

// Note: Update "db.go file" for new table migration if adding a new table
type Message struct {
  ID     uint   `gorm:"primaryKey"`
  UserID int    `gorm:"not null"`
  Text   string `gorm:"type:text; not null"`
}

type Image struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    string    `gorm:"not null"`
	Prompt    string    `gorm:"type:text; not null"`
	ImageURL  string    `gorm:"type:text; not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Video struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    string    `gorm:"not null"`
	Prompt    string    `gorm:"type:text; not null"`
	ImageURL  string    `gorm:"type:text; not null"`
  	VideoDuration int   `gorm:"not null"`
  	VideoURL  string    `gorm:"type:text; not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type AppFeatureMonthlyUsage struct {
	ID           uint      `gorm:"primaryKey"`
	UserID       string    `gorm:"type:varchar(255);not null;index:idx_user_month,unique"`
	ImageUsage   int       `gorm:"not null"`
	VideoUsage   int       `gorm:"not null"`
	MonthAndYear time.Time `gorm:"not null;index:idx_user_month,unique"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}