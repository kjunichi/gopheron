#!/bin/sh
import -window root no.png
electron . &
sleep 3
import -window root gopheron.png
composite -compose difference no.png gopheron.png diff.png
identify -format "%[mean]" diff.png
