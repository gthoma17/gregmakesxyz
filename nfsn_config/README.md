To setup analytics for this site:
	* Run `make bootstrap-analytics` to setup awstats on NFSN
	* Setup a (scheduled task)[https://faq.nearlyfreespeech.net/q/cron] to run `/usr/local/www/awstats/tools/awstats_buildstaticpages.pl -config=nfsn -update -dir=/home/public/awstats` however often you'd like the analytics updated
	* ln -sf /home/public/awstats/awstats.nfsn.html /home/public/awstats/index.html

