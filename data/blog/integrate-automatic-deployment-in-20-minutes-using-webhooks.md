---
title: Integrate automatic deployment in 20 minutes using webhooks
date: '2021-07-28'
tags: ['Automatic deployment', 'web server']
draft: False
summary: Once a developer’s changes to an application are merged into the repository. It should be deployed to production and available to users. In order to automate this process, we need some tools to integrate into our ecosystem.
images: []
layout: PostLayout
---

![PHOTO](/static/images/automatic_deploy/deploy-photo.jpg)

## Introduction

Once a developer’s changes to an application are merged into the repository. It should be deployed to production and available to users. In order to automate this process, we need some tools to integrate into our ecosystem. We can use Github Actions with GitHub-hosted runners or self-hosted runner machines but they both come with a [usage limit](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#usage-limits). We can integrate this process independently without any usage limits or without using any SaaS solutions by simply using the [Webhook tool](https://github.com/adnanh/webhook).

Webhook is a lightweight server written in Go. This allows us to create an HTTP endpoint on our server, which when triggered can execute specified commands. It takes two files as an input one JSON configuration file for hooks and one bash file for commands. So, let's implement it on our private GitHub repo and Ubuntu server.

## Installing Webhook server

I'm using Google Cloud's VM instance but you can use your own existing server. SSH into your server and
download the [Webhook binary](https://github.com/adnanh/webhook/releases/tag/2.8.0). I'm on Ubuntu, so I'll download this one `webhook-linux-amd64.tar.gz.`

```
wget https://github.com/adnanh/webhook/releases/download/2.8.0/webhook-linux-amd64.tar.gz
```

To verify the integrity of the downloaded file, run the below command and cross verify the checksum provided on the official repo.

```
md5 webhook-linux-amd64.tar.gz
```

Extract the tar file using

```
tar -xvf webhook-linux-amd64.tar.gz
```

To access webhook binary globally move it to the /usr/local/bin directory.

```
sudo mv  webhook-linux-amd64/webhook /usr/local/bin
```

To verify, if everything went down correctly type `webhook --version`, if we see a version in the output then the setup is correct. Now let's start our webhook server, type `webhook -verbose`. It shows the server is running on port 9000. Later, we will make it run in the background as a service using the systemd. We can close it now.

![PHOTO](/static/images/automatic_deploy/webhook-verbose.png)

## Creating webhook on GitHub

Go to `WebHooks` under settings and click on `Add webhook` Type IP address or URL of your server in place of XX.YYY.XX.YYY without port 9000 `http://XX.YYY.XX.YYY/hooks/redeploy-app`. Later we will configure Nginx to proxy pass it. Content-type to `application.json` Add a secret that will be used to verify the webhook trigger on our server and then click on `Add webhook`

![PHOTO](/static/images/automatic_deploy/github-webhook-1.png)

## Configuring our webhook server.

So, our webhook server setup is complete. Now we have to create an endpoint that will execute our bash script. Let's create a directory webhook-setup and two files hooks.json and redeploy.sh.

```
mkdir webhook-setup
cd webhook-setup
touch hooks.json
touch redeploy.sh
```

make redeploy.sh an executable file. By writing the below command.

```
chmod +x redeploy.sh
```

Open your favorite editor and paste the following code in hooks.json. I'm using vim. In case you got stuck.
[how-do-i-exit-the-vim-editor](https://stackoverflow.com/questions/11828270/how-do-i-exit-the-vim-editor)

```
vim hooks.json
```

```
[
  {
    "id": "redeploy-app",
    "execute-command": "/home/ankit/webhook-setup/redeploy.sh",
    "command-working-directory": "/home/ankit/demo-app",
    "response-message": "Deployed.......",
     "trigger-rule":
    {
      "and":
      [
        {
          "match":
          {
            "type": "payload-hash-sha1",
            "secret": "some-super-secret",
            "parameter":
            {
              "source": "header",
              "name": "X-Hub-Signature"
            }
          }
        },
        {
          "match":
          {
            "type": "value",
            "value": "refs/heads/main",
            "parameter":
            {
              "source": "payload",
              "name": "ref"
            }
          }
        }
      ]
    }
  }
]
```

The `id` field will create a new endpoint as `http://0.0.0.0:9000/hooks/{id}`. Whenever a request comes to the Webhook server it will execute the script mentioned in `execute-command` field inside a `command-working-directory`. The `secret` field should have the same secret as we generated on GitHub. Replace the `value` field with your branch. Right now it points to the main branch. To know more about the parameters visit [webhook parameters](https://github.com/adnanh/webhook/blob/master/docs/Webhook-Parameters.md#webhook-parameters)

Now, let's create a script that will pull our code from the GitHub repo. We can write any commands here like running tests, building, or deploying a new version (basically, it's a bash script).

```
vim redeploy.sh
```

paste the following code into redeploy.sh and save it.

```
#!/bin/bash

git pull
npm install
pm2 reload all
pm2 save
```

I am using pm2 to manage all the nodejs processes. Now, all the setup is complete. We can spin up our webhook server. But first, let's make it a background process by using systemd. So that, it restarts when our server reboots.

## Creating webhook service

First, create a file called webhook.service in `/etc/systemd/system`. The below command creates that file and opens it.

```
sudo vim /etc/systemd/system/webhook.service
```

and paste the following code into it.

```
[Unit]
Description=Webhooks
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
User=ankit
Restart=on-failure
RestartSec=5
ExecStart=/usr/local/bin/webhook -verbose -hotreload -hooks /home/ankit/webhook-setup/hooks.json  port 9000 -ip "127.0.0.1" -http-methods post

[Install]
WantedBy=multi-user.target
```

In `User` type your username. Let's try to understand the `ExecStart`, it executes the command passed to it. `/usr/local/bin/webhook` is the location of our webhook binary and `/home/ankit/webhooks-setup/hooks.json` of hooks.json. The HTTP method is POST because GitHub makes a POST request.

Now, we have to start the webhook service and enable it so that it restarts if our server reboots.

```
sudo systemctl start webhook.service
sudo systemctl enable webhook.service
```

## Nginx setup

Our webhook server is running on port 9000 on our server. We should not expose our ports directly. Let's configure the Nginx config file to proxy pass it.

open the Nginx config file

```
vim /etc/nginx/sites-available/default
```

and add the following code.

```
upstream loadbalance {
        server 127.0.0.1:3001;
        server 127.0.0.1:3000;
}
upstream webhooks {
        server 127.0.0.1:9000;
}
server {
  listen 80;
  server_name YOUR_SERVER_IP;

  location /hooks/ {
        proxy_pass "http://webhooks";
  }
  location / {
    proxy_pass "http://loadbalance";
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
  }
}
```

Here, I have two instances of express web servers running on ports 3000 and 3001, which are balanced by Nginx's load balancer. Let's validate our Nginx configuration files and reload them if the test is successful.

```
nginx -t
sudo systemctl reload nginx
```

Now, our integration is complete. We can make changes to the local repo and test pushing changes to origin. It will get automatically deployed to our server as well.

### If there's a way to improve the setup, then please let me know in the comments.
