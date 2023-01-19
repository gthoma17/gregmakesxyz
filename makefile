build: 
	bash scripts/buildSite.sh

publish:
	bash scripts/updateSite.sh

serve: 
	cd hugo_site; \
	hugo serve -D --config="config.toml"

deploy: build publish
	echo "👍"
