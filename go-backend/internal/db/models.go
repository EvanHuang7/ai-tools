package db

// Update db.go file for new table migration if adding a new table
type Message struct {
  ID     uint   `gorm:"primaryKey"`
  UserID int    `gorm:"not null"`
  Text   string `gorm:"type:text; not null"`
}
