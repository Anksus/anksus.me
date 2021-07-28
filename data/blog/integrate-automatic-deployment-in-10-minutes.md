---
title: Deployment automation in 10 minutes using webhooks
date: '2021-07-28'
tags: ['Automatic deployment', 'web server']
draft: True
summary: Add automatic deployment to your projects with a simple web server
images: []
layout: PostLayout
---

![tailwind-nextjs-banner](/static/images/automatic_deploy/deploy-photo.jpg)

## Introduction

Once a developer’s changes to an application are merged into the repository. It should be deployed to production and available to users.
In order to automate this process, we need some tools to integrate into our ecosystem. We can use Github Actions with GitHub-hosted runners or with self-hosted runner machines but they both comes with an [usage limit](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#usage-limits).
We can integrate this process independently without any usage limits or without using any SaaS solutions by using the [Webhook tool](https://github.com/adnanh/webhook).

Webhook is a lightweight server written in Go. This allows us to create an HTTP endpoint on our server, which when triggered can execute specified commands. It takes 2 files as an input one JSON configuration file for hooks and one bash file.

## Installing Webhook server

For this blog post, I'm using Google Cloud's VM instance but you can use your own existing server. SSH into your server and
download the [Webhook binary](https://github.com/adnanh/webhook/releases/tag/2.8.0). Im using Ubuntu, so I'll download this one `webhook-linux-amd64.tar.gz.`

```
wget https://github.com/adnanh/webhook/releases/download/2.8.0/webhook-linux-amd64.tar.gz
```

To verify integrity of the downloaded file, run below command and cross verify the checksum provided on the official repo.

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

To verify, if everything went down correctly type `webhook --version`, if you see version in the output then the setup is correct.
To spin up the webhook server type `webhhok -verbose`.
