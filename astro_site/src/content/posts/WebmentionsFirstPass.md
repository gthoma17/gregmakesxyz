---
title: "Webmentions First Pass"
date: 2023-02-04T23:14:14-07:00
draft: false
series:
  - "Syndicated"
---

I've done a lot of work to this site since my last post. First and foremost, I got Webmentions setup 🎉🎊🕺. I've documented the step-by-step setup in [the repo](https://github.com/gthoma17/gregmakesxyz/blob/main/nfsn_config/README.md#to-setup-go-jamming-webmentions-for-this-site) already, so I won't repeat it here but I thought it would be fun to record who helped me out (and send them webmentions 😜).

<!--more-->

I unfortunately don't remember what turned me on to the idea of webmentions originally. I think it was around 2021 when I was building my first implementation of this website, but my design goals at the time were modest ("I just want an internet billboard that I actually own") and webmentions seemed more complicated than I was willing to deal with.

When I got this site up and running again this January I decided to use it as an excuse to explore how feature-full I can make a completely static, NoJS friendly website. Once I'd implemented most of the [features](/posts/mynextstaticsitegenerator/) I was [interested](/posts/backinbusiness/) in I started to consider what else I explore through my personal website and I remembered webmentions.

I won't say that integrating webmentions wasn't complicated, but I _was_ delighted several times by the quality of the tools I found 😄

I started my search on the [Indie Wiki](https://indieweb.org/Webmention), `ctrl-f hugo` and took a look through the sites that folks that had kindly linked. This is where I first heard of Wouter Groeneveld's [fantasic project `go-jamming`](https://brainbaking.com/post/2021/05/beyond-webmention-io/) which was ultimately the solution I went with.

The idea of owning my webmention server was immediately appealing to me, and the process of getting the [project running on NFSN](https://github.com/gthoma17/gregmakesxyz/blob/main/nfsn_config/README.md#to-setup-go-jamming-webmentions-for-this-site) was super easy.

Next I had to integrate webmentions into my templates.

Since I had already made my templates microformats aware, I "only" had to work out how to retrieve the mentions and display them.

All of the examples I found of [folks](https://brainbaking.com/post/2021/05/beyond-webmention-io/) including [mentions](https://jlelse.blog/micro/2019/12/2019-12-12-znats) in [their](https://paul.kinlan.me/using-web-mentions-in-a-static-sitehugo/) Hugo templates made use of the `data/` folder, but I decided that I wanted to keep mentions in my repo near the content they mention. So I wrote a quick [python script](https://github.com/gthoma17/gregmakesxyz/blob/e022c30aa964c9195b4044093b0a2f0496aed37c/scripts/getWebmentions.py) to grab the mentions, partition them by target, and write them to a file in the appropriate page bundle.

Fortunately Hugo makes it easy to [read data files from the page bundles](https://gohugo.io/functions/transform.unmarshal/) which made writing a [basic partial](https://github.com/gthoma17/gregmakesxyz/blob/e022c30aa964c9195b4044093b0a2f0496aed37c/hugo_site/layouts/partials/webmention-inbound.html) for displaying them pretty simple.

I should note that up until this point I wasn't working with any _real_ webmentions.

Since I hadn't worked out how to _send_ webmentions yet I was simply making use of some demo data from go-jamming's documentation to build out my templates. While reading around about webmentions I'd seen several references to [Aaron Pareki's famous article](https://aaronparecki.com/2018/06/30/11/your-first-webmention) on sending webmentions and decided it was time to give that a read.

This is when I first noticed a reference to webmention specific microformats. I found it a bit difficult to find information on this, but essentially, this isn't part of the W3 Webmentions recommendation, but in practice many webmention server implementations will parse the source page for microformats and depending on which properties are present on the target link they'll determine a webmention 'type'. I found the list of relevant properties in go-jamming's [source](https://git.brainbaking.com/wgroeneveld/go-jamming/src/commit/4c2326b887c2e13a19d00bb3b8a75e71cfc4d638/app/mf/microformats.go#L233) and thought about how to integrate them into my [templates](https://github.com/gthoma17/gregmakesxyz/blob/e022c30aa964c9195b4044093b0a2f0496aed37c/hugo_site/layouts/partials/webmention-outbound.html).

I decided that for now at least, only my notes will support mention types. Since most mentions in posts are referential or in passing -- and because I wanted to get something out the door already 😜

Maybe I'll add some shortcodes for creating semantic webmention links later on.

Finally I set about figuring out how to automate sending mentions. I lost a lot of time here to something I didn't see documented anywhere, but was consistent across several Webmention sender implementations.

While I was following along with [_Your First Webmention_](https://aaronparecki.com/2018/06/30/11/your-first-webmention) I'd posted a note to my website which referenced another note on my website and issued a `curl` request to my go-jamming server to kick the tires.

This worked exactly like I'd expected, the mention showed up in the admin panel and got included in the build once I approved it.

First I tried to use go-jamming's RSS feed parsing feature in the build after the new site is deployed. But unfortunately go-jamming wasn't sending/receiving mentions for new content that referred to other content on my site. This was the only sort of mention I was working with at the time so it appeared to me that nothing at all was sending. Turning on the debug flag made the logs format much more nicely, but didn't reveal any extra information.

Second I attempted to use Remy Sharp's [Webmention.app](https://webmention.app) to send mentions[^1]. This operates on the same principle as go-jamming's sending feature: parse an RSS feed for mentions then send. Unfortunately this had the same result. I wasn't seeing any new mentions being sent to my go-jamming server no matter how many links I added to other pages on my site.

Fortunately Webmention.app's debugging provided more insight. I could see that if I added more links to content on other sites those would be sent. Only "self links" were failing to send. I took a look through Webmention.app's repo and found it's a [known issue](https://github.com/remy/wm/issues/30). I'm not sure what the limitation is here, but I can imagine that whatever led to this bug in Webmention.app, the same complexity could lead to a bug in go-jamming

Eventually I setup a second website with a second go-jamming server and sent some mentions between them to validate, and everything seems to be working.

And there you have it. I've got webmentions up and running for an estimated $0.21 per month. Hopefully I can find some time to investigate why self mentions aren't sending soon 😃

[^1]: As it happens the Webmention.app [was down](https://remysharp.com/2023/01/30/on-vercel-if-some-of-my-sites-are-down) while I was doing this experimenting, but thankfully it was easy to [run it locally](https://github.com/remy/wm) with `npx` 😄
