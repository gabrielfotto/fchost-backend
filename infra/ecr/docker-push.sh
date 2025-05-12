#!/bin/bash

# Usage check
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <dockerfile-path>"
  echo "Example: $0 ../../apps/api/Dockerfile"
  exit 1
fi

DOCKERFILE_PATH=$1
CONTEXT_PATH=".."
APP_NAME=$(basename $(dirname $DOCKERFILE_PATH))
ECR_PUBLIC_REPO="public.ecr.aws/e0j5c6t0"
REGION="us-east-1"

# Login to ECR public
aws ecr-public get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_PUBLIC_REPO

# Check if Dockerfile exists
if [ ! -f "$DOCKERFILE_PATH" ]; then
  echo "Dockerfile not found at $DOCKERFILE_PATH"
  exit 2
fi

# Build the docker image
docker build -f "$DOCKERFILE_PATH" -t fchost/$APP_NAME "$CONTEXT_PATH"

# Tag the image
docker tag fchost/$APP_NAME:latest $ECR_PUBLIC_REPO/fchost/$APP_NAME:latest

# Push the image
docker push $ECR_PUBLIC_REPO/fchost/$APP_NAME:latest
