SpotiPi
=======

Description
-----------
SpotiPi provides a web interface to your Spotify account.  The idea is to run the program
on a Raspberry Pi (although any computer running a *nix operating system should work) and to
control playback from other devices on the network.

Usage
-----
- Read help
```shell
$ python main.py --help
```
- Start the app
```shell
$ python main.py
```
- Visit <raspberryIP>:5000
- View playlists
- Add tracks to play queue (+), or play a playlist from track onward (>)
- Tell the Pi to play music (expand controls, click play)
- Profit

Dependencies
------------
- [Python 2.7](https://www.python.org/downloads/)
- A Spotify premium account
- [libspotify](https://developer.spotify.com/technologies/libspotify/) 
- A Spotify [application key](https://devaccount.spotify.com/my-account/keys/)
- libasound2-dev or portaudio19-dev details [here](https://pyspotify.mopidy.com/en/latest/api/sink/#spotify.AlsaSink) (*note:* portaudio has a terrible [bug](https://github.com/mopidy/pyspotify/issues/132))
- [Node.js](http://nodejs.org)
- [Bower](http://bower.io)

Installation
------------
- Clone the repo
```shell
$ git clone git@github.com:farmerpat/spotipi.git
```
- Place application key in repo directory
```shell
$ mv /path/to/key/spotify_appkey.key /path/to/repo/spotipi
```
- Install front-end dependencies
```shell
$ bower install
```
- Install [pyspotify](https://pyspotify.mopidy.com/en/latest/installation/)
- Install additional python dependencies
```shell
$ sudo pip install flask
```
```shell
$ sudo pip install flask-bower
```
```shell
$ sudo pip install pyalsaaudio # for use with libasound
```
```shell
$ sudo pip install pyaudio # for use with port audio
```
- Replace place-holders with your Spotify credentials in config.ini (or point main.py to your .ini file with -c flag)
- If you want to use portaudio instead of alsa, change alsa to port in config.ini

TODO
----
- support multi-artist tracks
- use pyalsaaudio to tweak volume
- integrate Spotify searches
- allow playlist creation
- beautify/responsify web interface (ala bootstrap?)
