package service

import (
	"errors"

	"gorm.io/gorm"

	"go-backend/db"
	"go-backend/utils"
)

// Get user image feature monthly usage
func GetImageFeatureMonthlyUsage(userID string) (int, error) {
	monthStart := utils.GetCurrentYearAndMonthStart()

	// Check current usage record
	var usageRecord db.AppFeatureMonthlyUsage
	err := db.DB.Where("user_id = ? AND month_and_year = ?", userID, monthStart).
		First(&usageRecord).Error

	// If no record found or get data query errors, return 0
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}

	return usageRecord.ImageUsage, nil
}

// Increase user image feature monthly usage or create a record if no exist
func IncrementImageFeatureMonthlyUsage(userID string, count int) error {
	monthStart := utils.GetCurrentYearAndMonthStart()

	// Check current usage record
	var usageRecord db.AppFeatureMonthlyUsage
	err := db.DB.Where("user_id = ? AND month_and_year = ?", userID, monthStart).
		First(&usageRecord).Error

	// Create a record if not exist
	if errors.Is(err, gorm.ErrRecordNotFound) {
		usageRecord = db.AppFeatureMonthlyUsage{
			UserID:       userID,
			ImageUsage:   count,
			VideoUsage:   0,
			MonthAndYear: monthStart,
		}
		return db.DB.Create(&usageRecord).Error
	} else if err != nil {
		return err
	}

	// Increment usage if exist
	usageRecord.ImageUsage += count
	return db.DB.Save(&usageRecord).Error
}

// Get user video feature monthly usage
func GetVideoFeatureMonthlyUsage(userID string) (int, error) {
	monthStart := utils.GetCurrentYearAndMonthStart()

	// Check current usage record
	var usageRecord db.AppFeatureMonthlyUsage
	err := db.DB.Where("user_id = ? AND month_and_year = ?", userID, monthStart).
		First(&usageRecord).Error

	// If no record found or get data query errors, return 0
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}

	return usageRecord.VideoUsage, nil
}

// Increase user video feature monthly usage or create a record if no exist
func IncrementVideoFeatureMonthlyUsage(userID string, count int) error {
	monthStart := utils.GetCurrentYearAndMonthStart()

	// Check current usage record
	var usageRecord db.AppFeatureMonthlyUsage
	err := db.DB.Where("user_id = ? AND month_and_year = ?", userID, monthStart).
		First(&usageRecord).Error

	// Create a record if not exist
	if errors.Is(err, gorm.ErrRecordNotFound) {
		usageRecord = db.AppFeatureMonthlyUsage{
			UserID:       userID,
			ImageUsage:   0,
			VideoUsage:   count,
			MonthAndYear: monthStart,
		}
		return db.DB.Create(&usageRecord).Error
	} else if err != nil {
		return err
	}

	// Increment usage if exist
	usageRecord.VideoUsage += count
	return db.DB.Save(&usageRecord).Error
}