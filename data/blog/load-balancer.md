---
title: Load balancer
date: '2021-10-02'
tags: ['System-Design-Fundamentals']
draft: True
summary: Let's try to understand, what is Load Balancer with 5 questions.
images: []
layout: PostSimple
---

## let's try to understand the Load balancer(LB) with 5 questions.

1. What is Load Balancer?
2. Why we need LB?
3. What are the advantages and disadvantages of using it?
4. What are the types of LB?
5. What algorithms does it uses?

## 1. What is Load Balancer?

Load Balancer is a critical component of any distributed system. It generally sits between client and server accepting the incoming network and efficiently distributing it across multiple servers using various algorithms.

![photo](/static/images/load-balancer/Load_Balancer.png)

## 2. Why we need LB?

Modern high-traffic websites have to serve hundreds of thousands of concurrent requests from the client in a fast and reliable manner. A single instance of server can handle a limited amount of requests in a given amount of time.
It's more likely our server is to become overloaded and that might lead to a failure in our system. This can be handled by scaling our servers. We can scale it vertically but there's a limit to the amount of power we can increase of our machine. There's a second option, which is to horizontally scale it. This means adding more servers/machines. This will increase our throughput by many folds. But of course, this is assuming that all of our clients will be requesting servers in a balanced way. But clients don't know where to direct their requests to the servers in this way. We need some mechanism to handle our redirecting problem. This is where Load Balancer comes into the picture. It sits between the client and server and balances the load evenly on the server. It makes sure that no one server is overworked.


