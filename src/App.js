import React, { Component } from "react";
import * as api from "./api/index";
import Chart from "./Chart";
import InfoBlock from "./InfoBlock";

class App extends Component {
  state = {
    chronoTopeName: "",
    chartWidth: 1500,
    chronoTopeData: [],
    segmentsData: [],
    groupsData: [],
    allDataIn: 0,
    iBoccurrenceTime: null,
    iBoccurrenceSegment: null,
    iBoccurrenceGroup: null,
    iBSegColor: null,
    iBGroupColor: null,
  };

  componentDidMount = () => {
    api.fetchMap().then((res) => {
      this.setState({
        chronoTopeName: res.name,
        allDataIn: this.state.allDataIn + 1,
      });
    });

    api.fetchChronotopeData().then((res) => {
      this.setState({
        chronoTopeData: res,
        allDataIn: this.state.allDataIn + 1,
      });
    });

    api.fetchSegments().then((res) => {
      this.setState({ segmentsData: res, allDataIn: this.state.allDataIn + 1 });
    });

    api.fetchGroups().then((res) => {
      this.setState({ groupsData: res, allDataIn: this.state.allDataIn + 1 });
    });
  };

  showInfoBlock = (iBhitTime, iBSeg, iBGroup, iBGroupColor, iBSegColor) => {
    const newStateObj = {
      iBoccurrenceTime: iBhitTime,
      iBoccurrenceSegment: iBSeg,
      iBoccurrenceGroup: iBGroup,
      iBSegColor: iBSegColor,
      iBGroupColor: iBGroupColor,
    };
    this.setState(newStateObj);
  };

  render() {
    return this.state.allDataIn >= 4 ? (
      <div className="container-outer" width={"100%"}>
        <h1>{this.state.chronoTopeName}</h1>
        <Chart
          chartWidth={this.state.chartWidth}
          chronoTopeData={this.state.chronoTopeData}
          segmentsData={this.state.segmentsData}
          groupsData={this.state.groupsData}
          showInfoBlock={this.showInfoBlock}
        />
        {this.state.iBoccurrenceTime ? (
          <InfoBlock
            occTime={this.state.iBoccurrenceTime}
            occSeg={this.state.iBoccurrenceSegment}
            occGroup={this.state.iBoccurrenceGroup}
            segColor={this.state.iBSegColor}
            groupColor={this.state.iBGroupColor}
          />
        ) : null}
      </div>
    ) : null;
  }
}

export default App;
