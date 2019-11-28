FROM nginx:alpine
ENV TZ Asia/Almaty
RUN chown nginx:nginx /var/cache/nginx
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist .
