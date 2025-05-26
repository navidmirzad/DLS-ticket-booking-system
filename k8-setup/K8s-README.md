# Kubernetes Migration Guide for DLS Ticket Booking System

This guide will help team members transition from Docker Compose to our new Kubernetes deployment.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop with Kubernetes enabled
- kubectl installed and configured
- Access to our Docker Hub repository: `danieljappe1/`

### First-Time Setup
1. **Enable Kubernetes in Docker Desktop**
    - Open Docker Desktop → Settings → Kubernetes
    - Check "Enable Kubernetes" → Apply & Restart
    - Wait 5-10 minutes for installation

2. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd DLS-ticket-booking-system
   git checkout kubernetes-migration
   cd k8s-setup
   ```

3. **Deploy the Application**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## 📋 Application Architecture

Our microservices now run on Kubernetes with the following components:

### Services
- **Auth Service** (Port 30000): User authentication and JWT tokens
- **Admin Backend** (Port 30001): Admin API and event management
- **Customer Backend** (Port 30002): Customer API and booking system
- **Admin Frontend** (Port 30081): Admin dashboard
- **Customer Frontend** (Port 30080): Customer booking interface
- **Mail Service** (Port 30003): Email notifications
- **Admin Sync Service**: Syncs data from MySQL to RabbitMQ
- **Customer Sync Service**: Syncs data from RabbitMQ to MongoDB

### Infrastructure
- **MySQL**: Admin backend database
- **MongoDB**: Customer backend database
- **MongoDB Auth**: Authentication database
- **RabbitMQ**: Message queue for service communication
- **Prometheus**: Monitoring and metrics

## 🌐 Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Customer Frontend | http://localhost:30080 | Main booking interface |
| Admin Frontend | http://localhost:30081 | Admin dashboard |
| RabbitMQ Management | http://localhost:31567 | Queue monitoring (admin/admin) |
| Auth API | http://localhost:30000 | Authentication endpoints |
| Admin API | http://localhost:30001 | Admin backend API |
| Customer API | http://localhost:30002 | Customer backend API |

## 🛠️ Daily Operations

### Starting the Application
```bash
# From k8s-setup directory
./deploy.sh

# Or manually
kubectl apply -f docker-desktop-k8s.yaml
```

### Checking Application Status
```bash
# View all pods
kubectl get pods -n microservices

# Check services
kubectl get services -n microservices

# Watch pods in real-time
kubectl get pods -n microservices -w
```

### Viewing Logs
```bash
# View logs for a specific service
kubectl logs deployment/admin-backend -n microservices --tail=20

# Follow logs in real-time
kubectl logs deployment/auth-service -n microservices -f

# View logs from multiple pods
kubectl logs -l app=customer-backend -n microservices
```

### Restarting Services
```bash
# Restart a specific service
kubectl rollout restart deployment/admin-backend -n microservices

# Wait for restart to complete
kubectl rollout status deployment/admin-backend -n microservices
```

### Scaling Services
```bash
# Scale a service up/down
kubectl scale deployment customer-backend --replicas=3 -n microservices

# Check current replicas
kubectl get deployment customer-backend -n microservices
```

## 🔧 Development Workflow

### Making Code Changes
1. **Update your code**
2. **Rebuild Docker image**
   ```bash
   docker build -t danieljappe1/service-name:v1.x ./service_directory
   ```
3. **Push to Docker Hub**
   ```bash
   docker push danieljappe1/service-name:v1.x
   ```
4. **Update Kubernetes deployment**
   ```bash
   kubectl set image deployment/service-name service-name=danieljappe1/service-name:v1.x -n microservices
   ```

### Frontend Development
Frontend services require build arguments for environment variables:

```bash
# Admin Frontend
docker build \
  --build-arg VITE_LOGIN_URL="http://localhost:30000/api/auth/login" \
  --build-arg VITE_ADMIN_BACKEND_URL="http://localhost:30001/api/admin" \
  --build-arg VITE_VALIDATE_TOKEN_URL="http://localhost:30000/api/auth/me" \
  -t danieljappe1/admin-frontend:v1.x \
  ./admin_frontend

# Customer Frontend  
docker build \
  --build-arg VITE_CUSTOMER_BACKEND_URL="http://localhost:30002" \
  -t danieljappe1/customer-frontend:v1.x \
  ./customer_frontend
```

### Environment Variables
Key environment variables are managed through Kubernetes ConfigMaps and Secrets:
- Database connections use service names (e.g., `mysql-service`, `mongodb-service`)
- Frontend URLs use NodePort addresses (e.g., `localhost:30080`)
- Secrets contain sensitive data (passwords, JWT secrets)

## 🚨 Troubleshooting

### Common Issues

**Pods not starting:**
```bash
# Check pod details
kubectl describe pod <pod-name> -n microservices

# Check logs
kubectl logs <pod-name> -n microservices
```

**Service connection issues:**
```bash
# Test service connectivity
kubectl exec -it deployment/admin-backend -n microservices -- curl http://mysql-service:3306

# Check service endpoints
kubectl get endpoints -n microservices
```

**Image pull errors:**
```bash
# Check if image exists
docker pull danieljappe1/service-name:v1.x

# Update image pull policy
kubectl patch deployment service-name -n microservices -p '{"spec":{"template":{"spec":{"containers":[{"name":"service-name","imagePullPolicy":"Always"}]}}}}'
```

### Health Checks
```bash
# Quick health check - should show all Running
kubectl get pods -n microservices | grep -v Running

# Check resource usage
kubectl top pods -n microservices

# Check events for issues
kubectl get events -n microservices --sort-by='.lastTimestamp'
```

### Database Access
```bash
# Access MySQL
kubectl exec -it deployment/mysql -n microservices -- mysql -u admin -padminpassword

# Access MongoDB
kubectl exec -it deployment/mongodb -n microservices -- mongosh

# Test database connectivity
kubectl run mysql-test --image=mysql:8.0 -it --rm --restart=Never -n microservices -- mysql -h mysql-service -u admin -padminpassword -e "SHOW DATABASES;"
```

## 🔄 Stopping the Application

### Graceful Shutdown
```bash
# Delete all resources
kubectl delete namespace microservices
```

### Partial Shutdown
```bash
# Stop specific service
kubectl scale deployment service-name --replicas=0 -n microservices

# Remove specific service
kubectl delete deployment service-name -n microservices
```

## 📊 Monitoring

### Resource Usage
```bash
# Pod resource usage
kubectl top pods -n microservices

# Node resource usage  
kubectl top nodes
```

### Service Mesh
```bash
# Check service connectivity
kubectl get services -n microservices

# Port forward for local access
kubectl port-forward svc/service-name 8080:80 -n microservices
```

## 🆚 Docker Compose vs Kubernetes

| Aspect | Docker Compose | Kubernetes |
|--------|----------------|------------|
| **Startup** | `docker-compose up` | `./deploy.sh` |
| **Logs** | `docker-compose logs service` | `kubectl logs deployment/service -n microservices` |
| **Scale** | `docker-compose up --scale service=3` | `kubectl scale deployment service --replicas=3 -n microservices` |
| **Restart** | `docker-compose restart service` | `kubectl rollout restart deployment/service -n microservices` |
| **Stop** | `docker-compose down` | `kubectl delete namespace microservices` |

## 📝 Admin Login Credentials

- **Email**: `admin@example.com`
- **Password**: `password123`

## 🔗 Useful Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Docker Desktop Kubernetes](https://docs.docker.com/desktop/kubernetes/)

## 🤝 Getting Help

1. **Check this guide first**
2. **View application logs**: `kubectl logs deployment/service-name -n microservices`
3. **Check pod status**: `kubectl get pods -n microservices`
4. **Ask the team** - share specific error messages and kubectl output

---

**Happy Kubernetes development! 🚀**