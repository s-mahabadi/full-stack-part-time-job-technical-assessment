# Build stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with legacy-peer-deps flag to resolve the React version conflict
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build the React app
RUN npm run build --legacy-peer-deps

# Production stage
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"] 