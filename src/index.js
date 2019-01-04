import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/AppContainer";
import * as serviceWorker from "./utilities/serviceWorker";

window.jQuery = window.$ = $;
require("bootstrap");

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
