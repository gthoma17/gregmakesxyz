build: 
	hugo \
		--source="hugo_site/" \
		--destination="../public/" \
		--buildDrafts=false \
		--cleanDestinationDir=true \
		--debug=true \
		--gc=true \
		--verbose=true

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
		public/ \
		gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net:/home/public

serve: 
	hugo serve \
		--source="hugo_site/" \
		--buildDrafts=true

deploy: build publish
	echo "👍"
