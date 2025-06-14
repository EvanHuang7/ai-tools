package db

type Message struct {
  ID     uint   `gorm:"primaryKey"`
  UserID int    `gorm:"not null"`
  Text   string `gorm:"type:text; not null"`
}
