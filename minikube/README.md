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
The application being tested is called DevOpsTools-API, a Node.js API that connects to a Mongo Database. Both components will be deployed within our cluster.
- [DockerHub](https://hub.docker.com/repository/docker/gashers82/devops-tools-api)
- [GitHub](https://github.com/GlenAshwood/DevOpsTools-API)

### Deployments
2 devops-tools-api pods
1 MongoDB pod

### Clone Repo

to follow along with the following experiment, please clone this repo and cd to **minikube**
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
helm install devops-tools -f mongo-values.yaml\
  bitnami/mongodb
kubectl apply -f api-setup-db-rs.yaml
```
To check current Minikube IP
```
minikube ip
```
To open Application in default browser: 
```
minikube service devops-tools-api-service  -n chaos-space
```

## Terminating PODs within our Cluster

### Experiment 1 - Basic application health check and app termination
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

### Experiment 2 - HTTP health check and app termination

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
Again, the experiment passed, which gives us a little bit more confidence in our application's ability to recover from a slight outage, but what happens if the same thing happens to the DB instance?

### Experiment 3 - HTTP health check and DB termination

For the third experiment, we will do the same HTTP validations we did during the second experiment, but this time we will terminate an instance of MongoDB. As we only have 1 instance of the DB running, we can assume the outcome of this experiment, but lets run it anyway:

```
chaos run chaos/health-test-3.yaml
```
expected output:
``` bash
[2020-06-17 22:49:41 INFO] Validating the experiment's syntax
[2020-06-17 22:49:41 INFO] Experiment looks valid
[2020-06-17 22:49:41 INFO] Running experiment: What happens if we terminate an instance of the MongoDB?
[2020-06-17 22:49:41 INFO] Steady state hypothesis: The application is healthy
[2020-06-17 22:49:41 INFO] Probe: app-responds-to-requests
[2020-06-17 22:49:42 INFO] Steady state hypothesis is met!
[2020-06-17 22:49:42 INFO] Action: terminate-db-pod
[2020-06-17 22:49:42 INFO] Pausing after activity for 2s...
[2020-06-17 22:49:44 INFO] Steady state hypothesis: The application is healthy
[2020-06-17 22:49:44 INFO] Probe: app-responds-to-requests
[2020-06-17 22:49:47 ERROR]   => failed: activity took too long to complete
[2020-06-17 22:49:47 WARNING] Probe terminated unexpectedly, so its tolerance could not be validated
[2020-06-17 22:49:47 CRITICAL] Steady state probe 'app-responds-to-requests' is not in the given tolerance so failing this experiment
[2020-06-17 22:49:47 INFO] Let's rollback...
[2020-06-17 22:49:47 INFO] No declared rollbacks, let's move on.
[2020-06-17 22:49:47 INFO] Experiment ended with status: deviated
[2020-06-17 22:49:47 INFO] The steady-state has deviated, a weakness may have been discovered
```
As expected (hopefully), the experiment failed. The DB tier does recover, but not quick enough and we have downtime. so lets try and fix that now by enabling ReplicaSet on our devopstools chart.

First we need to delete the current helm chart (the API is using the same service name for both options, so we have to delete instead of upgrading)
```
helm uninstall devops-tools
```
Then install it again with ReplicaSet enabled
```
helm install devops-tools -f mongo-values-rs.yaml\
  bitnami/mongodb
```
And now, we have multiple instance of our DB
```
statefulset.apps/devopstools-release-mongodb-arbiter     1/1     115s
statefulset.apps/devopstools-release-mongodb-primary     1/1     115s
statefulset.apps/devopstools-release-mongodb-secondary   1/1     115s
```
So, lets try experiment 3 again (I actually found this quite exciting, as I wasnt sure if it would work the first time I tried it!)
```
[2020-06-17 23:24:01 INFO] Validating the experiment's syntax
[2020-06-17 23:24:02 INFO] Experiment looks valid
[2020-06-17 23:24:02 INFO] Running experiment: What happens if we terminate an instance of the MongoDB?
[2020-06-17 23:24:02 INFO] Steady state hypothesis: The application is healthy
[2020-06-17 23:24:02 INFO] Probe: app-responds-to-requests
[2020-06-17 23:24:02 INFO] Steady state hypothesis is met!
[2020-06-17 23:24:02 INFO] Action: terminate-db-pod
[2020-06-17 23:24:02 INFO] Pausing after activity for 2s...
[2020-06-17 23:24:04 INFO] Steady state hypothesis: The application is healthy
[2020-06-17 23:24:04 INFO] Probe: app-responds-to-requests
[2020-06-17 23:24:04 INFO] Steady state hypothesis is met!
[2020-06-17 23:24:04 INFO] Let's rollback...
[2020-06-17 23:24:04 INFO] No declared rollbacks, let's move on.
[2020-06-17 23:24:04 INFO] Experiment ended with status: completed
```
I got lucky the first time and the experiment passed, but I wanted to confirm that I got the same result for the arbiter, primary and secondary instances of the DB. I didnt, so I had to stop looking at how my application connected to the DB

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
