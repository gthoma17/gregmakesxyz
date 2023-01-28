
awstatsConfig='''
SiteDomain="gregmakes.xyz"
HostAliases="gregmakesxyz.nfshost.com www.gregmakes.xyz"
LogFile="/home/logs/access_log"
'''
echo $awstatsConfig > /home/tmp/nfsn-awstats.conf

/usr/local/www/awstats/tools/awstats_buildstaticpages.pl -config=nfsn -update -dir=/home/public/analytics

ln -sf /home/public/awstats/awstats.nfsn.html /home/public/awstats/index.html