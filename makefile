build: config
	bash scripts/buildSite.sh

publish:
	bash scripts/updateSite.sh

config:
	bash scripts/buildConfigWithSecrets.sh

serve: config
	cd hugo_site; \
	hugo serve -D --config="config.toml"

deploy: build publish
	echo "👍"
