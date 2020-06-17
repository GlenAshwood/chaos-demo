<img src="screenshoot.png" align="centre" />

# Kubernetes Chaos experiments that will test the availability, reliability and scalability of a basic two tier (Node.js and MongoDB) applicaion.

## Description
"It worked in UAT" is just one of the phrases no one wants to hear in production. This project will try to explore how Chaos Engineering can be implemented within multiple Kubernetes environments.

## A Special mention to Viktor Farcic for his chaos course on Udemy
[Udemy Course](https://www.udemy.com/course/kubernetes-chaos-engineering-with-chaos-toolkit-and-istio/) on kubernetes chaos engineering with chaos toolkit and istio

## Dependencies
- [Git](https://git-scm.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) or [EKS](https://eksctl.io/)
- [Helm v3.x](https://helm.sh/docs/intro/install/)
- [Python v3.x](https://www.python.org/downloads)
- [pip](https://pip.pypa.io/en/stable/installing)

##  Chaos Toolkit
- [Git Repo](https://github.com/chaostoolkit/chaostoolkit)
- [Website](https://chaostoolkit.org/)
### Addon used
- [chaostoolkit-kubernetes](https://github.com/chaostoolkit/chaostoolkit-kubernetes)
- [chaostoolkit-reporting](https://github.com/chaostoolkit/chaostoolkit-reporting)



## Aplication
The application being tested is called DevOpsTools-API
- [DockerHub](https://hub.docker.com/repository/docker/gashers82/devops-tools-api)
- [GitHub](https://github.com/GlenAshwood/DevOpsTools-API)

## Minikube Experiments
[Here](https://github.com/GlenAshwood/chaos-demo/tree/master/minikube)

## EKS Experients
TBC


