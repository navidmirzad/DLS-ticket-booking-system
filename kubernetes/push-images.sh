docker login

# 2. Build all service images
docker build -t samimms/auth-service:latest ./auth_service
docker build -t samimms/admin-backend:latest ./admin_backend
docker build -t samimms/admin-frontend:latest ./admin_frontend
docker build -t samimms/customer-backend:latest ./customer_backend
docker build -t samimms/customer-frontend:latest ./customer_frontend
docker build -t samimms/mail-service:latest ./mail_service
docker build -t samimms/admin-sync-service:latest ./admin_sync_service
docker build -t samimms/customer-sync-service:latest ./customer_sync_service

# 3. Push all images to Docker Hub
docker push samimms/auth-service:latest
docker push samimms/admin-backend:latest
docker push samimms/admin-frontend:latest
docker push samimms/customer-backend:latest
docker push samimms/customer-frontend:latest
docker push samimms/mail-service:latest
docker push samimms/admin-sync-service:latest
docker push samimms/customer-sync-service:latest