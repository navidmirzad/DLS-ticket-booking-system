#!/bin/bash

echo "Stopping all Kubernetes resources..."

# Function to check if namespace exists
check_namespace() {
    kubectl get namespace ticket-system &> /dev/null
    return $?
}

# Function to display current resources before deletion
show_resources() {
    echo "Current resources in ticket-system namespace:"
    echo "----------------------------------------"
    echo "Pods:"
    kubectl get pods -n ticket-system
    echo -e "\nServices:"
    kubectl get services -n ticket-system
    echo -e "\nDeployments:"
    kubectl get deployments -n ticket-system
    echo "----------------------------------------"
}

# Check if the namespace exists
if check_namespace; then
    echo "Found ticket-system namespace. Displaying current resources..."
    show_resources

    echo -e "\nStopping port forwards (if any are running)..."
    pkill -f "kubectl port-forward"

    echo -e "\nDeleting ticket-system namespace and all its resources..."
    kubectl delete namespace ticket-system

    echo -e "\nWaiting for namespace deletion to complete..."
    while check_namespace; do
        echo "Still deleting namespace..."
        sleep 2
    done
    echo "Namespace and all resources have been deleted successfully!"
else
    echo "ticket-system namespace not found. Nothing to clean up."
fi

echo -e "\nKubernetes cleanup completed!" 