---
layout: post
title:  "GitHub Pages and Domains"
date:   2016-01-06 21:29:40 -0800
tags:   dns records jekyll github pages
---
Like many others, I am using Jekyll with GitHub Pages for this purpose. However, I did want to use my own domain name, [jamesjia.com](http://jamesjia.com), rather than [jamesjia94.github.io](jamesjia94.github.io).

GitHub has a very helpful article that explains what [needs to be done][github-custom-domain]. Nevertheless, I did find the article lacking in some regards, so I decided to document my journey to get this website up and running.

## Basic Terminology
The term `domain name` is used to describe a name with a hierarchical structure indicated by dots, such as www.jamesjia.com. It was designed to create a system to translate these human-friendly names into IP addresses, the virtual mailing addresses of the web. This hierarchy is very similar to the way in which we structure our mailing address, except, instead of going from up to down, we go from left to right. Thus, the rightmost portion of a domain name is analagous to a country or continent, whereas the leftmost portion might be the street address.

<img src="/assets/domain_flowchart.png" alt="Domain Hierarchy Image"/>

There is also a notion of a `name server`. A name server is a server program that holds a subset of information about this tree-shaped domain hierarchy. This information is stored in units called a `record`. Now, these records can hold all types of data and is not solely used by a name server. Name servers can also hold pointers to other name servers, using recursion to traverse to other sections of the domain tree. Name servers that have complete knowledge of its subdomain, without asking other name servers for answers (no phoning friends), is the designated **authority** for that region.

Lastly, there is a `resolver`. A resolver is a program that queries information from name servers at the request of a client. For example, your browser used resolver to figure out how to get to this page!

## Apex Domain vs Subdomain: Configuration Differences
GitHub Pages allows you to configure a custom subdomain or an apex domain (an exception to this is described later). The difference is that configuring an apex domain allows people to visit my website by typing in "jamesjia.com" whereas configuring a subdomain forces people to type in "www.jamesjia.com". Since I felt that jamesjia.com looks better stylistically, I opted for that.

Interestingly enough, the configuration options for apex domains and for subdomains are rather different. For subdomains, the directions state that I need to add a CNAME record that points from www.jamesjia.com to jamesjia94.github.io. For apex domains, the directions state that I need to add edit the A record associated with jamesjia.com. What's up with that?

The CNAME record was designed to establish aliases. It consists of a name (the alias), a type, and a value (the canonical name/actual name). In my case, the record would look a little like this.
{% highlight ruby %}
NAME              TYPE   VALUE
www.jamesjia.com  CNAME  jamesjia94.github.io
{% endhighlight %}
The [IEEE RFC1034][rfc-1034] specification states that the `VALUE` of a CNAME record must be another domain name, not an IP address, AND that if a CNAME record is present, no other records can be present. This ensures that the alias cannot point to a different IP address compared to its canonical name.

Now, why can't we use a CNAME record for an apex domain? After all, isn't jamesjia.com just an alias for jamesjia94.github.io? Well, yes, but apex domains are a little special. The apex domain defines a zone of authority, and provides identification of its authoritative nameservers through a NS record. In turn, these nameservers house the mapping of the domain names of its subdomains to their respective IP addresses.

Remember how CNAME records can't coexist with other records? Since apex domains require a NS record, it cannot have a CNAME record, and must have use an A record instead. The A record directly maps a domain name to the IP address. Remember, the pitfall of the A record is that GitHub's content servers may change IP addresses, [as it has before][github-DNS-change], which would require a manual edit on our part.

Notably, some hosting services such as CloudFlare support CNAME records at the apex level. However, it [turns out][cloudflare-CNAME-flatten] that the CNAME record is actually transformed into an A record during a DNS query. Essentially, the CloudFlare server does its own DNS resolution to come up with an A record, and presents that "A record" as the response to the original query. Although this is a really cool trick, it has resulted in much confusion, namely that it is okay to circumvent the RFC requirement altogether.

## Redirection
Lastly, GitHub has a cool [feature][github-redirect] that automatically creates redirects between the `www` subdomain and corresponding apex domain. Reading all this didn't go to waste!

Note: I use it for this website. 

## Resources
[StackOverflow][so]

[GitHub][github-custom-domain]

[RFC1034][rfc-1034]

[Wikipedia][wiki]

[cloudflare-CNAME-flatten]: https://support.cloudflare.com/hc/en-us/articles/200169056-CNAME-Flattening-RFC-compliant-support-for-CNAME-at-the-root
[github-custom-domain]: https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/
[github-DNS-change]: https://github.com/blog/1715-faster-more-awesome-github-pages
[github-redirect]: https://help.github.com/articles/tips-for-configuring-an-a-record-with-your-dns-provider/#configuring-a-www-subdomain
[rfc-1034]: https://tools.ietf.org/html/rfc1034
[so]: http://serverfault.com/questions/613829/why-cant-a-cname-record-be-used-at-the-apex-aka-root-of-a-domain
[wiki]: https://en.wikipedia.org/wiki/Domain_Name_System