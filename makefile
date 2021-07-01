build:
	cd hugo_site; \
	rm -r resources/_gen/*; \
	hugo -D; \
	cd ..; \
	rm -r public; \
	cp -r hugo_site/public .

publish:
	./scripts/updateSite.sh

serve:
	cd hugo_site; \
	hugo serve -D

deploy: build publish
	echo "👍"

