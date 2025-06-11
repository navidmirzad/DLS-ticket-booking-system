#!/bin/bash

# Build and push customer frontend
docker build \
  --build-arg VITE_STRIPE_PUBLIC_KEY=$(kubectl get secret stripe-secret -n ticket-system -o jsonpath='{.data.STRIPE_PUBLIC_KEY}' | base64 --decode) \
  -t samimms/customer-frontend:latest \
  ./customer_frontend

# Build and push admin frontend
docker build \
  --build-arg VITE_LOGIN_URL=http://localhost:3000/api/auth/login \
  --build-arg VITE_ADMIN_BACKEND_URL=http://localhost:3001 \
  --build-arg VITE_VALIDATE_TOKEN_URL=http://localhost:3000/api/auth/validate \
  -t samimms/admin-frontend:latest \
  ./admin_frontend

# Push the images
docker push samimms/customer-frontend:latest
docker push samimms/admin-frontend:latest 