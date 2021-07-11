#/bin/bash

set -ex

remove_old_build(){
    set +e
    rm -r hugo_site/resources/_gen/*
    rm -r public
    set -e
}

build_new_site(){
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

main(){
    remove_old_build
    build_new_site
}

main