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
print "making spot"
sp = SpotiPi(uname, pw)
print "made spot"

sp.loadPlaylists()

# pl = sp.playlists[1]
# track = pl.tracks[0]
# sp.loadTrack(track)
# sp.play()

# time.sleep(10)

# sp.pause()

# sp.logOut()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/playlists")
def getPlaylists():
    playLists = []

    print sp.playlists
    for l in sp.playlists:
        playLists.append(l.toDict())

    return jsonify(playlists=playLists)

if __name__=="__main__":
    app.run()
