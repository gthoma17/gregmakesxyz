#/bin/bash

ssh gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net -C rm -r /home/public/* | true

# sftp gregmakesxyz_gregmakesxyz@ssh.phx.nearlyfreespeech.net <<< $'put -r public/*'

rsync --archive --verbose --compress --human-readable --progress --rsh=ssh --recursive public/ gatlp9_gregmakesxyz@ssh.phx.nearlyfreespeech.net:/home/public