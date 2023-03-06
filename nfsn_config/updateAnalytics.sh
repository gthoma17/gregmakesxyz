res=`/usr/local/www/awstats/tools/awstats_buildstaticpages.pl -config=nfsn -update -dir=/home/public/analytics`
ret=$?

if [ $ret -ne 0 ]; then
	echo "This run failed, here's the stdout: "
	echo $res
fi

exit $ret