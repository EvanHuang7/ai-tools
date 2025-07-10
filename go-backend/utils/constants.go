package utils

const (
	GCPProjectID = "steadfast-pivot-462821-p7"

	// GCP pubsub info
	GCPPubSubTopicID = "my-first-topic"

	// GCS info
	GCSBucketName = "ai-tools-gcs-bucket"
	// Video duration in seconds
	VideoDuration = 1
	VideoAspectRatio = "16:9"
	VideoNumber = 1
	VideoPersonGeneration = "dont_allow"
	VeoModel = "veo-2.0-generate-001"
	GCSObjectPublicURLTemplate = "https://storage.googleapis.com/ai-tools-gcs-bucket/%s"

	// Imagekit infi
	GeneratedImageURLTemplate = "https://ik.imagekit.io/%s/ik-genimg-prompt-%s/%s"
	UploadImageAPIURL = "https://upload.imagekit.io/api/v1/files/upload"

	// App features monthly usage limit
	FreeUserImageFeatureMonthlyLimit = 2
	StandardUserImageFeatureMonthlyLimit = 3
	ProUserImageFeatureMonthlyLimit = 5
)