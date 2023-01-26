---
title: "The Road to Webmentions"
date: 2023-01-25
draft: false
series:
- "Webmentions Implementation"
---

I really like the idea of [Webmentions](https://www.w3.org/TR/webmention/) and the opportunity they present to live a less siloed life on the web.

Hopefully I can add Webmentions to this site without too much trouble, is a list[^1] of my design goals:
<!--more-->
* No client-side Javascript

* The server for recieving Webmentions can be hosted economically
	* My prefered host is [NearlyFreeSpeech](https://www.nearlyfreespeech.net) which supports [several languages](https://2022q3.nfshost.com/)

* A copy of the Webmention is stores in the git repo

* Webmentions are stored near the mentioned content

So far I've only heard of https://webmentions.io, but unfortunately I think it requires Javascript to work. Since a primary design goal of this site is to be NoJS friendly that isn't going to work for me 😅

Luckily Webmentions are an open standard, so I'm sure there are plenty of implementations availiable. Worst case scenario I have a fun excuse to write my own 

[^1]: In priority order 😉