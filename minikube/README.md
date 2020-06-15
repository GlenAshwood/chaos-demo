# Minikube Setup

## Dependencies
- [Git](https://git-scm.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) or [EKS](https://eksctl.io/)
- [Helm v3.x](https://helm.sh/docs/intro/install/)
- [Python v3.x](https://www.python.org/downloads)
- [pip](https://pip.pypa.io/en/stable/installing)

## Aplication
The application being tested is called DevOpsTools-API
- [DockerHub](https://hub.docker.com/repository/docker/gashers82/devops-tools-api)
- [GitHub](https://github.com/GlenAshwood/DevOpsTools-API)

## Install
```
minikube start
helm install mongo-release \
--set mongodbUsername=mongodb,mongodbPassword=Test123,mongodbDatabase=devops,service.name=devops-mongodb-service \
bitnami/mongodb
kubectl apply -f api-setup.yaml
```
minikube ip

http://{minikube_ip}:30080/
