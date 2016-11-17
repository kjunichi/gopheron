#!/bin/sh
import -window root no.png
electron . &
sleep 3
import -window root gopheron.png
composite -compose difference no.png gopheron.png diff.png
result=`identify -format "%[mean]" diff.png|awk '{printf("%d",$1 + 0.5)}'`
if [ $result -gt 0 ] ; then
 echo "OK"
else
 exit 1
fi

