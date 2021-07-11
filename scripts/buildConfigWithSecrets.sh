#/bin/bash

main(){
    source hugo_site/secrets.env
    envsubst < hugo_site/config.without_secrets.yaml > hugo_site/config.with_secrets.yaml
}

main