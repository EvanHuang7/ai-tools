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

    var usageRecord db.ImageFeatureMonthlyUsage
    err :=  db.DB.Where("user_id = ? AND month_and_year = ?", userID, monthStart).
        First(&usageRecord).Error

    if errors.Is(err, gorm.ErrRecordNotFound) {
        return 0, nil
    }
    if err != nil {
        return 0, err
    }

    return usageRecord.Usage, nil
}

// Increase user image feature monthly usage or create a record if no exsit