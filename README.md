# Ncp фронтенд

Версия фреймиворка Angular 9 последняя на февраль 2020 г. Работает в контейнере Docker. Настроен CI/CD.

**При локальной доработке чтобы не было проблем с аутентификацией** (проблема порта, чтобы принимались аут. куки) 
надо настроить, включить расширение proxy и запустить Apache HTTPD с конфигом "D:\dev\apache\httpd\2.4.38\conf\extra\httpd-vhosts.conf".

В котором добавить редирект: 

```
<VirtualHost *:80>

	ServerName localhost

	LogLevel debug
                                           
	ProxyPass /api http://localhost:8080/api
	ProxyPassReverse /api http://localhost:8080/api
	
	ProxyPass /ncp http://localhost:4200
	ProxyPassReverse /ncp http://localhost:4200
                        		
	ProxyPass /sockjs-node http://localhost:4200/sockjs-node
	ProxyPassReverse /sockjs-node http://localhost:4200/sockjs-node
                                           
</VirtualHost>
```
Соответственно контекст приложения будет "/ncp/" ("index.html") и путь к API "http://localhost/api/v1/ncp"

Сборка приложения:

Тест
ng build --configuration=staging

Сборка для деплоймента
ng build --configuration=production

запуск локально в режиме прода
ng serve --prod
