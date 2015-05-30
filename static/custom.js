$(document).ready(function () {
  console.log("reddie");

  $("#show_controls").click(function () {
    if ($(this).text() == "Show Controls") {
      $(this).text("Hide Controls");
      $(".control_panel").show();

    } else if ($(this).text() == "Hide Controls") {
      $(this).text("Show Controls");
      $(".control_panel").hide();

    } else {
      console.log("the universe explodes");
    }
  });

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
    if ($("#play_queue").text() == "View Play Queue") {
      console.log("is da view play quee");
      $("#queue").html("<ul></ul>");
      $("#play_queue").text("Hide Play Queue");
      displayPlayQueue();

    } else {
      $("#queue").hide();
      $("#play_queue").text("View Play Queue");

    }
  });

  function displayPlayQueue() {
    $.ajax({
      method: "GET",
      url: "/playQueue",
      success: function (data) {
        if (data && data.tracks) {
          buildPlayQueue(data.tracks);
          $("#queue").show();
        }
      }
    });
  }

  function buildPlayQueue(tracks) {
    $.each(tracks, function (i, track) {
      var nodeString = "<li>";
      nodeString += track.title;
      nodeString += "</li>";

      $("#queue ul").append(nodeString);
    });
  }

  $("#view_playlists").click(function () {
    $.ajax({
      method: "GET",
      url: "/playlists",
      success: function (data) {
        if (data && data.playlists) {
          displayPlaylists(data.playlists);
        }
      }
    });
  });

  function displayPlaylists (playlists) {
    $("#button-container").after(
      $("<div id='playlists'></div>")
    );

    $.each(playlists, function (i, playlist) {
      var html = "<h3>";
      html += playlist.name;
      html += "</h3>";
      html += "<div><p>";
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

      html += "</ul></p></div>";

      $("#playlists").append($(html));
    });

    $("#playlists").accordion({active: false,
                               collapsible: true,
                               heightStyle: "content"});

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
