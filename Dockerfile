FROM --platform=linux/amd64 debian:stable-slim

# Update package repositories and install necessary packages
RUN apt-get update && apt-get install -y ca-certificates

# Copy the ecom1 executable to /usr/bin/
ADD exam1 /usr/bin/exam1

# Set the entry point command
CMD ["exam1"]