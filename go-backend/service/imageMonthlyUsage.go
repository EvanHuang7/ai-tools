package service

import (
	"errors"
	"time"

	"gorm.io/gorm"

	"go-backend/db"
	"go-backend/utils"
)

// Get user image feature monthly usage
func GetImageFeatureMonthlyUsage(userID string) (int, error) {
    monthStart := utils.GetCurrentYearAndMonthStart(time.Now())

	// Check current usage record
    var usageRecord db.ImageFeatureMonthlyUsage
    err :=  db.DB.Where("user_id = ? AND month_and_year = ?", userID, monthStart).
        First(&usageRecord).Error

	// If no record found or get data query errors, return 0
    if errors.Is(err, gorm.ErrRecordNotFound) {
        return 0, nil
    }
    if err != nil {
        return 0, err
    }

    return usageRecord.Usage, nil
}

// Increase user image feature monthly usage or create a record if no exsit
func IncrementImageFeatureMonthlyUsage(userID string, count int) error {
    monthStart := utils.GetCurrentYearAndMonthStart(time.Now())

	// Check current usage record
    var usageRecord db.ImageFeatureMonthlyUsage
    err := db.DB.Where("user_id = ? AND month_and_year = ?", userID, monthStart).
        First(&usageRecord).Error

	// Create a record if not exist
    if errors.Is(err, gorm.ErrRecordNotFound) {
        usageRecord = db.ImageFeatureMonthlyUsage{
            UserID:       userID,
            Usage:        count,
            MonthAndYear: monthStart,
        }
        return db.DB.Create(&usageRecord).Error
    } else if err != nil {
        return err
    }

    // Increment usage if exist
    usageRecord.Usage += count
    return db.DB.Save(&usageRecord).Error
}