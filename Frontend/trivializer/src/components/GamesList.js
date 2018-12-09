import React, { Component } from "react";
import Games from "./Games";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchGamesReq, deleteGameReq } from "../actions";
import "./Components.css";
import axios from "axios";
import "./GamesList.css";

/**
 * GamesList Component
 * - renders a list of games for the logged in user
 */
class GamesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      game: this.props.game,
      gameLimit: 3
    };
  }

  componentDidMount() {
    this.props.fetchGamesReq();
    // NOTE: setState after API request doesn't render state in time
    // this.setState({ games: this.props.games });
    // SOLUTION: render with props directly
    if (localStorage.getItem("register")) {
      let googleUsername = localStorage.getItem("user").displayName;
      let googleUID = localStorage.getItem("user").uid;
      axios
        .post("https://testsdepl.herokuapp.com/users/login", {
          username: googleUsername,
          password: googleUID
        })
        .then(res => {
          sessionStorage.setItem("userId", JSON.stringify(res.data.userId));
          sessionStorage.setItem("paid", JSON.stringify(res.data.paid));
          sessionStorage.setItem(
            "jwt",
            JSON.stringify(res.data.token)
              .split("")
              .slice(1, -1)
              .join("")
          );
          sessionStorage.setItem("google", "yes");
          localStorage.removeItem("register");
        });
    }

    if (sessionStorage.getItem("status") == 1) {
      this.setState({ gameLimit: 10 });
    }
  }

  componentDidUpdate = prevProps => {
    if (JSON.stringify(prevProps.games) !== JSON.stringify(this.props.games)) {
      console.log("prevProps.games: ", prevProps.games);
      console.log("this.props.games: ", this.props.games);
      this.setState({ games: this.props.games });
    }
  };

  logout = e => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    this.props.history.push("/");
  };

  delete = id => {
    this.props.deleteGameReq(id);
  };

  render() {
    if (!this.props.games) {
      return <div>Loading...</div>;
    }

    return (
      <div className="gameslist-page">
        <div className="top-content">
          <div className="top-leftside">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Games
                </li>
              </ol>
            </nav>
          </div>
          {sessionStorage.getItem("jwt") && !localStorage.getItem("guest") ? (
            <div onClick={this.logout} className="top-rightside">
              Sign Out
            </div>
          ) : null}
        </div>

        <div className="main-content">
          <Navbar />
          <div className="content-container">
            {!this.props.games[0] ? (
              <div className="">
                <h3 className="main-middle">Add New Game</h3>
                <Link to={`/creategame`}>+</Link>
              </div>
            ) : (
              <div className="gamelist-container">
                <div>Games</div>
                {this.props.games.map((game, i) => (
                  <div className="game-container">
                    <div className="game-summary">
                      <Link
                        className="game-link"
                        to={`/game/${game["gameId"]}`}
                        key={game["gameId"]}
                      >
                        <GameDetails index={i} game={game} />
                      </Link>
                      <button className="game-delete" onClick={() => this.delete(game["gameId"])}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {this.props.games.length > 0 && this.props.games.length < this.state.gameLimit ? (
              <div className="game-container">
                <div className="game-summary">
                  <Link className="newgame-link" to={`/creategame`}>
                    <div>New Game</div>
                    <div>+</div>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * GameDetails function
 * - helper function to render mapped properties for each game
 */
function GameDetails({ game }) {
  return (
    <div>
      <Games game={game} />
    </div>
  );
}

const mapStateToProps = ({ gamesList }) => {
  return {
    games: gamesList.games,
    game: gamesList.game,
    gameId: gamesList.gameId
  };
};

export default connect(
  mapStateToProps,
  { fetchGamesReq, deleteGameReq }
)(GamesList);
