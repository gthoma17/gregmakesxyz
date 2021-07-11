build: config
	./scripts/buildSite.sh

publish:
	./scripts/updateSite.sh
	
config:
	./scripts/buildConfigWithSecrets.sh

serve: config
	cd hugo_site; \
	hugo serve -D --config="config.with_secrets.yaml"

deploy: build publish
	echo "👍"

