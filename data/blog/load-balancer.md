---
title: Load balancer
date: '2021-10-02'
tags: ['System-Design-Fundamentals']
draft: False
summary: Let's try to understand what is Load Balancer with five questions.
images: []
layout: PostSimple
---

## let's try to understand the Load balancer(LB) with five questions.

1. What is Load Balancer?
2. Why do we need LB?
3. What are the advantages and disadvantages of using it?
4. What are the types of LB?
5. What algorithms does it uses?

## 1. What is Load Balancer?

Load Balancer is a critical component of any distributed system. It generally sits between client and server, accepting the incoming network and efficiently distributing it across multiple servers using various algorithms.

![photo](/static/images/load-balancer/Load_Balancer.png)

## 2. Why do we need LB?

Modern high-traffic websites have to serve hundreds of thousands of concurrent requests from the client in a fast and reliable manner. A single instance of server can handle a limited amount of requests in a given amount of time.
It's more likely that our server will become overloaded, which might lead to a failure in our system. this can be handled by scaling our system. We can scale it vertically, but there's a limit to the amount of power we can increase. There's a second option, which is to scale it by adding more servers/machines horizontally. It will increase our throughput by many folds. But of course, this is assuming that all of our clients will be requesting servers in a balanced way. But clients don't know where to direct their requests to the servers in this way. We need some mechanism to handle our redirecting problem. This is where Load Balancer comes into the picture. It sits between the client and server and balances the load evenly on the server. It makes sure that no one server is overworked.

## 3. What are the advantages and disadvantages of using it?
### Advantages
It prevents a single point of failure in the system.
Stops request from going to unhealthy servers.
Makes sure that no one resources are overloaded.
It makes it easy to change the server infrastructure without disrupting service to users.
It can add a layer of security to the system, like preventing DDoS and using a firewall. 

### Disadvantages 
Due to horizontally scaling, servers storing states might suffer from low cache hits.
The load balancer itself can become a single point of failure as well. 
Configuring multiple load balancers further increases complexity.

##  4. What are the types of LB?
A load balancer can be classified based on the duties it performs.
### a.) Network Load Balancer / Layer 4 (L4) Load Balancer
	L4 LB uses the information provided in the networking transport layer and distributes client requests across the cluster of servers. It operates at the transport layer, using the TCP and UDP protocols, extracts destinations IP addresses from the first few TCP streams, and does not inspect the packet content. L4 LB performs [NAT](https://en.wikipedia.org/wiki/Network_address_translation) on the request packet, changing the destination IP address from its own to one of the servers from the server pool. It does not consider any parameter at the application level like the type of content, cookie data, headers, locations, application behavior, etc. It only cares about the network layer information and directs the traffic according to this.

### b.) Application Load Balancer / Layer 7 (L7) Load Balancer

    L7 LB helps in creating a highly tuned and optimized server infrastructure. It operates at the application layer of the OSI model. 
The L7 LB evaluates a much more comprehensive range of data, including the HTTP header and SSL sessions, and redirects the traffic based on these parameters. In this manner, the application load balancer distributes traffic on individual usage and behavior.

##  5. What algorithms does it use?
Before forwarding a request, the load balancer ensures that the server they choose is functioning correctly. Health checks are done by regularly attempting to connect to the server to ensure that servers are listening. If some fail to respond, then they are removed from the pool of healthy servers. LB will not forward the traffic to it until it responds to the health check again.
There are a variety of algorithms used based on the requirements.

* **Round Robin** - This technique cycles through the list of upstream servers and assigning the subsequent connection request to each one in turn. If it reaches the end, it starts from the first server again. Nginx and Nginx plus, by default, uses this technique for distributing the load.

* **Weighted Round Robin** - The weighted round-robin technique is used when there is a difference in processing capacity between the machines. Each server is assigned weights according to its processing power. Server with more weight will receive more requests as compared to a server with low weights.

* **IP Hash** - In this method, IP is hashed by the load balancer, and it redirects the request to the specific server every time. It allocates the client to a particular server.

* **Least connection** - It is a dynamic load balancing algorithm where client requests are distributed to the servers with the least number of active connections when the client request is received.

