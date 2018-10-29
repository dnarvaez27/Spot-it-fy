import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./Playlist.css";

const fields = "name,description,images";

class Playlist extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      playlist: undefined
    };
  }

  componentDidMount() {
    const url_info = `https://api.spotify.com/v1/playlists/${this.props.playlist.ID}?fields=${fields}`;
    axios.get( url_info, { headers: { "Authorization": `Bearer ${this.props.spotify.access_token}` } } )
      .then( response => {
        this.setState( { playlist: response.data } );
      } );
  }


  render() {

    let toRender = (
      <div className="cssload-spin-box"></div>
    );

    if ( this.state.playlist ) {

      toRender = (
        <div className="playlistInfoContainer">

          <img className="daImage" onClick={() => this.props.selectPlaylist( this.props.playlist.ID )}
            alt="playlist-cover" src={this.state.playlist.images[ 0 ].url}/>

          <h2 className="fixFuckup2">{this.state.playlist.name}</h2>

          <div className="paraDescription">
            <p className="fixFuckup2">{this.state.playlist.description}</p>
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
  spotify: PropTypes.object.isRequired,
  playlist: PropTypes.object.isRequired,
  selectPlaylist: PropTypes.func.isRequired,
};

export default Playlist;
