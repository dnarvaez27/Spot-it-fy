import React, { Component } from "react";
import "./SelectPlaylist.css";
import { withTracker } from "meteor/react-meteor-data";
import { Playlists } from "../../api/playlists.js";
import { Meteor } from "meteor/meteor";
// import { link } from "fs";
import PropTypes from "prop-types";
import Playlist from "../playlist/Playlist";

class SelectPlaylist extends Component {
  render() {

    return (
      <div className='SelectPlaylist'>

        <h1 className="playlistsTitle">Please select a playlist</h1>
        {/* <button onClick={this.props.selectPlaylist}></button> */}

        <div className="playlistsContainer">
          {this.props.playlists.map( playlist => {

            return <Playlist key={playlist._id} playlist={playlist} spotify={this.props.spotify}
              selectPlaylist={this.props.selectPlaylist}/>;
          } )}
        </div>

      </div>
    );
  }
}

export default withTracker( () => {
  Meteor.subscribe( "playlists" );

  return {
    playlists: Playlists.find( {} ).fetch(),
  };
} )( SelectPlaylist );

SelectPlaylist.propTypes = {
  playlists: PropTypes.array.isRequired,
  spotify: PropTypes.object.isRequired,
  selectPlaylist: PropTypes.func.isRequired,
};
