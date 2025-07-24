# Set SSH_HOST default if it's not set or is empty
ifeq ($(SSH_HOST),)
SSH_HOST = SSH_HOSTNAME_MUST_BE_SET_IN_THE_ENVIRONMENT
endif

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
		$(SSH_HOST):/home/public

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
		$(SSH_HOST):/home/tmp && \
		\
	rsync \
		--archive \
		--compress \
		--rsh=ssh \
		nfsn_config/updateAnalytics.sh \
		$(SSH_HOST):/home/protected && \
		\
	ssh -t $(SSH_HOST) \
		mkdir /home/public/analytics && \
		\
	ssh -t $(SSH_HOST) \
		"/usr/local/bin/nfsn add-cron updateAnalytics "/home/protected/updateAnalytics.sh" me ssh '?' '*' '*'" && \
	ssh -t $(SSH_HOST) \
		bash /home/protected/updateAnalytics.sh && \
	ssh -t $(SSH_HOST) \
		cp -r /usr/local/www/awstats/icon /home/public/.nfsn-awicons && \
	echo "👍"

serve: 
	cd astro_site && npm run dev