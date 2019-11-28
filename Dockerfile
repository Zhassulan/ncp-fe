FROM nginx
ENV TZ Asia/Almaty
RUN chown -R nginx:nginx /var/cache/nginx && chmod -R 777 /var/cache/nginx && touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
