FROM nginx:mainline-alpine
ENV TZ Asia/Almaty
RUN rm /etc/nginx/conf.d/default.conf 
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
USER nginx
