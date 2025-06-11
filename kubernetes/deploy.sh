#!/bin/bash

# Export environment variables without executing them
export $(cat ../.env | grep -v '^#' | sed 's/[[:space:]]*$//' | xargs -0)

# Create namespace
kubectl apply -f namespace.yaml

# Delete existing secrets and create new ones
echo "Recreating secrets..."
kubectl delete secret mysql-secret jwt-secret stripe-secret mail-secret -n ticket-system --ignore-not-found
kubectl create secret generic mysql-secret \
  --namespace=ticket-system \
  --from-literal=root-password="${MYSQL_ROOT_PASSWORD}" \
  --from-literal=user-password="${MYSQL_PASSWORD}"

kubectl create secret generic jwt-secret \
  --namespace=ticket-system \
  --from-literal=JWT_SECRET="${JWT_SECRET}"

kubectl create secret generic stripe-secret \
  --namespace=ticket-system \
  --from-literal=STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}" \
  --from-literal=STRIPE_PUBLIC_KEY="${STRIPE_PUBLIC_KEY}"

kubectl create secret generic mail-secret \
  --namespace=ticket-system \
  --from-literal=MAIL_HOST="${MAIL_HOST}" \
  --from-literal=MAIL_USERNAME="${MAIL_USERNAME}" \
  --from-literal=MAIL_PASSWORD="${MAIL_PASSWORD}"

# Apply configurations
echo "Applying Kubernetes configurations..."
kubectl apply -f rabbitmq.yaml
kubectl apply -f databases.yaml
kubectl apply -f backend-services.yaml
kubectl apply -f frontend-services.yaml
kubectl apply -f support-services.yaml
kubectl apply -f prometheus.yaml

echo "Waiting for deployments to be ready..."
echo "This may take a few minutes. Checking status every 10 seconds..."

# Function to check pod status
check_pods() {
    echo "Current pod status:"
    kubectl get pods -n ticket-system
    echo ""
    
    # Check for pods not in Running state
    NOT_RUNNING=$(kubectl get pods -n ticket-system --no-headers | grep -v "Running" | wc -l)
    if [ $NOT_RUNNING -gt 0 ]; then
        echo "Pods not in Running state:"
        kubectl get pods -n ticket-system --no-headers | grep -v "Running"
        echo "Checking pod events for troubleshooting:"
        kubectl get pods -n ticket-system --no-headers | grep -v "Running" | awk '{print $1}' | while read pod; do
            echo "Events for $pod:"
            kubectl describe pod $pod -n ticket-system | grep -A 10 "Events:"
        done
    fi
}

# Wait for pods with timeout and status updates
TIMEOUT=300  # 5 minutes timeout
INTERVAL=10  # Check every 10 seconds
ELAPSED=0

while [ $ELAPSED -lt $TIMEOUT ]; do
    NOT_READY=$(kubectl get pods -n ticket-system --no-headers | grep -v "Running" | wc -l)
    if [ $NOT_READY -eq 0 ]; then
        echo "All pods are running!"
        break
    fi
    
    echo "Waiting for pods to be ready... ($ELAPSED seconds elapsed)"
    check_pods
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "Timeout waiting for pods to be ready. Please check pod status and logs:"
    check_pods
    echo "You can check specific pod logs with: kubectl logs <pod-name> -n ticket-system"
fi

echo -e "\nDeployment Status:"
echo "==================="
kubectl get pods -n ticket-system
echo -e "\nService Status:"
echo "================"
kubectl get services -n ticket-system

echo -e "\nTo access the services, run these commands in separate terminals:"
echo "----------------------------------------------------------------"
echo "Admin Frontend:    kubectl port-forward svc/admin-frontend 8081:81 -n ticket-system"
echo "Customer Frontend: kubectl port-forward svc/customer-frontend 8080:80 -n ticket-system"
echo "RabbitMQ UI:      kubectl port-forward svc/rabbitmq 15672:15672 -n ticket-system"
echo "Prometheus:       kubectl port-forward svc/prometheus 9090:9090 -n ticket-system" 