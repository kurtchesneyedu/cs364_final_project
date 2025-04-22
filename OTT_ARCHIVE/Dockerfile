# Use official Nginx image
FROM nginx:latest

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static website files into Nginx's default directory
COPY ./OneTouchTimer /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

