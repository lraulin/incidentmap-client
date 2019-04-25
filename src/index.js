import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import MobileApp from "./mobile/MobileApp";
import { Provider } from "react-redux";
import { BreakpointProvider } from "react-socks";
import store from "./redux/store";

window.jQuery = window.$ = $;
require("bootstrap");

ReactDOM.render(
  <Provider store={store}>
    <BreakpointProvider>
      <MobileApp />
    </BreakpointProvider>
  </Provider>,
  document.getElementById("root"),
);
