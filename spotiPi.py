# TODO
#   - create Arist, Album classes
#   - create toDict methods for them
#   - use pyalsaaudio to tweak volume
import spotify
import threading
from collections import deque

class SpotiPi:
    def __init__(self, uname, pw, sink):
        self.userName = uname
        self.playlists = []
        self.queue = deque()

        self.loggedIn = False
        self.status = "stopped"
        self.loggedInEvent = threading.Event()

        self.session = spotify.Session()

        if (sink == "alsa"):
            self.player = spotify.AlsaSink(self.session)
        elif (sink == "port"):
            self.player = spotify.PortAudioSink(self.session)
        else:
            print "unrecognized sink option: " + sink
            print "playback unavailable"

        self.loop = spotify.EventLoop(self.session)
        self.loop.start()

        self.session.on(
            spotify.SessionEvent.CONNECTION_STATE_UPDATED,
            self.connectionListener
        )

        self.session.on(
            spotify.SessionEvent.END_OF_TRACK,
            self.playNextTrack
        )

        self.session.login(uname, pw)

        while not self.loggedInEvent.wait(0.1):
            self.session.process_events()

        self.loggedIn = True

    def connectionListener(self, session):
        if session.connection.state is spotify.ConnectionState.LOGGED_IN:
            self.loggedInEvent.set()

    def loadPlaylists(self):
        playLists = self.session.playlist_container

        if not playLists.is_loaded:
            playLists.load()

        for pList in playLists:
            pList.load()

        for pList in playLists:
            thisPlayList = Playlist()
            thisPlayList.name = pList.name
            theseTracks = []

            for track in pList.tracks:
                thisTrack = Track()
                thisTrack.title = track.name
                thisTrack.artist = track.artists
                thisTrack.album = track.album
                thisTrack.duration = track.duration
                thisTrack.uri = track.link.uri
                theseTracks.append(thisTrack)

            thisPlayList.tracks = theseTracks
            thisPlayList.numTracks = len(theseTracks)
            # it might make more sense to use a dict for playlists
            # where key == playlist name and value is thisPlaylist
            self.playlists.append(thisPlayList)

    def logOut(self):
        self.session.logout()
        self.loggedIn = False

    def loadTrack(self, track):
        uri = track.uri
        track = self.session.get_track(uri)
        track.load()
        self.session.player.load(track)

    def play(self):
        self.session.player.play(1)
        self.status = "playing"

    def pause(self):
        self.session.player.pause()
        self.status = "paused"

    def stop(self):
        self.session.player.play(0)
        self.status = "stopped"

    def playTrackUri(self, trackUri):
        # add a playerState to self ("playing" or "paused")
        # check it, pause if playing first
        track = self.session.get_track(trackUri)
        track.load()
        self.session.player.load(track)
        self.play()

    def enqueue(self, track):
        self.queue.append(track)

    def dequeue(self):
        if (len(self.queue) > 0):
            return self.queue.popleft()
        else:
            return False

    def playTrack(self, track):
        if (track):
            if (self.status == "playing"):
                self.stop()

            self.nowPlaying = track
            track = self.session.get_track(track.uri)
            track.load()
            self.session.player.load(track)
            self.play()
            self.status = "playing"

            # probably put me in a function
            #print "now playing"
            #print "Title: " + track.title
            #print "Artist: " + track.artist

        else:
            print "attempted to play False"

    def playNextTrack(self, thing):
        if (len(self.queue) > 0):
            track = self.dequeue()

            if (track):
                self.playTrack(track)

    def playPlaylist(self, pl):
        if (self.status == "playing"):
            self.stop()

        self.queue.clear()
        print "cleared queue"

        for track in pl.tracks:
            self.enqueue(track)

        print "finsihed enqueing tracks"
        print "queue:"
        print self.queue

        # fix this
        self.playNextTrack("thing")

    def playPlaylistFrom(self, playListIndex, songIndex):
        if (self.status == "playing"):
            self.stop()

        self.queue.clear()
        pl = self.playlists[playListIndex]

        for track in pl.tracks[songIndex:]:
            self.enqueue(track)

        # fix this
        self.playNextTrack("thing")

class Playlist:
    def __init__(self):
        self.name = None
        self.tracks = []
        self.numTracks = len(self.tracks)

    def toDict(self):
        dic = {}
        tracks = []
        dic['name'] = self.name
        dic['numTracks'] = self.numTracks

        for track in self.tracks:
            tracks.append(track.toDict())

        dic['tracks'] = tracks

        return dic

class Track:
    def __init__(self):
        self.title = None
        self.artist = None
        self.album = None
        # in miliseconds
        self.duration = None
        self.uri = None

    def toDict(self):
        dic = {}
        dic['title'] = self.title
        # dic['artist'] = self.artist
        # dic['album'] = self.album
        dic['duration'] = self.duration
        dic['uri'] = self.uri

        return dic
