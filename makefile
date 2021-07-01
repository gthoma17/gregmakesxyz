build:
	cd hugo_site; \
	hugo -D; \
	cd ..; \
	rm -r public; \
	cp -r hugo_site/public .

publish:
	./scripts/updateSite.sh
