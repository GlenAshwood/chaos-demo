<img src="../screenshoot.png" align="centre" />

# Minikube Setup

## Dependencies
- [Git](https://git-scm.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) or [EKS](https://eksctl.io/)
- [Helm v3.x](https://helm.sh/docs/intro/install/)
- [Python v3.x](https://www.python.org/downloads)
- [pip](https://pip.pypa.io/en/stable/installing)
- [istioctl](https://istio.io/latest/docs/setup/install/)

## Aplication
The application being tested is called DevOpsTools-API, a Node.js API that connects to a Mongo Database. Both components will be deployed on our cluster. 
- [DockerHub](https://hub.docker.com/repository/docker/gashers82/devops-tools-api)
- [GitHub](https://github.com/GlenAshwood/DevOpsTools-API)

Clone **chaos-demo** repo and change directory to **minikube**
```
git clone https://github.com/GlenAshwood/chaos-demo.git
cd minikube
```

## Setup Cluster Minikube

Create or restart Minikube Cluster
```
minikube start
```
Enable the *NGINX Ingress controller* addon:
```
minikube addons enable ingress
```
Enable *metrics-server* addon:
```
minikube addons enable metrics-server
```
Export Minikube ip to $INGRESS_HOST (which will be used later):
```
export INGRESS_HOST=$(minikube ip)
```

## Install Service Mesh
TBC

## Install Application
Create **chaos-space** namespace and enable istio-injection (incase we use it later)
```
kubectl create namespace chaos-space
kubectl label namespace chaos-space istio-injection=enabled
```
Change context to **chaos-space**namespace
```
kubectl config set-context --current --namespace=chaos-space
```

Deploy API and Mongo into **chaos-space** namespace
```
helm install devopstools-release -f mongo-values.yaml\
  bitnami/mongodb
kubectl apply -f api-setup.yaml
```
To check current Minikube IP
```
minikube ip
```
To open Application in default browser: 
```
minikube service devops-tools-api-service  -n chaos-space
```

## Experiment 1 - Basic health check on DevTool pods
This experiment will verify that all pods are running within the choosen namespace (in our case **chaos-space**), if "healthy", a random pod with our choosen label (**app=devops-tools-api**) will be terminatated. Once that action has been completed, the namespace will be probed again to confirm pods are running

```
chaos run chaos/health-test-1.yaml
```
expected output:
``` bash
[2020-06-17 13:47:42 INFO] Validating the experiment's syntax
[2020-06-17 13:47:43 INFO] Experiment looks valid
[2020-06-17 13:47:43 INFO] Running experiment: What happens if we terminate an instance of the application (devops-tools-api)?
[2020-06-17 13:47:43 INFO] Steady state hypothesis: The app is healthy
[2020-06-17 13:47:43 INFO] Probe: all-apps-are-healthy
[2020-06-17 13:47:43 INFO] Steady state hypothesis is met!
[2020-06-17 13:47:43 INFO] Action: terminate-app-pod
[2020-06-17 13:47:43 INFO] Steady state hypothesis: The app is healthy
[2020-06-17 13:47:43 INFO] Probe: all-apps-are-healthy
[2020-06-17 13:47:43 INFO] Steady state hypothesis is met!
[2020-06-17 13:47:43 INFO] Let's rollback...
[2020-06-17 13:47:43 INFO] No declared rollbacks, let's move on.
[2020-06-17 13:47:43 INFO] Experiment ended with status: completed
```
The experiment passed, but it really doesnt tell us anything that useful beisdes the pods within that namespace are running before and after the experiment.

## Experiment 2 - Basic health check on DevToolApp

This time, instead of just verifying thats pods are running before and after the experiment, we will check the availability of the application by validating that **http://${ingress_host}/tools** is reachable before and again after we terminate a random instance's of the devops-tools-api app. 

```
chaos run chaos/health-test-2.yaml
```
expected output:
``` bash
[2020-06-17 17:48:46 INFO] Validating the experiment's syntax
[2020-06-17 17:48:47 INFO] Experiment looks valid
[2020-06-17 17:48:47 INFO] Running experiment: What happens if we terminate an instance of the application(devops-tools-api)?
[2020-06-17 17:48:47 INFO] Steady state hypothesis: The application is healthy
[2020-06-17 17:48:47 INFO] Probe: app-responds-to-requests
[2020-06-17 17:48:47 INFO] Steady state hypothesis is met!
[2020-06-17 17:48:47 INFO] Action: terminate-app-pod
[2020-06-17 17:48:47 INFO] Pausing after activity for 2s...
[2020-06-17 17:48:49 INFO] Steady state hypothesis: The application is healthy
[2020-06-17 17:48:49 INFO] Probe: app-responds-to-requests
[2020-06-17 17:48:49 INFO] Steady state hypothesis is met!
[2020-06-17 17:48:49 INFO] Let's rollback...
[2020-06-17 17:48:49 INFO] No declared rollbacks, let's move on.
[2020-06-17 17:48:49 INFO] Experiment ended with status: completed
```
Again, the experiment passed, which gives us a little bit more confidence in our application's ability to recover from an slight outage.

## Destroy Application
```
kubectl delete -f api-setup.yaml
helm uninstall devopstools-release
```
or 
```
kubectl delete ns chaos-space
```

## Destroy Cluster
```
minikube delete
```
