import React, { Component } from "react";
import "./Players.css";
import PropTypes from "prop-types";

export default class Players extends Component {
  render() {
    return (
      <div>
        <h2 className="whiteAndCenter">Players</h2>

        {Object.keys( this.props.session.users ).map( user => {
          return <div className="user whiteAndCenter" key={user}>{user}</div>;
        } )}

      </div>
    );
  }
}


Players.propTypes = {
  session: PropTypes.object.isRequired,
};
