# fantasy
A lightweight and general-purpose open source blog project

使用前后端分离开发的一个轻量级博客平台， 支持PC、H5端， 整个项目分为了4个项目 
- admin 前端后台管理项目
- api 后端项目
- h5 手机端前端项目
- fe pc端端项目


欢迎使用 [FANTASY](https://igolang.cn/)

# 功能概览

## 用户侧功能
1、用户浏览页面支持后台动态路由菜单分类

2、支持文章置顶后首页采用轮播图

3、支持用户登录注册、信息修改、找回密码等

4、热门文章右侧展示

5、热门评论右侧展示

6、文章标签右侧展示

7、最新文章右侧展示时间线

8、支持文章评论

9、支持文章点赞

10、支持与该文章发布的作者进行1by1私信，并且消息会及时发送给作者(通过邮件)，作者回复之后也是通过邮件发给用户

## 后台侧功能
- Dashboard  
- 资产管理
- 用户管理
- 审计管理

1、通过后台可以看到文章发布的数量，最七天发布的趋势，分类、标签数量

2、资产管理可以进行文章的增删改查，分类、标签的增删改查

3、支持文章的草稿保存

4、支持作者的用户信息修改、包括密码、头像、nick修改

5、支持在后台查看到用户与作者的对话信息， 作者需要在后台才可以跟用户私聊

6、登录日志、操作日志审计， 包括黑名单配制.

# 技术栈
- antd pro 
- antd mobile
- beego
- mysql
- redis

# 用户侧

## 首页
<img width="1663" alt="image" src="https://user-images.githubusercontent.com/88186802/182017782-73dc770f-6820-4387-bb6e-a84c77cbf1b4.png">

## 首页左侧
<img width="499" alt="image" src="https://user-images.githubusercontent.com/88186802/182017793-82a5b135-fe9d-477a-aead-639a0ff5589b.png">


## 登录页
<img width="1668" alt="image" src="https://user-images.githubusercontent.com/88186802/182017821-8c699630-974e-4164-a729-948371186179.png">

## 注册页
<img width="1675" alt="image" src="https://user-images.githubusercontent.com/88186802/182017833-c66d896b-f67b-484d-81bc-83ef87d61c4d.png">


# 后台侧
<img width="1679" alt="image" src="https://user-images.githubusercontent.com/88186802/182018879-e0eaad24-f637-4223-9aea-4c46b589088f.png">

<img width="1666" alt="image" src="https://user-images.githubusercontent.com/88186802/182018935-82b518b0-e992-4dab-baea-22b5dc3a5e9f.png">

<img width="1261" alt="image" src="https://user-images.githubusercontent.com/88186802/182018952-804d6f3e-8ffe-4cd5-8eb0-704d2767e994.png">

<img width="1674" alt="image" src="https://user-images.githubusercontent.com/88186802/182018963-f93dfc3e-0ef6-435c-84ca-20f45666aef0.png">

<img width="1651" alt="image" src="https://user-images.githubusercontent.com/88186802/182018976-c2370453-d8aa-48a7-bbdf-125cbe1250ca.png">

<img width="1670" alt="image" src="https://user-images.githubusercontent.com/88186802/182018985-d74c4103-4f1e-4964-911b-8410de382d57.png">

# 关于部署
1、nginx
```
server {

    listen 443 ssl;
    server_name 你的域名;
    ssl_certificate /etc/nginx/igolang.cn_nginx/igolang.cn_bundle.crt;
    ssl_certificate_key /etc/nginx/igolang.cn_nginx/igolang.cn.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 9;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";
    client_max_body_size 64M;

    location / {
        if ($http_user_agent ~* '(iPhone|iPod|incognito|webmate|Android|dream|CUPCAKE|froyo|BlackBerry|webOS|s8000|bada|IEMobile|Googlebot\-Mobile|AdsBot\-Google)' ) {
            rewrite ^/(.*) https://你的域名/h5/$1 permanent;
        }

        root /usr/share/nginx/html/fe/;
        try_files $uri $uri/ /index.html;
    }

    location ^~ /h5 {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri /h5/index.html;
    }

    location ^~ /admin {
        alias /usr/share/nginx/html/admin;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    location /api/ {
        proxy_http_version 1.1;
        proxy_set_header REMOTE_ADDR     $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:8000;
    }
}

server {
    listen 80;
    server_name 你的域名;
    return 301 https://$host$request_uri;
}
```
2、前端
前端分为三个项目，只需要进入对应的项目目录执行``tyarn build``即可

3、后端
后端执行`` go build ``即可
后端部署配置文件
```
[supervisord]

[program:fantasy]
directory=/devops/app/fantasy/project/fantasy-api
command=/devops/app/fantasy/project/fantasy-api/fantasy-api
autostart=true
user=root
redirect_stderr=true
stdout_logfile=/devops/app/fantasy/project/fantasy-api/fantasy-api.log
```
``
supervisord -c supervisord.conf
``
