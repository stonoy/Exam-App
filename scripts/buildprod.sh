#!/bin/bash

# Navigate to the client directory
cd client

# Run npm build
npm run build

# Check if npm build was successful
if [ $? -ne 0 ]; then
  echo "npm build failed"
  exit 1
fi

# Return to the root directory
cd ..

# Build the Go application
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o exam1

# Check if Go build was successful
if [ $? -ne 0 ]; then
  echo "Go build failed"
  exit 1
fi

echo "Build successful"
