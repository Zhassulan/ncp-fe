FROM nginx:mainline-alpine
ENV TZ Asia/Almaty
USER root
RUN rm /etc/nginx/conf.d/default.conf \
  && chmod -R 777 /var/log/nginx /var/cache/nginx/ /var/run/ \
  && chmod 644 /etc/nginx/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
