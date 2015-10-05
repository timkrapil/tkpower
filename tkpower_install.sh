#installer

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install -y build-essential python-dev python-rpi.gpio nodejs netatalk redis-server


sudo /etc/init.d/netatalk stop
sudo echo ~/			\"Home Directory\" >> /etc/netatalk/AppleVolumes.default
sudo echo /media 	\"Media\" >> /etc/netatalk/AppleVolumes.default
sudo echo /mount			\"mount\" >> /etc/netatalk/AppleVolumes.default

sudo /etc/init.d/netatalk start

sudo npm install forever -g
