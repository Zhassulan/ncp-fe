FROM docker.tele2.kz/ext-images/nginx:1.21.3
LABEL maintainer="SoftwareDevelopment_KZ@TELE2.kz"
LABEL name="NGINX dev"
LABEL description="NGINX NCP-UI"
ARG ENV
ENV TZ Asia/Almaty
ENV DEBIAN_FRONTEND noninteractive
COPY ./src/utils/${ENV}/nginx /etc/logrotate.d/nginx
COPY ./src/utils/${ENV}/entrypoint.sh /entrypoint.sh
COPY ./src/utils/${ENV}/nginx.conf /etc/nginx/nginx.conf
COPY ./src/utils/${ENV}/entrypoint.sh /entrypoint.sh

USER root
RUN rm /etc/nginx/conf.d/default.conf \
  && chmod -R 777 /var/log/nginx /var/cache/nginx/ /var/run/ \
  && chmod 644 /etc/nginx/*

COPY dist /usr/share/nginx/html
EXPOSE 80/tcp
VOLUME /var/log/nginx
#HEALTHCHECK --interval=1m --timeout=10s --start-period=90s CMD /healthcheck.sh
ENTRYPOINT ["/entrypoint.sh"]
