import React from "react";
import PropTypes from "prop-types";

export class Leaderboard extends React.Component {

  render() {
    let leader = (
      Object.keys( this.props.curr_session.users ).sort( ( a, b ) => {
        return this.props.curr_session.users[ b ].score - this.props.curr_session.users[ a ].score;
      } )
    );

    return (
      <div className="leaderBoard">
        <h2 className="whiteAndCenter">Leaderboard</h2>
        {leader.map( ( user, i ) => {
          return (
            <div className="whiteAndCenter" key={user}>
              {this.props.curr_session.endOfGame && i === 0
                ? <h1><i className="fas fa-crown"/>{`${user}:${this.props.curr_session.users[ user ].score}`}</h1>
                : <span>({`${user}:${this.props.curr_session.users[ user ].score}`})</span>
              }
            </div>
          );
        } )}
      </div>
    );
  }
}

Leaderboard.propTypes = {
  curr_session: PropTypes.object.isRequired,
};
