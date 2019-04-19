import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
  Button,
  Input,
} from "reactstrap";
import { types } from "../typeData";
import DatePicker from "react-datepicker";
import Checkbox from "./Checkbox";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { setFilter, resetFilter } from "../redux/actions";

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
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  render() {
    return (
      <div>
        <Navbar color="dark" expand="md">
          <NavbarBrand href="/">Incident Report Map</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">GitHub</NavLink>
              </NavItem>
              <ButtonGroup vertical>
                {types.map(type => (
                  <Button
                    key={type.camelCaseName}
                    active={
                      this.props.filterSettings.incidentTypes[
                        type.camelCaseName
                      ]
                    }
                    data-toggle="button"
                    aria-pressed={
                      this.props.filterSettings.incidentTypes[
                        type.camelCaseName
                      ]
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
              </ButtonGroup>
              <ButtonGroup className="btn-group-toggle">
                <Button tag="label" active>
                  <Input
                    type="radio"
                    name="options"
                    id="option1"
                    autocomplete="off"
                    checked
                  />{" "}
                  Active
                </Button>
                <Button tag="label">
                  <Input
                    type="radio"
                    name="options"
                    id="option2"
                    autocomplete="off"
                  />{" "}
                  Radio
                </Button>
                <Button tag="label">
                  <Input
                    type="radio"
                    name="options"
                    id="option3"
                    autocomplete="off"
                  />{" "}
                  Radio
                </Button>
              </ButtonGroup>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapNav);
