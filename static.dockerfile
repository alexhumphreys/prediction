FROM nginx

COPY static /usr/share/nginx/html
COPY ./nginx/docker-compose.conf /etc/nginx/nginx.conf
COPY ./nginx/.htpasswd /etc/nginx/
