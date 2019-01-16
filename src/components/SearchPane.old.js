import React from "react";
import Checkbox from "./Checkbox";
import incidentTypes from "../utilities/incidents";
import Calendar from "./Calendar";

const containerStyle = {
  textAlign: "left"
  // height: "100%"
};

class SearchPane extends React.Component {
  state = {
    allSelected: false,
    checkedItems: new Map(),
    startDate: null,
    endDate: null,
    searchText: ""
  };

  handleCheckboxChange = this.handleCheckboxChange.bind(this);
  search = this.search.bind(this);
  filter = this.filter.bind(this);
  handleChangeDate = this.handleChangeDate.bind(this);
  handleClick = this.handleClick.bind(this);

  selectAll(bool) {
    // Check or uncheck all checkboxes
    const checkedItems = this.state.checkedItems;
    Array.from(checkedItems.keys()).forEach(key => checkedItems.set(key, bool));
    this.setState(checkedItems, this.filter);
  }

  search() {
    // Get selected incident types as array of strings
    const selectedTypes = [
      ...new Map(
        [...this.state.checkedItems].filter(([key, value]) => value === true)
      ).keys()
    ];
    // search for tweets with Twitter API
    this.props.fetchTweets(selectedTypes);
  }

  filter() {
    // Collect selected options from UI and call function to apply filter
    const incidentTypes = [
      ...new Map(
        [...this.state.checkedItems].filter(([key, value]) => value === true)
      ).keys()
    ];

    const filterOptions = {
      incidentTypes,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      text: this.state.searchText
    };

    this.props.setFilter(filterOptions);
  }

  handleClick(e) {
    console.log(e);
    switch (e.target.name) {
      case "selectAll":
        this.selectAll(true);
        break;
      case "selectNone":
        this.selectAll(false);
        break;
      case "filter":
        this.filter();
        break;
      case "search":
        this.search();
        break;
      default:
        throw new Error(`No handler for click event ${e.target.name}`);
    }
  }

  handleCheckboxChange(e) {
    // Toggle the value for the checkbox
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(
      prevState => ({
        checkedItems: prevState.checkedItems.set(item, isChecked)
      }),
      this.filter
    );
  }

  handleChangeDate([startDate, endDate]) {
    this.setState(
      {
        startDate,
        endDate
      },
      this.filter
    );
  }

  componentDidUpdate() {
    // Make "All" checked if user checked all manually
    const selectionValues = [...this.state.checkedItems.values()];
    if (!this.state.allSelected && selectionValues.every(x => x === true)) {
      this.setState({ allSelected: true });
    }
  }

  componentDidMount() {
    // initialize the list of selections
    const checkedItems = new Map();
    incidentTypes.forEach(type => checkedItems.set(type.id, true));
    this.setState({ checkedItems });
  }

  render() {
    return (
      <div style={containerStyle}>
        <strong>Incident Type</strong>
        <br />
        <button
          className="btn btn-primary btn-sm"
          name="selectNone"
          onClick={this.handleClick}
        >
          None
        </button>
        <button
          className="btn btn-primary btn-sm"
          name="selectAll"
          onClick={this.handleClick}
        >
          All
        </button>
        <br />
        {incidentTypes.map(item => (
          <React.Fragment key={item.id}>
            <label>
              <Checkbox
                name={item.id}
                checked={this.state.checkedItems.get(item.id)}
                onChange={this.handleCheckboxChange}
              />
              {item.displayName}
            </label>
            <br />
          </React.Fragment>
        ))}
        <strong>Filter by Date</strong>
        <Calendar
          handleChangeDate={this.handleChangeDate}
          startDate={this.props.filter.startDate}
          endDate={this.props.filter.endDate}
        />
        <br />
        <label htmlFor="text">
          <strong>Filter by Keywords</strong>
        </label>
        <input
          type="search"
          name="text"
          value={this.props.filter.text}
          onChange={e => this.setState({ searchText: e.target.value })}
        />
        <br />
        <button
          className="btn btn-primary"
          name="filter"
          onClick={this.handleClick}
        >
          Filter
        </button>
        <br />
        <p>Showing {this.props.numTweets} Tweets</p>
      </div>
    );
  }
}

export default SearchPane;
