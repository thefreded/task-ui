
FROM node:20-alpine AS build


WORKDIR /app

# copy without lock because of private reg issue.
COPY package.json ./

# Reset npm registry to public registry and clear any cached auth
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config delete //registry.npmjs.org/:_authToken || true && \
    npm cache clean --force


RUN npm install


COPY package.json angular.json tsconfig*.json ./
COPY src ./src
COPY public ./public


RUN npx ng build


FROM nginx:alpine


COPY --from=build /app/dist/* /usr/share/nginx/html/

# Create nginx config for Angular SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]