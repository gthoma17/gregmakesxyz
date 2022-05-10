build: 
	npx hexo generate --cwd hexo-site; \
	cp HOMEPAGE.html hexo-site/public/index.html

publish:
	ssh gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net \
		-C rm -r /home/public/* | true; \
	rsync 
		--archive \
		--verbose \
		--compress \
		--human-readable \
		--progress \
		--rsh=ssh \
		--recursive \
		public/ gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net:/home/public

serve: build
	npx hexo server --draft --cwd hexo-site

deploy: build publish
	echo "👍"
