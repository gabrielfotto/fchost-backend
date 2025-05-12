#!/bin/bash

cd "$(dirname "$0")"

# AWS Ingress Controller
echo ''
echo 'applying AWS provider ingress-nginx-controller.yaml...'
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.2/deploy/static/provider/aws/deploy.yaml

# cert-manager
echo ''
echo 'applying cert-manager.yaml...'
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.yaml

# ==============================================================================
# Aplicar yaml's abaixo somente após a criação dos recursos anteriores

# ConfigMap
echo ''
echo 'applying config-map.yaml...'
kubectl apply -f ./config-map.yaml

# Services
echo ''
echo 'applying services...'
kubectl apply -f ./services/api.yaml

# Ingress
echo ''
echo 'applying ingress.yaml...'
kubectl apply -f ./ingress.yaml

# ClusterIssuer
echo ''
echo 'applying cluster-issuer.yaml...'
kubectl apply -f ./cert-manager/cluster-issuer.yaml
