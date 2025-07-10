package middleware

import (
	"net/http"

	clerk "github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/gin-gonic/gin"

	"go-backend/utils"
)

func ClerkMiddleware() gin.HandlerFunc {
	clerk.SetKey(utils.GetEnvOrFile("CLERK_SECRET_KEY"))

	return func(c *gin.Context) {
		// Wrap Gin request using Clerk’s built-in HTTP middleware
		clerkHandler := clerkhttp.WithHeaderAuthorization()(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get claims via Clerk go sdk for getting userId
			claims, ok := clerk.SessionClaimsFromContext(r.Context())
			if !ok {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: no session"})
				return
			}

			// Decode raw JWT to extract V2 claims including Clerk user subscription plan
			tokenStr := c.GetHeader("Authorization")[7:] // remove "Bearer "
			v2Claims, err := utils.ParseJWT(tokenStr)
			if err != nil {
				c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
				return
			}

			// Get userPlan from V2 claims
			userPlan, err := utils.ExtractUserPlan(v2Claims)
			if err != nil {
				c.AbortWithStatusJSON(500, gin.H{"error": "failed to extract user plan"})
				return
			} 

			// Attach Clerk userId and userPlan to Gin context
			c.Set("userId", claims.Subject)
			c.Set("userPlan", userPlan)
			c.Next()
		}))

		// Adapt to Clerk's handler
		clerkHandler.ServeHTTP(c.Writer, c.Request)
	}
}
