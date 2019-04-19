import React from "react";
import MapNav from "./MapNav";
import TweetPane from "./TweetPane";

const App = props => (
  <div className="App">
    <MapNav />
    <div className="container-fluid">
      <div className="row">
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
  </div>
);

export default App;
