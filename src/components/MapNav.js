import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  ButtonGroup,
  Button,
} from "reactstrap";
import { types } from "../typeData";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { setFilter, resetFilter } from "../redux/actions";
import DatePicker from "react-mobile-datepicker";

const today = new Date();

const whiteText = {
  color: "white",
};

const whiteBackground = {
  backgroundColor: "white !important",
  background: "white !important",
};

const mapStateToProps = state => ({
  filterSettings: {
    text: state.filterSettings.text,
    startDate: state.filterSettings.startDate,
    endDate: state.filterSettings.startDate,
    incidentTypes: {
      fatalCrash: state.filterSettings.incidentTypes.fatalCrash,
      pedestrianCrash: state.filterSettings.incidentTypes.pedestrianCrash,
      cyclistCrash: state.filterSettings.incidentTypes.cyclistCrash,
      truckCrash: state.filterSettings.incidentTypes.truckCrash,
      busCrash: state.filterSettings.incidentTypes.busCrash,
      transitCrash: state.filterSettings.incidentTypes.transitCrash,
      transSuicide: state.filterSettings.incidentTypes.transSuicide,
      pipeline: state.filterSettings.incidentTypes.pipeline,
      hazmat: state.filterSettings.incidentTypes.hazmat,
      rail: state.filterSettings.incidentTypes.rail,
      road: state.filterSettings.incidentTypes.road,
      unsafe: state.filterSettings.incidentTypes.unsafe,
      drone: state.filterSettings.incidentTypes.drone,
    },
  },
  incidentTypeList: Object.keys(state.filterSettings.incidentTypes),
});

const mapDispatchToProps = dispatch => ({
  setFilterSettings: filter => dispatch(setFilter(filter)),
  resetFilterSettings: () => dispatch(resetFilter()),
});

class MapNav extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      beforeDateIsOpen: false,
      afterDateIsOpen: false,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  render() {
    return (
      <Navbar className={"fixed-bottom"} color="dark" dark expand="md">
        <NavbarBrand href="/">Incident Report Map</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav vertical className="ml-auto" navbar>
            {types.map(type => (
              <Button
                key={type.camelCaseName}
                active={
                  this.props.filterSettings.incidentTypes[type.camelCaseName]
                }
                data-toggle="button"
                aria-pressed={
                  this.props.filterSettings.incidentTypes[type.camelCaseName]
                }
                id={type.camelCaseName}
                onClick={e => {
                  console.log("Click");
                  console.log(e.target.id);
                  const filterSettings = this.props.filterSettings;
                  filterSettings.incidentTypes[
                    type.camelCaseName
                  ] = !filterSettings.incidentTypes[type.camelCaseName];
                  this.props.setFilterSettings(filterSettings);
                }}
              >
                {type.displayName}
              </Button>
            ))}
            <section style={whiteText}>
              <a
                className="btn btn-primary"
                onClick={() =>
                  this.setState({ isOpen: false, afterDateIsOpen: true })
                }
              >
                After
              </a>
              <DatePicker
                value={this.props.filterSettings.startDate || new Date()}
                isOpen={this.state.afterDateIsOpen}
                onSelect={startDate => {
                  this.setState({ afterDateIsOpen: false });
                  this.props.setFilterSettings({
                    ...this.props.filterSettings,
                    startDate,
                  });
                }}
                onCancel={() => this.setState({ afterDateIsOpen: false })}
                max={new Date()}
                confirmText={"OK"}
                cancelText={"Cancel"}
                theme={"ios"}
              />
              <a
                className="btn btn-primary"
                onClick={() =>
                  this.setState({ isOpen: false, beforeDateIsOpen: true })
                }
              >
                Before
              </a>
              <DatePicker
                value={this.props.filterSettings.endDate || new Date()}
                isOpen={this.state.beforeDateIsOpen}
                onSelect={endDate => {
                  this.setState({ beforeDateIsOpen: false });
                  this.props.setFilterSettings({
                    ...this.props.filterSettings,
                    endDate,
                  });
                }}
                onCancel={() => this.setState({ beforeDateIsOpen: false })}
                max={new Date()}
                confirmText={"OK"}
                cancelText={"Cancel"}
                theme={"ios"}
              />
              <br />
              <label htmlFor="text">
                <strong>Filter by Keywords</strong>
              </label>
              <br />
              <input
                type="search"
                name="text"
                value={this.props.filterSettings.text}
                onChange={e => {
                  this.props.setFilterSettings({
                    ...this.props.filterSettings,
                    text: e.target.value,
                  });
                }}
                className={"form-control"}
              />
            </section>
            <Button
              onClick={() => {
                this.props.resetFilterSettings();
                this.setState({ isOpen: false });
              }}
              className={"btn btn-danger"}
              style={{ width: "50%", float: "left" }}
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                this.setState({ isOpen: false });
              }}
              className={"btn btn-success"}
              style={{ width: "50%", float: "left" }}
            >
              Apply
            </Button>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapNav);
