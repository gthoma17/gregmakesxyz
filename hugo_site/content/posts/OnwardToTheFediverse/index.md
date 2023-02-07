---
title: "Onward to the Fediverse!"
date: date: 2023-02-06T17:09:33-07:00
draft: true
series:
  - "Syndicated"
---

https://paul.kinlan.me/adding-activity-pub-to-your-static-site/ looks like a good jumping off point

Takeaways:
* Need a few static files with a special content-type
  * webfinger identifies you as a fediverse thing
  * actor points to activitypub stuff (inbox, outbox, followers etc)
  * outbox; like an activitypub rss feed
* Need a daemon that can:
  * recieve follow/unfollow messages (inbox)
  * send followers a POST when new content is added

Special content type for static file: https://stackoverflow.com/questions/42316222/custom-http-header-for-a-specific-file