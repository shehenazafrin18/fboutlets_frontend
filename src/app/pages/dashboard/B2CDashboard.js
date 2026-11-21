import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  MixedWidget1,
  StatsWidget11,
  StatsWidget12,
} from "../../../_metronic/_partials/widgets";
import { StatsWidget13 } from "../../../_metronic/_partials/widgets/stats/StatsWidget13";

export default function B2CDashboard() {
  const {
    user: { accessToken, refreshToken },
  } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [customerCount, setCustomerCount] = useState();
  const [productCount, setProductCount] = useState();
  const [referralCount, setReferralCount] = useState();
  const [testDriveCount, setTestDriveCount] = useState();
  const [showroomCount, setShowroomCount] = useState();
  const [serviceCount, setServiceCount] = useState();
  // const [lastWkProduct, setLastWkProduct] = useState();
  // const [lastWkReferral, setLastWkReferral] = useState();
  // const [lastWkDrive, setLastWkDrive] = useState();
  // const [cardData, setCardData] = useState({
  //   numberOfCustomer: 1633,
  //   totalOrder: {
  //     amount: 7643,
  //     quantity: 11,
  //     orderItemQty: 47,
  //   },
  //   pendingOrder: {
  //     amount: 3352,
  //     quantity: 6,
  //     orderItemQty: 40,
  //   },
  //   shippedOrder: {
  //     amount: 0,
  //     quantity: 0,
  //     orderItemQty: 0,
  //   },
  //   deliveredOrder: {
  //     amount: 0,
  //     quantity: 0,
  //     orderItemQty: 0,
  //   },
  //   canceledOrder: {
  //     amount: 3441,
  //     quantity: 4,
  //     orderItemQty: 6,
  //   },
  // });
  // const [chartData, setChartData] = useState({
  //   dateArray: [
  //     "2022-06-01",
  //     "2022-06-02",
  //     "2022-06-03",
  //     "2022-06-04",
  //     "2022-06-05",
  //     "2022-06-06",
  //     "2022-06-07",
  //   ],
  //   orderAmount: [0, 0, 0, 0, 1300, 0, 0],
  //   orderCount: [0, 0, 0, 0, 3, 0, 0],
  //   newCustomer: [0, 2, 0, 0, 0, 0, 0],
  // });

  const getCustomerData = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API_URL}/common/totalCustomer`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );

    if (!data.error) {
      setCustomerCount(data.data);
      setLoading(false);
    }
  };

  const getProductData = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API_URL}/common/totalProduct`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );

    if (!data.error) {
      setProductCount(data.data);
      setLoading(false);
    }
  };
  const getReferralData = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API_URL}/common/totalReferral`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );

    if (!data.error) {
      setReferralCount(data.data);
      setLoading(false);
    }
  };
  const getTestDriveData = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API_URL}/common/totalTestDriver`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );

    if (!data.error) {
      setTestDriveCount(data.data);
      setLoading(false);
    }
  };

  const getShowroomData = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API_URL}/common/totalShowRoom`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );

    if (!data.error) {
      setShowroomCount(data.data);
      setLoading(false);
    }
  };
  const getServiceCenterData = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API_URL}/common/totalServiceCenter`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      }
    );

    if (!data.error) {
      setServiceCount(data.data);
      setLoading(false);
    }
  };
  // const getProductDataLastWk = async () => {
  //   const { data } = await Axios.get(
  //     `${process.env.REACT_APP_API_URL}/common/lastWeekTotalProduct`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //         refreshToken: refreshToken,
  //       },
  //     }
  //   );

  //   if (!data.error) {
  //     setLastWkProduct(data.data);
  //     setLoading(false);
  //   }
  // };
  // const getReferralDataLastWk = async () => {
  //   const { data } = await Axios.get(
  //     `${process.env.REACT_APP_API_URL}/common/lastWeekTotalReferral`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //         refreshToken: refreshToken,
  //       },
  //     }
  //   );

  //   if (!data.error) {
  //     setLastWkReferral(data.data);
  //     setLoading(false);
  //   }
  // };
  // const getDriveDataLastWk = async () => {
  //   const { data } = await Axios.get(
  //     `${process.env.REACT_APP_API_URL}/common/lastWeektestDriveRequest`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //         refreshToken: refreshToken,
  //       },
  //     }
  //   );

  //   if (!data.error) {
  //     setLastWkDrive(data.data);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    getCustomerData();
    getProductData();
    getReferralData();
    getTestDriveData();
    getShowroomData();
    getServiceCenterData();
    // getProductDataLastWk();
    // getReferralDataLastWk();
    // getDriveDataLastWk();
  }, []);

  let cardData = {
    customerCount,
    productCount,
    referralCount,
    testDriveCount,
    showroomCount,
    serviceCount,
  };
  // console.log(referralCount);
  return (
    <>
      <div className="row">
        {loading ? (
          <>Loading...</>
        ) : (
          <>
            <div className="col-lg-12 col-xxl-12">
              <MixedWidget1 className="card-stretch gutter-b" data={cardData} />
            </div>

            {/* <div className="col-12 col-lg-6 col-xxl-6">
              <StatsWidget11
                className="card-stretch gutter-b"
                data={lastWkProduct}
              />
            </div>
            <div className="col-12 col-lg-6 col-xxl-6">
              <StatsWidget12
                className="card-stretch gutter-b"
                // data={lastWkReferral}
                data={chartData}
              />
            </div> */}
            {/* <div className="col-12 col-lg-12 col-xxl-12">
              <StatsWidget13
                className="card-stretch gutter-b"
                data={lastWkDrive}
              />
            </div> */}
          </>
        )}
      </div>
    </>
  );
}
