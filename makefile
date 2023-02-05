build: get-webmentions
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
		--exclude analytics/ \
		public/ \
		gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net:/home/public

serve: 
	hugo serve \
		--source="hugo_site/" \
		--buildDrafts=true

get-webmentions:
	python scripts/getWebmentions.py 

note:
	hugo --source hugo_site new --kind=notes notes/`date +'%Y%m%d%H%M'`

post:
	hugo --source hugo_site new --kind=posts posts/new

deploy: build publish
	echo "👍"
