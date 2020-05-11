# Ncp фронтенд

Версия фреймворка Angular 9 последняя на февраль 2020 г. Работает в контейнере Docker. 
Настроен CI/CD.

**При локальной доработке чтобы не было проблем с аутентификацией** (проблема порта, 
чтобы принимались аут. куки) надо настроить, включить расширение proxy и запустить 
Apache HTTPD с конфигом "D:\dev\apache\httpd\2.4.38\conf\extra\httpd-vhosts.conf".

В котором добавить редирект: 

```
<VirtualHost *:80>

	ServerName localhost

	LogLevel debug
                                           
	ProxyPass /ncp/api http://localhost:8080/api
	ProxyPassReverse /api http://localhost:8080/api
	
	ProxyPass /ncp/ui http://localhost:4200
	ProxyPassReverse /ncp/ui http://localhost:4200
                        		
	ProxyPass /sockjs-node http://localhost:4200/sockjs-node
	ProxyPassReverse /sockjs-node http://localhost:4200/sockjs-node
                                           
</VirtualHost>
```
Соответственно контекст приложения будет "/ncp/" ("index.html") и путь к API 
"http://localhost/api/v1/ncp".

Как вносятся изменения в проект (доработки):<br/> 
* Переключаемся на ветку dev и вносим изменения
* Тестируем локально, пушим на origin dev
* Переключаемся на ветку test и мержим c dev 
* Пушим на origin test, происходит авто redeploy test
* Тестируем на тестовом стенде
* Переключаемся на мастер и мержим с test
* Пушим на origin, происходит авто redeploy prod
Сборка и доставка происходит при помощи скриптов Gitlab CI/CD в контейнере Docker.<br/>

**Внимание! Торопиться, т.е. пушить в тест и затем сразу пушить в мастер нельзя. 
Надо дождаться когда задеплоится тест. Потом пушить на мастер, иначе будет конфликт 
с папками и в тест попадёт продуктивный образ**

Сборка приложения:

Тест
ng build --configuration=staging

Сборка для деплоймента
ng build --configuration=production

запуск локально в режиме прода
ng serve --prod
