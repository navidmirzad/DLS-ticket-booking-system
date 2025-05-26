#!/bin/bash

# Docker Desktop Kubernetes Deployment Script
# This script deploys your microservices to Docker Desktop Kubernetes

set -e

echo "Starting Docker Desktop Kubernetes deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    print_error "Make sure Docker Desktop is installed and Kubernetes is enabled"
    exit 1
fi

# Check if we can connect to the cluster
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster"
    print_error "Make sure Docker Desktop is running and Kubernetes is enabled"
    exit 1
fi

print_status "Connected to Docker Desktop Kubernetes cluster"

# Switch to docker-desktop context (just to be sure)
kubectl config use-context docker-desktop

print_status "Deploying application to Kubernetes..."

# Apply the configuration
kubectl apply -f docker-desktop-k8s.yaml

print_status "Waiting for pods to be ready..."

# Wait for databases to be ready first
print_status "Waiting for databases..."
kubectl wait --for=condition=available --timeout=300s deployment/mysql -n microservices
kubectl wait --for=condition=available --timeout=300s deployment/mongodb -n microservices
kubectl wait --for=condition=available --timeout=300s deployment/mongodb-auth -n microservices
kubectl wait --for=condition=available --timeout=300s deployment/rabbitmq -n microservices

print_status "Waiting for application services..."
kubectl wait --for=condition=available --timeout=300s deployment/auth-service -n microservices
kubectl wait --for=condition=available --timeout=300s deployment/admin-backend -n microservices
kubectl wait --for=condition=available --timeout=300s deployment/customer-backend -n microservices
kubectl wait --for=condition=available --timeout=300s deployment/customer-frontend -n microservices
kubectl wait --for=condition=available --timeout=300s deployment/admin-frontend -n microservices
kubectl wait --for=condition=available --timeout=300s deployment/mail-service -n microservices

print_status "Deployment completed successfully"

echo ""
echo "==================== SERVICE ACCESS ===================="
echo ""
print_status "Your services are now accessible at:"
echo "Customer Frontend:    http://localhost:30080"
echo "Admin Frontend:      http://localhost:30081"
echo "Auth Service:         http://localhost:30000"
echo "Admin Backend:        http://localhost:30001"
echo "Customer Backend:     http://localhost:30002"
echo "Mail Service:         http://localhost:30003"
echo "RabbitMQ Management:  http://localhost:31567 (admin/admin)"
echo "MySQL:               localhost:30306"
echo "MongoDB:              localhost:30017"
echo "MongoDB Auth:         localhost:30018"

echo ""
echo "==================== USEFUL COMMANDS ===================="
echo ""
print_status "Monitor your deployment:"
echo "• Check all pods:           kubectl get pods -n microservices"
echo "• Check services:           kubectl get services -n microservices"
echo "• View pod logs:            kubectl logs -f deployment/<service-name> -n microservices"
echo "• Describe pod issues:      kubectl describe pod <pod-name> -n microservices"
echo ""
print_status "Manage your deployment:"
echo "• Scale a service:          kubectl scale deployment <service-name> --replicas=<number> -n microservices"
echo "• Restart a service:        kubectl rollout restart deployment/<service-name> -n microservices"
echo "• Delete everything:        kubectl delete namespace microservices"

echo ""
echo "==================== NEXT STEPS ===================="
echo ""
print_warning "Don't forget to:"
echo "1.Update the secrets in the YAML file with your real credentials"
echo "2.Configure your applications to work with the new service URLs"
echo "3.Test each service individually to make sure they're working"
echo "4.Check the RabbitMQ management interface to verify message queue connectivity"
