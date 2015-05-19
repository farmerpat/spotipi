from spotiPi import SpotiPi
import ConfigParser
import argparse

def main():
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
    sp = SpotiPi(uname, pw)

    sp.loadPlaylists()

    import time

    pl = sp.playlists[1]
    track = pl.tracks[0]
    sp.loadTrack(track)
    sp.play()

    time.sleep(10)

    sp.pause()

    sp.logOut()

if __name__=="__main__": main()
