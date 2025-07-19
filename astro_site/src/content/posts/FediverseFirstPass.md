---
title: "Fediverse First Pass"
date: 2023-04-12T21:08:45-06:00
draft: false
showmeta: true
---

For a while I've been curious about the Fediverse, but haven't made the time to explore it.

I'm going to try and add some Fediverse interoperability to this site and see where it takes me 😁

While I was setting up webmentions for this site I saw a lot of chatter about https://fed.brid.gy/ and although I *think* that working with Bridgy will mean giving up some amount data sovereignty, I think it'd be nice to dip my toes into the Fediverse without having to do all the work of setting up an ActivityPub server, web finger, et al without knowing it'll be worth it 😅

___

#### Update

Having just setup BridgyFed I can say I'm pretty happy with the compromises so far.  I think I'll investigate self-hosting an instance later since  I don't love that I'm relying on a service that I'm not paying for, but aside from that the setup process has been pretty delightful 😊

I'll fully document the setup in the site's repo later on, but for the most part I only had to alter the configuration to redirect some URLs to Bridgy and everything else builds on top of this site's [existing Webmentions configuration](https://gregmakes.xyz/posts/webmentionsfirstpass/)

One thing that I appreciate about about Bridgy is that things are only bridged into the Fediverse if a Webmention is explicitly sent to them.

I've decided to include a link for this in all my [/notes](notes), but I'm only going to share posts if I choose to. To that end I've made a shortcode called `{{ federate }}`, here's how it looks:

{{< federate >}}

The downside to this is that much of my site's content will have ostensibly superfluous links in them. I'm fine with this compromise until I have the time & motivation to reconsider 😄

There are a few alterations I want to make to my theme to enable smooth interactions with the Fediverse I plan to:
- Create a new category for social media activities (likes, reposts, follows)
- Maybe add hashtags
- Think about how to enable socially visible edits 🤔
