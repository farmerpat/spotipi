from spotiPi import SpotiPi
import ConfigParser
import argparse
from flask import Flask, url_for, render_template, jsonify

creds = ConfigParser.ConfigParser()

parser = argparse.ArgumentParser()
parser.add_argument("-c", "--creds",
                        help="credentials.ini file")

args = parser.parse_args()

if (args.creds == None):
    creds.read("config.ini")

else:
    creds.read(args.creds)

uname = creds.get("creds", "UserName")
pw = creds.get("creds", "Password")
sink = creds.get("config", "Sink")
print "making spot"
sp = SpotiPi(uname, pw, sink)
print "made spot"

sp.loadPlaylists()

#pl = sp.playlists[39]
#sp.playPlaylist(pl)

# sp.logOut()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/playlists")
def getPlaylists():
    playLists = []

    #print sp.playlists
    for l in sp.playlists:
        playLists.append(l.toDict())

    return jsonify(playlists=playLists)

@app.route("/playtrack/<trackUri>")
def playTrack(trackUri):

    # it will be better to return the playlist's uri, and track index
    # we can then add a playlistLookUp method to SpotiPi
    # and pull the track out and use the loadTrack() and play() methods
    sp.playTrackUri(trackUri)

    status = "success"
    return jsonify(status=status)

@app.route("/playPlaylist/<playListIndex>")
def playPlaylist(playListIndex):
    sp.playPlaylist(sp.playlists[int(playListIndex)])
    # make me meaningful
    return jsonify(status="derp")

@app.route("/playPlaylistFrom/<playListIndex>/<songIndex>")
def playPlaylistFrom(playListIndex, songIndex):
    sp.playPlaylistFrom(int(playListIndex), int(songIndex))
    # make me meaningful
    return jsonify(status="derp")

@app.route("/addToQueue/<playListIndex>/<songIndex>")
def addToQueue(playListIndex, songIndex):
    track = sp.playlists[int(playListIndex)].tracks[int(songIndex)]
    print "enqueueing " + track.title
    sp.enqueue(track)
    print sp.queue
    print sp.queue
    return jsonify(status="derp")

if __name__=="__main__":
    app.run()
