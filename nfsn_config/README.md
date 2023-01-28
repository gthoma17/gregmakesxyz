# This site and its associated services is hosted on [Nearly Free Speech](https://www.nearlyfreespeech.net)

Here I'll document how I've set things up for posterity

This documentation is accurate as of it's last check on: 2023-01-28

## Bootstrapping the website
* Fork this repository
* Generate an ssh key `ssh-keygen -t ed25519 -C "<some-email>"`
* Create a new site on NFSN, this site is static so any server-type will do.
* Create two [Github Action secrets](https://github.com/gthoma17/gregmakesxyz/settings/secrets/actions)
	1) SSH_KEY: \<your public key>
	2) KNOWN_HOSTS: [NearlyFreeSpeech's ssh fingerprints](https://faq.nearlyfreespeech.net/q/nfsnsshkeys)
* Next time you commit to the main branch the github actions will build and deploy your site to NFSN

## To setup analytics for this site:
* Create a file 
* Run `make bootstrap-analytics` to setup awstats on NFSN
* Setup a [scheduled task](https://faq.nearlyfreespeech.net/q/cron) to run:
	 * `/usr/local/www/awstats/tools/awstats_buildstaticpages.pl -config=nfsn -update -dir=/home/public/awstats` 
* Your analytics will be availiable at https://\<your-website>/analytics/awstats.nfsn.html

## To setup go-jamming webmentions for this site:
* Create a new site on a server-type which allows for daemons
* [ssh](https://faq.nearlyfreespeech.net/full/ssh#ssh) into the site and follow the (simple!) steps to build and configure go-jamming
	* [This faq](https://faq.nearlyfreespeech.net/q/directories) should help you understand which folder to build in 😉
	* You can validate that it's working by running `./go-jamming &`[^1] 
	then `curl localhost:<port>/feed/<domain>/<token>`. If you don't get a 404 it's working 
* Setup a daemon to run go-jamming with these parameters:
	* tag: \<whatever you want>
	* Command Line: \<install directory>/go-jamming [^2]
	* Working  Directory: \<install directory>
	* Run Daemon As: **me**
* Setup a proxy with these parameters:
	* Protocol: http
	* Base URI: /
	* Document Root: /
	* Target Port: \<the port from your go>
* go-jamming is now setup and ready to use.[^3] 

[^1]: make sure to kill this background process when you're done or your daemon will fail to start
[^2]: If you search the NFSN FAQ for [docs on daemons](https://faq.nearlyfreespeech.net/q/runscript) it'll recommend you create a run script, but since go-jamming didn't require any arguments for my setup this was unnessesary 
[^3]: [go-jamming's usage documentation](https://git.brainbaking.com/wgroeneveld/go-jamming/src/branch/master/README.md#what-does-it-do) is pretty complete