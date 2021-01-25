import React, { Component } from "react";

class Chart extends Component {
  // Create a copy of 'segments' array that includes chronotope data for the appropriate segment
  addChronotopeDataToSegs = () => {
    const segsWithCTopeData = this.props.segmentsData.map((segment) => {
      segment.cTopeData = [];
      return segment;
    });
    this.props.chronoTopeData.forEach((entry) => {
      segsWithCTopeData[entry.segment_no].cTopeData.push(entry);
    });
    return segsWithCTopeData;
  };

  crunchData = () => {
    // Add chronotope data to "segments" data:
    const segDataWithCTopeData = this.addChronotopeDataToSegs();

    // Group segments by group.group_no; order segment groups by group.position:
    const groupNoPosHash = {};
    // Create target array as destination for ordered groups
    let segmentsByGroup = [];
    this.props.groupsData.forEach((group, index) => {
      // Create hash table-like object mapping group_no to position
      // (In this case - {8: 8, 9: 0, 10: 3, 11: 7, 12: 5, 13: 1, 14: 6, 15: 2, 16: 4, 17: 9})
      // Note: as I give this a final review, I realize the hash was unnecessary...the group_no property is equal to its index in the array minus 8. I'm going to leave it in on the assumption that that won't necessarily always be true.
      groupNoPosHash[group.group_no] = group.position;
      // Create "bins" in target array
      segmentsByGroup[index] = [];
    });

    segDataWithCTopeData.forEach((segment) => {
      let segGroupBin = groupNoPosHash[segment.group_no];
      segmentsByGroup[segGroupBin].push(segment);
    });

    // Sort segments by position within each group. Flatten the now-correctly-ordered array by
    // pushing results to a new (empty) array.
    const orderedSegsOut = [];
    const orderedSegsByGroup = segmentsByGroup.map((group) =>
      group.sort((a, b) => a.position - b.position)
    );
    orderedSegsByGroup.forEach((group) => {
      group.forEach((segment) => {
        orderedSegsOut.push(segment);
      });
    });

    return orderedSegsOut;
  };

  generateGraphicData = (segmentDataIn) => {
    // Find earliest hit_time of all points in the dataset; this will be subtracted from all rendered points
    const earliestHitTime = Number(
      Date.parse(this.props.chronoTopeData[0].hit_time)
    );

    // Find difference between earliest and latest hits; result will be used to scale the graph's x-axis
    const dataRange =
      Number(
        Date.parse(
          this.props.chronoTopeData[this.props.chronoTopeData.length - 1]
            .hit_time
        )
      ) - earliestHitTime;

    // 250 = arbitrary value for non-mobile displays (50px margin on each side between chart and SVG edges; 140px additional on left for segment name; 10px more to allow for size of data-point circle objects
    const widthDivisor = this.props.chartWidth - 250;

    // scalingDivisor = how many time units (seconds) per pixel
    const scalingDivisor = (dataRange / widthDivisor).toFixed(0);

    // create array that will eventually hold all the graphic objects
    const dataArray = [];

    for (let i = 0; i <= segmentDataIn.length - 1; i++) {
      const segmentDataArr = segmentDataIn[i].cTopeData.map(
        (dataPoint, index) => {
          let hitTimeX = (
            Number(Date.parse(dataPoint.hit_time) - earliestHitTime) /
            scalingDivisor
          ).toFixed(0);
          hitTimeX = Number(hitTimeX) + 145;
          // offset x co-ord on left to allow space for segment name

          return (
            <circle
              key={"circle_" + index}
              id={"circle_" + index}
              r="4"
              cx={hitTimeX}
              cy="10"
              fill={"#" + segmentDataIn[i].hex_color}
              onClick={() =>
                this.props.showInfoBlock(
                  dataPoint.hit_time,
                  segmentDataIn[i].name,
                  // assuming here that (group_no - 8) = the group's index in groups.JSON...if that's not the case, I'd have to use the hash thing I used above.
                  this.props.groupsData[Number(segmentDataIn[i].group_no) - 8]
                    .name,
                  this.props.groupsData[Number(segmentDataIn[i].group_no) - 8]
                    .hex_color,
                  segmentDataIn[i].hex_color
                )
              }
            />
          );
        }
      );

      // Create base rectangle and text objects on which the data will be diplayed; attach the data circles and push the whole mess to the big array
      dataArray.push(
        <svg key={"segment_" + i} x={0} y={20 + i * 21}>
          <rect
            width={this.props.chartWidth - 100}
            height="20"
            fill={i % 2 === 0 ? "transparent" : "#eef2f6"}
          />
          {segmentDataArr}
          <rect width="5" height="20" fill={"#" + segmentDataIn[i].hex_color} />
          <text
            x={10}
            y={16}
            fontSize={15}
            fill={"#" + segmentDataIn[i].hex_color}
          >
            {segmentDataIn[i].name}
          </text>
        </svg>
      );
    }
    return dataArray;
  };

  render() {
    return (
      <div id="container-inner">
        <svg
          id="theSVG"
          width={this.props.chartWidth - 50}
          height={this.props.segmentsData.length * 21.5}
        >
          {this.generateGraphicData(this.crunchData())}
        </svg>
      </div>
    );
  }
}

export default Chart;
