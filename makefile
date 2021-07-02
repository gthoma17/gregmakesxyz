build:
	cd hugo_site; \
	rm -r resources/_gen/*; \
	hugo -D; \
	cd ..; \
	rm -r public; \
	cp -r hugo_site/public .

publish:
	ssh gregmakesxyz_gregmakesxyz@ssh.phx.nearlyfreespeech.net -C rm -r "/home/public/*"; \
	sftp gregmakesxyz_gregmakesxyz@ssh.phx.nearlyfreespeech.net <<< $'put -r public/*'

serve:
	cd hugo_site; \
	hugo serve -D

deploy: build publish
	echo "👍"

