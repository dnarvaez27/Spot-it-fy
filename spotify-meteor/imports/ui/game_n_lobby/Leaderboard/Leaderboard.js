import React from "react";
import PropTypes from "prop-types";
import "./Leaderboard.css";
export class Leaderboard extends React.Component {

  renderUsersLeaderboard(){

    let leader = (
      Object.keys( this.props.curr_session.users ).sort( ( a, b ) => {
        return this.props.curr_session.users[ b ].score - this.props.curr_session.users[ a ].score;
      } )
    );

    let ans = [];
    for(let i in leader){
      ans.push(
        <div key={i*3}>{parseInt(i)+1}</div>
      );
      ans.push(
        <div key={i*3+1}>{leader[i]}</div>
      );
      ans.push(
        <div key={i*3+2}>{this.props.curr_session.users[ leader[i] ].score}</div>
      );
    }
    // console.log(ans);

    return ans;
  }

  winner(){
    let leader = (
      Object.keys( this.props.curr_session.users ).sort( ( a, b ) => {
        return this.props.curr_session.users[ b ].score - this.props.curr_session.users[ a ].score;
      } )
    );
    return leader[0];
  }

  render() {
    

    return (
      <div className="leaderBoard">
        {this.props.curr_session.endOfGame ? 
          <div className="whiteAndCenter">
            <h2>The Winner is</h2>
            <br/>
            <i className="fas fa-crown fa-5x"/>
            <br/>
            <h1><b>{this.winner()}</b></h1>
            <p>{this.props.curr_session.users[ this.winner() ].score} points</p>
          </div>
          :
          <div>
            <h2 className="whiteAndCenter">Leaderboard</h2>
  
            <div className="whiteAndCenter">
              <div className="grid-container">
                <div className="grid-item"><b>Rank</b></div>
                <div className="grid-item"><b>Username</b></div>
                <div className="grid-item"><b>Points</b></div>
              
                {this.renderUsersLeaderboard()}
              </div>
            </div>
          </div>
        }
        
      </div>
    );
  }
}

// {/* {this.props.curr_session.endOfGame && i === 0
//   ? <h1><i className="fas fa-crown"/>{`${user}:${this.props.curr_session.users[ user ].score}`}</h1>
//   : <span>({`${user}:${this.props.curr_session.users[ user ].score}`})</span>
// } */}

Leaderboard.propTypes = {
  curr_session: PropTypes.object.isRequired,
};
