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
		public/ \
		gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net:/home/public

build: get-webmentions
	hugo \
		--source="hugo_site/" \
		--destination="../public/" \
		--buildDrafts=false \
		--cleanDestinationDir=true \
		--debug=true \
		--gc=true \
		--verbose=true

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
	hugo serve \
		--source="hugo_site/" \
		--buildDrafts=true

note:
	hugo --source hugo_site new --kind=notes notes/`date +'%Y/%m/%d/%H:%M'`

post:
	hugo --source hugo_site new --kind=posts posts/new
