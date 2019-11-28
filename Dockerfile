FROM nginx
ENV TZ Asia/Almaty
RUN chown -R nginx:nginx /var/cache/nginx && chmod -R 777 /var/cache/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
