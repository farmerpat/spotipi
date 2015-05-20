# TODO
#   - create Arist, Album classes
#   - create toDict methods for them
import spotify
import threading

class SpotiPi:
    def __init__(self, uname, pw):
        self.userName = uname
        self.playlists = []

        self.loggedIn = False
        self.loggedInEvent = threading.Event()

        self.session = spotify.Session()
        self.player = spotify.PortAudioSink(self.session)
        self.loop = spotify.EventLoop(self.session)
        self.loop.start()

        self.session.on(
            spotify.SessionEvent.CONNECTION_STATE_UPDATED,
            self.connectionListener)

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
        self.session.player.play()

    def pause(self):
        self.session.player.pause()

    def playTrackUri(self, trackUri):
        # add a playerState to self ("playing" or "paused")
        # check it, pause if playing first
        track = self.session.get_track(trackUri)
        track.load()
        self.session.player.load(track)
        self.play()

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
