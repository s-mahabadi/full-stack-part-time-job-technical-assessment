# Build stage
FROM node:16 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with legacy-peer-deps flag to handle any remaining conflicts
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Install specific version of ajv before building to fix the codegen module issue
RUN npm install ajv@^7.0.0 --no-save

# Build the React app
RUN npm run build

# Production stage
FROM nginx:stable

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"] 