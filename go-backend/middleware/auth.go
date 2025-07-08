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
			claims, ok := clerk.SessionClaimsFromContext(r.Context())
			if !ok {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized: no session"})
				return
			}

			// Attach Clerk user ID to Gin context
			c.Set("userId", claims.Subject)
			c.Next()
		}))

		// Adapt to Clerk's handler
		clerkHandler.ServeHTTP(c.Writer, c.Request)
	}
}
