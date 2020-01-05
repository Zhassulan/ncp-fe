FROM nginx:mainline-alpine
ENV TZ Asia/Almaty
RUN rm /etc/nginx/conf.d/default.conf \
  && touch /var/run/nginx.pid \
  && chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid \
  && chmod -R 777 /var/cache/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
USER nginx
