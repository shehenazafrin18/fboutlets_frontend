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
    dashboardJobApplication,
    dashboardJobInfo,
    dashboardApplicantsinfo,
    dashboarCurrentJobInfo,
    dashboarExpiredJobInfo,
    dashboarlatestJobInfo,
    dashboarJobViewCount,
    user,
  } = useSelector((state) => ({
    user: state.auth.user,
    dashboardJobApplication: state.hr.dashboardJobApplication,
    dashboardJobInfo: state.hr.dashboardJobInfo,
    dashboardApplicantsinfo: state.hr.dashboardApplicantsinfo,
    dashboarCurrentJobInfo: state.hr.dashboarCurrentJobInfo,
    dashboarlatestJobInfo: state.hr.dashboarlatestJobInfo,
    dashboarExpiredJobInfo: state.hr.dashboarExpiredJobInfo,
    dashboarJobViewCount: state.hr.dashboarJobViewCount,
  }));

  useEffect(() => {
    dispatch(hrActions.getDashboardJobApplication());
    dispatch(hrActions.getDashboardJobInfo());
    dispatch(hrActions.getDashboardApplicantsInfo());
    dispatch(hrActions.getDashboarCurrentJobInfo());
    dispatch(hrActions.getDashboarExpiredJobInfo());
    dispatch(hrActions.getDashboarLatestJobInfo());
    dispatch(hrActions.getDashboarJobViewCount());
  }, [dispatch, user]);

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

  useEffect(() => {
    if (dashboardApplicantsinfo) {
      const {
        age21_30Percentage,
        age31_40Percentage,
        age41_50Percentage,
        otherAgePercentage,
        malePercentage,
        femalePercentage,
        otherGenderPercentage,
        universities,
        degrees,
      } = dashboardApplicantsinfo;

      const topUniversities = universities.slice(0, 5);
      const topDegrees = degrees.slice(0, 4);

      const universitiesSeries = topUniversities?.map((item) =>
        parseFloat(item?.count),
      );
      const universitiescategories = topUniversities?.map((item) => item?.name);

      const degreeSeries = topDegrees?.map((item) =>
        parseFloat(item?.percentage),
      );
      const degreeLabels = topDegrees?.map((item) => item?.degree_name);

      setAgeChartData({
        series: [
          parseFloat(age21_30Percentage),
          parseFloat(age31_40Percentage),
          parseFloat(age41_50Percentage),
          parseFloat(otherAgePercentage),
        ],
        options: ageChartData.options, // keep the options from initial state
      });
      setGenderChartData({
        series: [
          parseFloat(malePercentage),
          parseFloat(femalePercentage),
          parseFloat(otherGenderPercentage),
        ],
        options: genderChartData.options, // keep the options from initial state
      });

      const shortenedDegreeLabels = degreeLabels.map(
        (label) => label.split(" ")[0],
      );

      setDegreeChartData({
        series: degreeSeries,
        options: {
          ...degreeChartData.options,
          labels: degreeLabels.map((label) =>
            label.length > 15 ? `${label.slice(0, 15)}...` : label,
          ), // Sliced labels for the chart
          tooltip: {
            shared: false,
            intersect: false,
            y: {
              formatter: (value, { seriesIndex }) => {
                const label = degreeLabels[seriesIndex]; // Get the full label
                return `Degree: ${label} - Value: ${value}`; // Customize the tooltip text here
              },
            },
          },
        },
      });

      setTopUniversitesData({
        series: [
          {
            data: universitiesSeries,
          },
        ],
        options: {
          ...topUniversitesData.options,
          xaxis: {
            categories: universitiescategories,
            labels: {
              show: true,
            },
          },
        },
      });
    }
  }, [dashboardApplicantsinfo]);

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

      {/* <div className='row'>
                <div className='col-md-12 pt-4'>
                    <h2> <strong> Overall Status </strong></h2>
                </div>
            </div> */}
      {/* {JSON.stringify(user)} */}
      <div className="row mt-4">
        <div className="col-md-3">
          <CardSummary
            bgColor={"#003A8C"}
            title={"Jobs"}
            icon={<Briefcase />}
            content={[
              { title: "Total Jobs", number: dashboardJobInfo?.totalJob },
              {
                title: "Listing Jobs",
                number: dashboardJobInfo?.totalInitialShortlisted,
              },
              { title: "Hot Jobs", number: dashboardJobInfo?.totalHotJobs },
            ]}
          />
        </div>

        <div className="col-md-3">
          <CardSummary
            bgColor={"#40A9FF"}
            title={"Jobs View"}
            icon={<ViewChart />}
            content={[
              {
                title: "Appeared in Job Search",
                number: dashboarJobViewCount?.totalSearchCount,
              },
              {
                title: "Detail Views",
                number: dashboarJobViewCount?.totalDetailViewCount,
              },
            ]}
          />
        </div>

        <div className="col-md-3">
          <CardSummary
            bgColor={"#002766"}
            title={"Application"}
            icon={<FilePdf />}
            content={[
              {
                title: "Total Applicaitons",
                number: dashboardJobApplication?.totalJobApplication,
              },
              {
                title: "Interviewed",
                number: dashboardJobApplication?.totalInterview,
              },
              {
                title: "Shortlisted",
                number: dashboardJobApplication?.totalFinalShortlisted,
              },
              {
                title: "Confirmed",
                number: dashboardJobApplication?.totalConfirmed,
              },
            ]}
          />
        </div>

        <div className="col-md-3">
          <CardSummary
            bgColor={"#40A9FF"}
            title={"Profiles"}
            icon={<Calendar />}
            content={[
              // { title: "Followers", number: 11269 },
              {
                title: "Total Profiles",
                number: dashboardApplicantsinfo?.totalCount,
              },
            ]}
          />
        </div>
      </div>

      {/* =============================================================
                Chart Cards
            ================================================================*/}

      <div className="row mt-5">
        <div className="col-md-4 mb-5">
          <div className="card card-style-2">
            <div className="header">
              <span className="title-name"> Age </span>
            </div>

            <div className="content">
              <div id="chart">
                <ReactApexChart
                  options={ageChartData.options}
                  series={ageChartData.series}
                  type="donut"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-5">
          <div className="card card-style-2">
            <div className="header">
              <span className="title-name"> Location Status </span>
            </div>

            <div className="content">
              <div className="chart_map_box">
                <MapChart
                  divisionPercentages={
                    dashboardApplicantsinfo?.divisionPercentages
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-5">
          <div className="card card-style-2">
            <div className="header">
              <span className="title-name"> Gender </span>
            </div>

            <div className="content">
              <div id="chart">
                <ReactApexChart
                  options={genderChartData.options}
                  series={genderChartData.series}
                  type="pie"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6 mb-5">
              <div className="card card-style-2">
                <div className="header">
                  <span className="title-name"> Top 5 Universities </span>
                </div>

                <div className="content">
                  <div id="chart">
                    <ReactApexChart
                      options={topUniversitesData.options}
                      series={topUniversitesData.series}
                      type="bar"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-5">
              <div className="card card-style-2">
                <div className="header">
                  <span className="title-name"> Degree </span>
                </div>

                <div className="content">
                  <div id="chart">
                    <ReactApexChart
                      options={degreeChartData.options}
                      series={degreeChartData.series}
                      type="pie"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row current_live_jobs_card">
            <div className="col-md-12">
              <div className="header">
                <span className="title-name">Current Live Jobs </span>
                {dashboarCurrentJobInfo &&
                  dashboarCurrentJobInfo?.length > 3 && (
                    <Link
                      className="see_all_btn"
                      to="/available-jobs"
                      target="_blank"
                    >
                      See All <i className="fas fa-arrow-right"></i>{" "}
                    </Link>
                  )}
              </div>
            </div>
            {dashboarCurrentJobInfo && dashboarCurrentJobInfo?.length > 0 ? (
              dashboarCurrentJobInfo?.map((item, key) => {
                if (key < 4) {
                  let remaining = item?.application_deadline
                    ? calculateDateRangeCount(item?.application_deadline)
                    : 0;
                  return (
                    <>
                      <div
                        className="col-md-6 mb-5"
                        key={"current_jobs" + item?.id}
                      >
                        <div className="jobs_card_style">
                          <Link to={`/hr-admin/jobs/${item?.id}`}>
                            <h3>{item?.job_title}</h3>
                            <div className="dept">
                              <p>
                                Department:{" "}
                                <span>
                                  {item?.sys_departments?.department_name}
                                </span>
                              </p>
                              <p className="ps-3">
                                Exp:{" "}
                                <span>
                                  {item?.minimum_experience > 0
                                    ? item?.minimum_experience + " Years"
                                    : "Fresher"}{" "}
                                </span>
                              </p>
                            </div>
                            <div className="d-flex justify-content-between">
                              {item?.position_category ? (
                                <p style={{ fontWeight: "700" }}>
                                  <i className="fas fa-briefcase"></i>{" "}
                                  <span>{item?.position_category}</span>
                                </p>
                              ) : (
                                <p></p>
                              )}
                              {remaining > 0 && (
                                <p className="expried_day text-danger">
                                  Remaining {remaining} days
                                </p>
                              )}
                            </div>
                            {/* <button className="btn btn_job_card">{item?.position_status}</button> */}
                          </Link>
                        </div>
                      </div>
                    </>
                  );
                }
              })
            ) : (
              <>
                <div className="col-md-6 mb-5" key={"current_jobs"}>
                  <div className="jobs_card_style">
                    <h3>No Data Found</h3>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card latest_jobs_posted_card">
            <div className="header">
              <span className="title-name"> Latest Jobs Posted </span>
              {dashboarlatestJobInfo && dashboarlatestJobInfo?.length > 3 && (
                <>
                  {/* <Link className='see_all_btn' to="/available-jobs" target="_blank" >See All <i className="fas fa-arrow-right"></i> </Link> */}
                  <p
                    className="see_all_btn"
                    onClick={handleLatest}
                    style={{ cursor: "pointer" }}
                  >
                    See All <i className="fas fa-arrow-right"></i>
                  </p>
                </>
              )}
            </div>

            <div className="content">
              {dashboarlatestJobInfo && dashboarlatestJobInfo?.length > 0 ? (
                dashboarlatestJobInfo?.map((item, key) => {
                  if (key < 4) {
                    let remaining = item?.application_deadline
                      ? calculateDateRangeCount(item?.application_deadline)
                      : 0;
                    return (
                      <>
                        <div
                          className="jobs_card_style"
                          key={"latest_jobs" + item?.id}
                        >
                          <Link to={`/hr-admin/jobs/${item?.id}`}>
                            <h3>{item?.job_title}</h3>
                            <div className="dept">
                              <p>
                                Dept:{" "}
                                <span>
                                  {item?.sys_departments?.department_name}
                                </span>
                              </p>
                              <p className="ps-3">
                                Exp:{" "}
                                <span>
                                  {item?.minimum_experience > 0
                                    ? item?.minimum_experience + " Years"
                                    : "Fresher"}
                                </span>
                              </p>
                            </div>

                            <div className="d-flex justify-content-between">
                              {item?.position_category ? (
                                <p style={{ fontWeight: "700" }}>
                                  <i className="fas fa-briefcase"></i>{" "}
                                  <span>{item?.position_category}</span>
                                </p>
                              ) : (
                                <p></p>
                              )}
                              <p className="expried_day text-danger">
                                {" "}
                                {remaining > 0
                                  ? `Remaining ${remaining} days`
                                  : "Expired"}
                              </p>
                            </div>
                            {/* <button className="btn btn_job_card">{item?.position_status}</button> */}
                          </Link>
                        </div>
                      </>
                    );
                  }
                })
              ) : (
                <>
                  <div className="col-md-8 mb-5" key={"latest_jobs"}>
                    <div className="jobs_card_style">
                      <h3>No Data Found</h3>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row deadline_jobs_card">
        <div className="col-md-12">
          <div className="header">
            <span className="title-name"> Jobs Deadline This Week </span>
            {dashboarExpiredJobInfo && dashboarExpiredJobInfo?.length > 3 && (
              <button className="see_all_btn" onClick={handleClick}>
                See All <i className="fas fa-arrow-right"></i>
              </button>
              // {/* <Link className='see_all_btn' to="/available-jobs" target="_blank" >See All <i className="fas fa-arrow-right"></i> </Link> */}
            )}
          </div>
        </div>
        {dashboarExpiredJobInfo && dashboarExpiredJobInfo?.length > 0 ? (
          dashboarExpiredJobInfo?.map((item, key) => {
            if (key < 6) {
              let remaining = item?.application_deadline
                ? calculateDateRangeCount(item?.application_deadline)
                : 0;
              return (
                <>
                  <div className="col-md-4 mb-5" key={"deadline" + item?.id}>
                    <div className="jobs_card_style">
                      <Link to={`/hr-admin/jobs/${item?.id}`}>
                        <h3>{item?.job_title}</h3>
                        <div className="dept">
                          <p>
                            Dept:{" "}
                            <span>
                              {item?.sys_departments?.department_name}
                            </span>
                          </p>
                          <p className="ps-3">
                            Exp:{" "}
                            <span>
                              {item?.minimum_experience > 0
                                ? item?.minimum_experience + " Years"
                                : "Fresher"}
                            </span>
                          </p>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <button className="btn btn_job_card">
                            Deadline:
                            {item?.application_deadline
                              ? moment(item?.application_deadline).format(
                                  "DD MMMM YYYY",
                                )
                              : ""}
                          </button>
                          {remaining > 0 && (
                            <p className="expried_day text-danger mb-0">
                              Remaining {remaining} days
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                </>
              );
            }
          })
        ) : (
          <>
            <div className="col-md-8 mb-5" key={"deadline"}>
              <div className="jobs_card_style">
                <h3>No Data Found</h3>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
