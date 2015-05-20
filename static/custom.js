$(document).ready(function () {
  console.log("reddie");

  $("#now_playing").click(function () {
    console.log("clikked now playing");
  });

  $("#play_queue").click(function () {
    console.log("clikked play queue");
  });

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
    console.log(playlists[0]);
    $("#button-container").after(
      $("<div id='playlists'></div>")
    );

    $.each(playlists, function (i, playlist) {
      var html = "<h3>";
      html += playlist.name;
      html += "</h3>";
      html += "<div><p>";
      // add data-spotify-playlist-uri
      html += "<ul><li><a class='spotify-playlist-link play-all-link' href='#'>Play All</a></li>";

      $.each(playlist.tracks, function (j, track) {
        html += "<li><a class='spotify-track-link' href='#' data-spotify-track-uri='";
        html += track.uri;
        html += "'>";
        html += track.title;
        html += "</a></li>";
      });

      html += "</ul></p></div>";

      $("#playlists").append($(html));
      //$("#playlists").after($(html));
    });

    $("#playlists").accordion({active: false, collapsible: true});
    //$("#playlists ul").hide();

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
  }
});
