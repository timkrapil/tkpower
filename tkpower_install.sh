#installer

sudo apt-get update
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install -y build-essential python-dev python-rpi.gpio nodejs netatalk redis-server



sudo npm install forever -g

npm install

sudo cp /home/pi/tkpower/tkpower-plotwatt
sudo chmod a+x /etc/init.d/tkpower-plotwatt
sudo update-rc.d tkpower-plotwatt defaults

sudo cp /home/pi/tkpower/tkpower-loggly
sudo chmod a+x /etc/init.d/tkpower-loggly
sudo update-rc.d tkpower-loggly defaults

sudo cp /home/pi/tkpower/tkpower-logger
sudo chmod a+x /etc/init.d/tkpower-logger
sudo update-rc.d tkpower-logger defaults

sudo cp /home/pi/tkpower/tkpower-collector
sudo chmod a+x /etc/init.d/tkpower-collector
sudo update-rc.d tkpower-collector defaults
