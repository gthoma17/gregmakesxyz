#/bin/bash

ssh gregmakesxyz_gregmakesxyz@ssh.phx.nearlyfreespeech.net -C rm -r "/home/public/*" | true

sftp gregmakesxyz_gregmakesxyz@ssh.phx.nearlyfreespeech.net <<< $'put -r public/*'