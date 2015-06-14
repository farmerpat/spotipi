window.playListsLoaded = false;

$(document).ready(function () {
  $("#play_button").click(function () {
    $.ajax({
      method: "GET",
      url: "/play",
      success: function (data) {
        console.log(data);
      }
    });
  });

  $("#pause_button").click(function () {
    $.ajax({
      method: "GET",
      url: "/pause",
      success: function (data) {
        console.log(data);
      }
    });
  });

  $("#skip_button").click(function () {
    $.ajax({
      method: "GET",
      url: "/skip",
      success: function (data) {
        console.log(data);
      }
    });
  });

  $("#now_playing").click(function () {
    console.log("clikked now playing");
  });

  $("#play_queue").click(function () {
    var contentType = $("#main_container").attr("contents");
    clearPlayQueue();
    buildPlayQueue();

    if (contentType != "queue") {
      $("#home").hide();
      $("#accordion").hide();
      $("#now_playing_display").hide();

      $("#queue").show();
      $("#main_container").attr("contents", "queue");
    }
  });

  function clearPlayQueue() {
    $("#queue ul").html("");
  }

  function buildPlayQueue() {
    $.ajax({
      method: "GET",
      url: "/playQueue",
      success: function (data) {
        if (data && data.tracks) {
          $.each(data.tracks, function (i, track) {
            var nodeString = "<li>";
            nodeString += track.title;
            nodeString += "</li>";
            $("#queue ul").append(nodeString);
          });
        }
      }
    });
  }

  $("#view_playlists").click(function () {
    var contType = $("#main_container").attr("contents");

    if (contType != "playlists") {
      $("#home").hide();
      $("#queue").hide();
      $("#now_playing_display").hide();

      if (!window.playListsLoaded) {
        $.ajax({
          method: "GET",
          url: "/playlists",
          success: function (data) {
            if (data && data.playlists) {
              makePlaylistsDiv(data.playlists);
              window.playLists = data.playlists;
              window.playListsLoaded = true;
              makePlaylistsDiv(window.playlists);
            }
          }
        });
      }

      $("#accordion").show();
      $("#main_container").attr("contents", "playlists");

    }
  });

  function makePlaylistsDiv (playlists) {
    var html = "";

    $.each(playlists, function (i, playlist) {
      html += "<div class='panel panel-default'>";
      html += "<div class='panel-heading' role='tab' id='";
      html += "heading" + i;
      html +="'>";
      html += "<h3 class='panel-title'>";
      html += "<a data-toggle='collapse' data-parent='#accordion' aria-expanded='false'";
      html += "href='#";
      html += "collapse" + i + "' aria-controls='collapse" + i + "'>";
      html += playlist.name;
      html += "</a></h3></div>";
      html += "<div class='panel-collapse collapse' id='collapse";
      html += i + "' aria-labelledby='heading" + i + "'";
      html += " role='tabpanel'>";
      html += "<div class='panel-body'>";
      html += "<ul><li><a data-index='";
      html += i;
      html += "' class='spotify-playlist-link play-all-link' href='javascript:void(0)'>";
      html += "Play All</a></li>";

      $.each(playlist.tracks, function (j, track) {
        var title = track.title;

        if (title.length > 65) {
          title = title.substring(0,62);
          title += "...";
        }

        html += "<li><a data-index='";
        html += j;
        html += "' ";
        html += "data-playlist-index='";
        html += i;
        html += "' ";
        html += " class='spotify-track-link'";
        html += " href='#' data-spotify-track-uri='";
        html += track.uri;
        html += "'>";
        html += title;
        html += "</a>";
        html += "<div style='float: right;'>";
        html += "<a class='spotify-play-from' href='javascript:void(0)'>></a>&nbsp;&nbsp&nbsp;";
        html += "<a class='spotify-add-to-queue' href='javascript:void(0)'>+</a>";
        html += "</div>";
        html += "</li>";
      });

      html += "</ul>";
      html += "</div></div></div>";
    });

    $("#accordion").append($(html));

    $(".spotify-track-link").click(function (e) {
      var trackUri = $(this).attr("data-spotify-track-uri");

      $.ajax({
        method: "GET",
        url: "/playtrack/" + trackUri,
        success: function (data) {
          console.log("response:");
          console.log(data);
        }
      });
    });

    $(".spotify-playlist-link").click(function (e) {
      console.log("play all!");
      var index = $(this).attr("data-index");
      $.ajax({
        method: "GET",
        url: "/playPlaylist/" + index,
        success: function (data) {
          console.log(data);
        }
      });
    });

    $(".spotify-play-from").click(function (e) {
      var trackIndex = $($(this).parent().parent().find("a")[0]).attr("data-index");
      var playListIndex = $($(this).parent().parent().find("a")[0]).attr("data-playlist-index");
      $.ajax({
        method: "GET",
        url: "/playPlaylistFrom/" + playListIndex + "/" + trackIndex,
        success: function (data) {
          console.log(data);
        }
      });
    });

    $(".spotify-add-to-queue").click(function (e) {
      var trackIndex = $($(this).parent().parent().find("a")[0]).attr("data-index");
      var playListIndex = $($(this).parent().parent().find("a")[0]).attr("data-playlist-index");
      $.ajax({
        method: "GET",
        url: "/addToQueue/" + playListIndex + "/" + trackIndex,
        success: function (data) {
          console.log(data);
        }
      });
    });
  }
});
