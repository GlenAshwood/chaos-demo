# Minikube Setup

Requirements
- minikube
- kubectl
- helm

Install
* minikube start
* helm install mongo-release \
--set mongodbUsername=mongodb,mongodbPassword=Test123,mongodbDatabase=devops,service.name=devops-mongodb-service \ bitnami/mongodb
* kubectl apply -f api-setup.yaml
