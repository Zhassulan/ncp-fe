FROM nginx:mainline-alpine
ENV TZ Asia/Almaty
USER root
RUN rm /etc/nginx/conf.d/default.conf && chown -R nginx:nginx /var/cache/nginx && chmod -R 777 /var/cache/nginx && touch /var/run/nginx.pid && chown -R nginx:nginx /var/run/nginx.pid
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
