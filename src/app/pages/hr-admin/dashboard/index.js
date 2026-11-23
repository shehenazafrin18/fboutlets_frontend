import React, { Fragment, useEffect, useState } from "react";
import {
  Briefcase,
  Calendar,
  FilePdf,
  ViewChart,
} from "../../../components/toolkit/svg-icons";
import CardSummary from "../../../components/dashboard/CardSummary";
import ReactApexChart from "react-apexcharts";
import MapChart from "../../../components/dashboard/Map";
import * as hrActions from "../_redux/hrActions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { calculateDateRangeCount } from "../../../helpers/remainingDays";

export default function Dashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    // dashboardJobApplication,
    // dashboardJobInfo,
    user,
  } = useSelector((state) => ({
    user: state.auth.user,
    // dashboardJobApplication: state.hr.dashboardJobApplication,
    // dashboardJobInfo: state.hr.dashboardJobInfo,
  }));

  // useEffect(() => {
  //   dispatch(hrActions.getDashboardJobApplication());
  //   dispatch(hrActions.getDashboardJobInfo());
  // }, [dispatch, user]);

  const [ageChartData, setAgeChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      labels: ["20-30Yr", "31-40Yr", "41-50Yr", "Other"],
      legend: {
        position: "left",
        markers: {
          radius: 0,
        },
      },
    },
  });

  const [genderChartData, setGenderChartData] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Male", "Female", "Other"],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      legend: {
        position: "left",
        markers: {
          radius: 0,
        },
      },
    },
  });

  const [topUniversitesData, setTopUniversitesData] = useState({
    series: [
      {
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
        labels: {
          show: false,
        },
      },
    },
  });

  const [degreeChartData, setDegreeChartData] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: [],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      legend: {
        position: "left",
        markers: {
          radius: 0,
        },
      },
    },
  });

  // useEffect(() => {
  //   if (dashboardApplicantsinfo) {
  //     const {
  //       age21_30Percentage,
  //       age31_40Percentage,
  //       age41_50Percentage,
  //       otherAgePercentage,
  //       malePercentage,
  //       femalePercentage,
  //       otherGenderPercentage,
  //       universities,
  //       degrees,
  //     } = dashboardApplicantsinfo;

  //     const topUniversities = universities.slice(0, 5);
  //     const topDegrees = degrees.slice(0, 4);

  //     const universitiesSeries = topUniversities?.map((item) =>
  //       parseFloat(item?.count),
  //     );
  //     const universitiescategories = topUniversities?.map((item) => item?.name);

  //     const degreeSeries = topDegrees?.map((item) =>
  //       parseFloat(item?.percentage),
  //     );
  //     const degreeLabels = topDegrees?.map((item) => item?.degree_name);

  //     setAgeChartData({
  //       series: [
  //         parseFloat(age21_30Percentage),
  //         parseFloat(age31_40Percentage),
  //         parseFloat(age41_50Percentage),
  //         parseFloat(otherAgePercentage),
  //       ],
  //       options: ageChartData.options, // keep the options from initial state
  //     });
  //     setGenderChartData({
  //       series: [
  //         parseFloat(malePercentage),
  //         parseFloat(femalePercentage),
  //         parseFloat(otherGenderPercentage),
  //       ],
  //       options: genderChartData.options, // keep the options from initial state
  //     });

  //     const shortenedDegreeLabels = degreeLabels.map(
  //       (label) => label.split(" ")[0],
  //     );

  //     setDegreeChartData({
  //       series: degreeSeries,
  //       options: {
  //         ...degreeChartData.options,
  //         labels: degreeLabels.map((label) =>
  //           label.length > 15 ? `${label.slice(0, 15)}...` : label,
  //         ), // Sliced labels for the chart
  //         tooltip: {
  //           shared: false,
  //           intersect: false,
  //           y: {
  //             formatter: (value, { seriesIndex }) => {
  //               const label = degreeLabels[seriesIndex]; // Get the full label
  //               return `Degree: ${label} - Value: ${value}`; // Customize the tooltip text here
  //             },
  //           },
  //         },
  //       },
  //     });

  //     setTopUniversitesData({
  //       series: [
  //         {
  //           data: universitiesSeries,
  //         },
  //       ],
  //       options: {
  //         ...topUniversitesData.options,
  //         xaxis: {
  //           categories: universitiescategories,
  //           labels: {
  //             show: true,
  //           },
  //         },
  //       },
  //     });
  //   }
  // }, [dashboardApplicantsinfo]);

  const handleClick = () => {
    history.push({
      pathname: "/available-jobs",
      state: { from: "upcoming_expired_job" },
    });
  };
  const handleLatest = () => {
    history.push({
      pathname: "/available-jobs",
      state: { from: "latest_job" },
    });
  };

  return (
    <div className="dashboard_main">
      {/* =============================================================
                Overall Status 
            ================================================================*/}

      {/* {JSON.stringify(user)} */}
      <div className="row mt-4">
        <div className="col-md-3">
          <CardSummary
            bgColor={"#003A8C"}
            title={"Total revenue"}
            icon={<Briefcase />}
            content={[
              { title: "Total revenue", number: 1 },
              {
                title: "Listing Jobs",
                number: 1,
              },
              { title: "Hot Jobs", number: 1 },
            ]}
          />
        </div>

        <div className="col-md-3">
          <CardSummary
            bgColor={"#40A9FF"}
            title={"Top Selling Items"}
            icon={<ViewChart />}
            content={[
              {
                title: "Appeared in Job Search",
                number: 0,
              },
              {
                title: "Detail Views",
                number: 0,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
