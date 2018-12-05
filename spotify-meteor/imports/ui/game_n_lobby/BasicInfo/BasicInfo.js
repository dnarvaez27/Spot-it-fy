import React, { Component } from "react";
import PropTypes from "prop-types";

// Shows the basic information about the current session game
export default class BasicInfo extends Component {
  render() {
    return (
      <div id="session-info-container">
        <button onClick={() => this.props.changeState(0)}>
          <i className="fas fa-chevron-left"/>
        </button>
        {this.props.session.config.duration === undefined ?
          <div id="session-img"/>
          :
          <img className="bannerImg" src={this.props.session.config.imageUrl} alt="playlistImage"/>
        }
        <div id="session-info-text">
          <div>SessionID: {this.props.session.id}</div>
          {this.props.session.config.duration === undefined ?
            <h1>-</h1>
            :
            <h1>{this.props.session.config.playlist.name}</h1>
          }

          <span>
            <span className="session-info-label">Session created by: </span>
            <b>
              {Object.keys( this.props.session.users )[ 0 ]}
            </b>
          </span>

          <span>
            <span className="session-info-label">Songs: </span>
            <b>
              {this.props.session.config.playlist
                ? (`${!this.props.session.endOfGame ? this.props.session.currentSong+1 + " of " : ""} ${this.props.session.config.playlist.tracks.length}`)
                : <i className="fas fa-comments"/>}
            </b>
          </span>

          <span>
            <span className="session-info-label">Players: </span>
            <b>
              {Object.keys( this.props.session.users ).length}
            </b>
          </span>

        </div>
      </div>
    );
  }
}


BasicInfo.propTypes = {
  session: PropTypes.object.isRequired,
  changeState:PropTypes.func
};
