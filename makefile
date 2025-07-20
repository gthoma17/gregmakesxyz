deploy: build publish
	echo "👍"

publish:
	rsync \
		--archive \
		--verbose \
		--compress \
		--human-readable \
		--progress \
		--rsh=ssh \
		--delete \
		--recursive \
		--exclude analytics/ \
		--exclude .nfsn-awicons/ \
		astro_site/dist/ \
		gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net:/home/public

build: get-webmentions
	cd astro_site && npm run build

get-webmentions:
	python scripts/getWebmentions.py 

bootstrap-analytics:
	rsync \
		--archive \
		--compress \
		--rsh=ssh \
		nfsn_config/awstats.conf \
		gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net:/home/tmp && \
		\
	rsync \
		--archive \
		--compress \
		--rsh=ssh \
		nfsn_config/updateAnalytics.sh \
		gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net:/home/protected && \
		\
	ssh -t gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net \
		mkdir /home/public/analytics && \
		\
	ssh -t gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net \
		"/usr/local/bin/nfsn add-cron updateAnalytics "/home/protected/updateAnalytics.sh" me ssh '?' '*' '*'" && \
	ssh -t gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net \
		bash /home/protected/updateAnalytics.sh && \
	ssh -t gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net \
		cp -r /usr/local/www/awstats/icon /home/public/.nfsn-awicons && \
	echo "👍"

serve: 
	cd astro_site && npm run dev