import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom";
import MobileApp from "./mobile/MobileApp";
import { Provider } from "react-redux";
import Breakpoint, { BreakpointProvider } from "react-socks";
import store from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <BreakpointProvider>
      <MobileApp />
    </BreakpointProvider>
  </Provider>,
  document.getElementById("root"),
);
