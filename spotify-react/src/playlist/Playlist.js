import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./Playlist.css";

const fields = "name,description,images,tracks.items(track(album,artists,duration_ms,id,name,uri))";

class Playlist extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      playlist: undefined
    };
  }

  componentDidMount() {
    const url_info = `https://api.spotify.com/v1/playlists/${this.props.playlistURI}?fields=${fields}`;
    axios.get( url_info, { headers: { "Authorization": `Bearer ${this.props.spotify.access_token}` } } )
         .then( response => {
           this.setState( { playlist: response.data } );
         } );
  }

  render() {

    let toRender = (
      <div>Loading</div>
    );

    if ( this.state.playlist ) {
      toRender = (
        <div>
          <h1>{this.state.playlist.name}</h1>
          <img alt="playlist-cover" src={this.state.playlist.images[ 1 ].url}/>

          <div id="songs-container">
            {this.state.playlist.tracks.items.map( ( t, i ) => {
              return (
                <button className="song-item" onClick={() => this.props.playSong( t.track.uri )}
                        key={i}>{t.track.name}</button>
              );
            } )}
          </div>
        </div>
      );
    }

    return (
      toRender
    );
  }
}

Playlist.propTypes = {
  playlistURI: PropTypes.string.isRequired,
  spotify: PropTypes.object.isRequired,
  playSong: PropTypes.func.isRequired
};

export default Playlist;
