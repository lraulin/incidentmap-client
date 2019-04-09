import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import { Provider } from "react-redux";
import store from "./redux/store";

window.jQuery = window.$ = $;
require("bootstrap");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
