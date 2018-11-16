import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavBar from "./Navbar";
import { connect } from "react-redux";
import { submitGameReq } from "../actions";

class CreateGameView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameTitle: "",
            gameDescription: "",
            gameCreated: "",
            gameCreatedMS: "",
            gameScheduled: ""
        };
    }

    componentDidMount() {
        const d = new Date();

        this.setState({
            gameTitle: "",
            gameDescription: "",
            gameCreated: `${d.getMonth() +
                1}-${d.getDate()}-${d.getFullYear()}`,
            gameCreatedMS: Date.now(),
            gameScheduled: ""
        });
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = () => {
        if (this.state.gameTitle === "") return null;

        const game = {
            username: sessionStorage.getItem("user"),
            gameName: this.state.gameTitle,
            gameDescription: this.state.gameDescription,
            gameCreatedMS: this.state.gameCreatedMS
            // gameScheduled: this.state.gameScheduled
        };

        this.props.submitGameReq(game);
        this.props.history.push("/gameslist");
    };

    render() {
        return (
            <div className="gameslist-page">
                <div className="top-content">
                    <div className="top-leftside">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li
                                    className="breadcrumb-item active"
                                    aria-current="page"
                                >
                                    Games
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <Link className="top-rightside" to="/">
                        Sign Out
                    </Link>
                </div>

                <div className="main-content">
                    <NavBar />
                    <div>
                        <div>Logo</div>
                        <input
                            name="gameTitle"
                            placeholder="Game Title"
                            value={this.state.gameTitle}
                            onChange={this.handleChange}
                        />
                        <input
                            name="gameDescription"
                            placeholder="Game Description"
                            value={this.state.gameDescription}
                            onChange={this.handleChange}
                        />
                        <input
                            type="date"
                            name="gameScheduled"
                            placeholder="mm/dd/yyyy"
                            value={this.state.gameScheduled}
                            onChange={this.handleChange}
                        />
                        <button>Print Answer Sheets</button>
                        <button>Print Answer Key</button>
                        <button onClick={this.handleSubmit}>Save Game</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ games }) => {
    return {};
};

export default connect(
    mapStateToProps,
    { submitGameReq }
)(CreateGameView);
