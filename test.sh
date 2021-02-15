#!/bin/sh
import -window root no.jpg
electron --use-gl=osmesa . &
sleep 18
ps axuw|grep electr
import -window root gopheron.jpg
composite -compose difference no.jpg gopheron.jpg diff.jpg
result=`identify -format "%[mean]" diff.jpg|awk '{printf("%d",$1 + 0.5)}'`
if [ $result -gt 0 ] ; then
 echo "OK"
else
 exit 1
fi
# ls -ltr `npm config get prefix`/lib/node_modules/electron/dist
# ldd `npm config get prefix`/lib/node_modules/electron/dist/libosmesa.so
git clone https://github.com/eddieantonio/imgcat
cd imgcat;CC=clang make;cd ..
#pwd
#ls -ltr
#identify -list format
curl https://wsproxy-slide.herokuapp.com/upload -F images=@gopheron.jpg
imgcat/imgcat --width 90 gopheron.jpg
