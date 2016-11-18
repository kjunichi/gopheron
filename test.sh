#!/bin/sh
import -window root no.png
electron --use-gl=osmesa . &
sleep 8
import -window root gopheron.png
composite -compose difference no.png gopheron.png diff.png
result=`identify -format "%[mean]" diff.png|awk '{printf("%d",$1 + 0.5)}'`
if [ $result -gt 0 ] ; then
 echo "OK"
else
 exit 1
fi
ls -ltr `npm config get prefix`/lib/node_modules/electron/dist
git clone https://github.com/eddieantonio/imgcat
cd imgcat;CC=clang make;cd ..
pwd
ls -ltr
identify -list format
imgcat/src/imgcat --width 80 ./gopheron.png
