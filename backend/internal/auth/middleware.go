package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"
)

type contextKey string

const (
	UserContextKey contextKey = "user"
)

// UserClaims represents the user information stored in the request context
type UserClaims struct {
	UserID int
	Role   string
}

// Middleware handles JWT authentication for protected routes
type Middleware struct {
	jwtService *JWTService
}

// NewMiddleware creates a new authentication middleware
func NewMiddleware(jwtService *JWTService) *Middleware {
	return &Middleware{
		jwtService: jwtService,
	}
}

// Authenticate middleware validates JWT tokens and sets user information in context
func (m *Middleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Check Bearer token format
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
			return
		}

		// Validate token
		claims, err := m.jwtService.ValidateToken(parts[1])
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Check token type
		if claims.Type != AccessToken {
			http.Error(w, "Invalid token type", http.StatusUnauthorized)
			return
		}

		// Add user claims to request context
		ctx := context.WithValue(r.Context(), UserContextKey, UserClaims{
			UserID: claims.UserID,
			Role:   claims.Role,
		})

		// Call the next handler with the updated context
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// RequireRole returns a middleware that ensures the user has the required role
func (m *Middleware) RequireRole(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := r.Context().Value(UserContextKey).(UserClaims)
			if !ok {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			if claims.Role != role && claims.Role != "admin" {
				http.Error(w, "Insufficient permissions", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (m *Middleware) RequireWorkspaceAccess(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get our handler context
		ctx := context.GetHandlerContext(r)
		if ctx == nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// If no workspace in context, allow the request (might be a non-workspace endpoint)
		if ctx.Workspace == nil {
			next.ServeHTTP(w, r)
			return
		}

		// Check if user has access (either owner or admin)
		if ctx.Workspace.UserID != ctx.UserID && ctx.UserRole != "admin" {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// GetUserFromContext retrieves user claims from the request context
func GetUserFromContext(ctx context.Context) (*UserClaims, error) {
	claims, ok := ctx.Value(UserContextKey).(UserClaims)
	if !ok {
		return nil, fmt.Errorf("no user found in context")
	}
	return &claims, nil
}
