#/bin/bash

set -ex

build_hugo_site(){
    pushd hugo_site
        hugo \
            --config="config.toml" \
            --destination="../public/" \
            --buildDrafts=false \
            --cleanDestinationDir=true \
            --enableGitInfo=true \
            --gc=true \
            --verbose=true
    popd
}

main(){
    build_hugo_site
}

main
