import React from "react";
import MapNav from "./MapNav";
import TweetPane from "./TweetPane";
import SearchPane from "./SearchPane";
import Breakpoinnt from "react-socks";

const App = props => (
  <div className="App">
    <div className="container-fluid">
      <div className="row">
        <Breakpoinnt medium up>
          <SearchPane />
        </Breakpoinnt>
        {/* [[[[[ MAP ]]]]] */}
        <div
          className="col-sm-7"
          style={{ height: "100vh", width: "100%" }}
          id="map"
        />
        <div className="col-sm-3 d-none d-lg-block" style={{ height: "100vh" }}>
          <TweetPane />
        </div>
      </div>
    </div>
    <Breakpoinnt small down>
      <MapNav />
    </Breakpoinnt>
  </div>
);

export default App;
