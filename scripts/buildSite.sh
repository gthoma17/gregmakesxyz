#/bin/bash

set -ex

remove_old_build(){
    set +e
    rm -r hugo_site/resources/_gen/*
    rm -r public
    set -e
}

build_hugo_site(){
    pushd hugo_site
        hugo \
            --config="config.with_secrets.yaml" \
            --destination="../public/" \
            --buildDrafts=true \
            --cleanDestinationDir=true \
            --enableGitInfo=true \
            --gc=true \
            --print-mem=true \
            --verbose=true
    popd
}

add_non_hugo_assets(){
    cp -a non_hugo_assets/. public
}

main(){
    remove_old_build
    build_hugo_site
    add_non_hugo_assets
}

main