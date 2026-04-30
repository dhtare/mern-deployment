import React, { useState, useEffect } from "react";
import { Tab, Tabs, Container, Row, Col } from "react-bootstrap";
import { Chart } from "react-google-charts";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import {
  submitChart1,
  submitChart2,
  submitChart3,
  submitChart4,
  submitChart5,
  submitChart6,
  submitChart8,
  submitChart10,
  submitChart11,
  headerCount,
} from "../services/api";
import { Card } from "antd";

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [npsData, setNpsData] = useState([]);
  const [thematicData, setThematicData] = useState([]);
  const [customerSatisfactionData, setCustomerSatisfactionData] = useState([]);
  const [averageScoresData, setAverageScoresData] = useState([]);
  const [
    customerSatisfactionDataByLocation,
    setCustomerSatisfactionDataByLocation,
  ] = useState([]);
  const [gaugeChartData, setGaugeChartData] = useState([]);
  const [funnelChartData, setfunnelChartData] = useState([]);
  const [avgCustomerSatisfactionOverTime, setAvgCustomerSatisfactionOverTime] =
    useState([]);
  const [dashboardCount, setDashboardCount] = useState([]);
  const [activeTab, setActiveTab] = useState("overall");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await fetchChartData(token);
    };
    fetchInitialData();
  }, [navigate]);

  const levelColorMap = {
    "Very Unsatisfied": "#20A5DE",
    Unsatisfied: "#E98A2E",
    Neutral: "#F2B431",
    Satisfied: "#57BEBE",
    "Very Satisfied": "#64518a",
  };

  const categoryColorMap = {
    Detractors: "#20A5DE",
    Passives: "#F2B431",
    Promoters: "#64518a",
  };

  const fetchChartData = async (token) => {
    try {
      const results = await Promise.all([
        submitChart1(token),
        submitChart2(token),
        submitChart3(token),
        submitChart4(token),
        headerCount(token),
        submitChart10(token),
      ]);

      if (results[0].success) {
        const formattedData = [["Level", "percent", { role: "style" }]];
        results[0].data.forEach((item) => {
          const color = levelColorMap[item.level] || "#b87333";
          formattedData.push([item.level, Number(item.percent), color]);
        });
        setBarChartData(formattedData);
      }

      if (results[1].success) {
        const satisfactionData = [["Category", "Count"]];
        results[1].data.forEach((item) => {
          satisfactionData.push([item.category, Number(item.count)]);
        });
        setCustomerSatisfactionData(satisfactionData);
      }

      if (results[3].success) {
        const averageScoresData = [["Month", "Average Score"]];
        results[3].data.forEach((item) => {
          averageScoresData.push([`${item.month}`, Number(item.averageFq1)]);
        });
        setAverageScoresData(averageScoresData);
      }

      if (results[2].success) {
        const customerSatisfactionDataByLocation = [["Location", "percent"]];

        results[2].data.forEach((item) => {
          customerSatisfactionDataByLocation.push([
            item.location,
            Number(item.percent),
          ]);
        });
        setCustomerSatisfactionDataByLocation(
          customerSatisfactionDataByLocation
        );
      }

      if (results[4].success) {
        setDashboardCount(results[4].data);
      }

      if (results[5].success) {
        const thematicData = [["theme", "count"]];
        results[5].data.forEach((item) => {
          thematicData.push([item.theme, item.count]);
        });
        setThematicData(thematicData);
      }

    } catch (error) {
      console.error("Error fetching data for the charts:", error);
    }
  };

  const fetchNpsData = async (token) => {
    try {
      const results = await Promise.all([
        submitChart11(token),
        submitChart8(token),
        submitChart6(token),
        submitChart5(token),
      ]);


      if (results[0].success) {
        const npsScore = results[0].nps;
        const gaugeChartData = [
          ["Label", "Value"],
          ["NPS", npsScore],
        ];
        setGaugeChartData(gaugeChartData);
      }

      if (results[1].success) {
        const avgCustomerSatisfactionOverTime = [["monthyear", "nps"]];
        results[1].data.forEach((item) => {
          avgCustomerSatisfactionOverTime.push([item.monthyear, item.nps]);
        });

        setAvgCustomerSatisfactionOverTime(avgCustomerSatisfactionOverTime);
      }


      if (results[2].success) {
        const funnelChartData = [["Category", "Conversion Percentage"]];
        results[2].data.forEach((item) => {
          const conversionPercentage = Number(item.conversionPercentage) || 0;
          funnelChartData.push([item.category, conversionPercentage]);
        });

        setfunnelChartData(funnelChartData);
      }

      if (results[3].success) {
        const npsData = [["Category", "percent", { role: "style" }]];
        results[3].data.forEach((item) => {
          const color = categoryColorMap[item.category] || "#b87333";

          npsData.push([item.category, Number(item.percent), color]);
        });
        setNpsData(npsData);
      }

    } catch (error) {
      console.error("Error fetching data for the charts:", error);
    }
  };

  const handleTabSelect = async (key) => {
    setActiveTab(key);
    const token = localStorage.getItem("token");

    if (token) {
      if (key === "overall") {
        await fetchChartData(token);
      } else if (key === "nps") {
        await fetchNpsData(token);
      }
    }
  };

  return (
    <>
      <div className="layout-content">
        <Row className="my-4 justify-content-center">
          <Col md={2}>
            <div className="metrics-card">
              <p>{dashboardCount.totalResponses}</p>
              <h5>Total Responses</h5>
            </div>
          </Col>
          <Col md={2}>
            <div className="metrics-card">
              <p>{dashboardCount.nps}</p>
              <h5>NPS Score</h5>
            </div>
          </Col>
          <Col md={2}>
            <div className="metrics-card">
              <p>{dashboardCount.promoters} %</p>
              <h5>Promoters</h5>
            </div>
          </Col>
          <Col md={2}>
            <div className="metrics-card">
              <p>{dashboardCount.passives}%</p>
              <h5>Passives</h5>
            </div>
          </Col>
          <Col md={2}>
            <div className="metrics-card">
              <p>{dashboardCount.detractors}%</p>
              <h5>Detractors</h5>
            </div>
          </Col>
        </Row>
      </div>
      <Container fluid className="dashboard-container">
        <Tabs
          activeKey={activeTab}
          onSelect={handleTabSelect}
          id="dashboard-tabs"
          className="custom-tabs"
        >
          <Tab eventKey="overall" title="Customer Satisfaction">
            <Row className="chart-section row1" gutter={[24, 0]}>
              <Col md={4}>
                <Card bordered={false} className="circle-box">
                  <div className="cart-title">
                    Overall Customer Satisfaction
                  </div>
                  {barChartData.length > 0 && (
                    <Chart
                      chartType="ColumnChart"
                      data={barChartData}
                      width="100%"
                      height="400px"
                      options={{
                        hAxis: {
                          title: "Satisfaction Level",
                          textStyle: { color: "#333" },
                        },
                        vAxis: {
                          title: "Number of Respondents",
                          minValue: 0,
                        },
                        colors: ["#64518A"],

                        tooltip: { isHtml: true },
                      }}
                    />
                  )}
                </Card>
              </Col>
              <Col md={4}>
                <Card bordered={false}>
                  <div className="cart-title">
                    Proportion of Respondents in each satisfaction category
                  </div>
                  {customerSatisfactionData.length > 0 && (
                    <Chart
                      chartType="PieChart"
                      data={customerSatisfactionData}
                      width="100%"
                      height="400px"
                      options={{
                        is3D: true,
                        colors: [
                          "#20A5DE",
                          "#E9882E",
                          "#F2B431",
                          "#57BEBE",
                          "#64518A",
                        ],
                      }}
                    />
                  )}
                </Card>
              </Col>
              <Col md={4}>
                <Card bordered={false}>
                  <div className="cart-title">
                    Customer Satisfaction by Location
                  </div>
                  {customerSatisfactionDataByLocation.length > 1 && (
                    <Chart
                      chartType="BarChart"
                      data={customerSatisfactionDataByLocation}
                      width="100%"
                      height="400px"
                      options={{
                        legend: { position: "bottom" },
                        vAxis: { title: "Location" },
                        colors: ["#8D7FB9"],
                      }}
                    />
                  )}
                </Card>
              </Col>
            </Row>
            <Row className="chart-section row2" gutter={[24, 0]}>
              <Col md={4}>
                <Card bordered={false}>
                  <div className="cart-title">
                    Average Customer Satisfaction Tranded
                  </div>
                  {averageScoresData.length > 0 && (
                    <Chart
                      chartType="LineChart"
                      data={averageScoresData}
                      width="100%"
                      height="400px"
                      options={{
                        hAxis: {
                          title: "Month",
                          textStyle: { color: "#333" },
                        },
                        vAxis: {
                          title: "Average Satisfaction Score",
                          minValue: 0,
                        },
                        curveType: "function",
                        tooltip: { isHtml: true },
                      }}
                    />
                  )}
                </Card>
              </Col>

              <Col md={4}>
                <Card bordered={false}>
                  <div className="cart-title">
                    Thematic Analysis of customer Feedback
                  </div>
                  {averageScoresData.length > 0 && (
                    <Chart
                      chartType="ColumnChart"
                      data={thematicData}
                      width="100%"
                      height="400px"
                      options={{
                        hAxis: {
                          title: "Count of Mentions",
                          textStyle: { color: "#333" },
                        },
                        vAxis: {
                          title: "Themes",
                          minValue: 0,
                        },
                        curveType: "function",
                        tooltip: { isHtml: true },
                        colors: [
                          "#57BEBE",
                        ],
                      }}
                    />
                  )}
                </Card>
              </Col>

            
           
            </Row>
          </Tab>

          <Tab eventKey="nps" title="Net Promoter Score (NPS)">
            <Row className="chart-section row1" gutter={[24, 0]}>

            <Col md={4}>
                <Card bordered={false}>
                  <div className="cart-title">NPS Score Gauge Chart</div>
                  {gaugeChartData.length > 0 && (
                    <Chart
                      chartType="Gauge"
                      className="gauge-chart"
                      data={gaugeChartData}
                      width="100%"
                      height="400px"
                      options={{
                        redFrom: -100,
                        redTo: 0,
                        redColor: "#dc3545",
                        yellowFrom: 0,
                        yellowTo: 50,
                        yellowColor: "#F2B431",
                        greenFrom: 50,
                        greenTo: 100,
                        greenColor:"#20c997",
                        minorTicks: 5,
                      
                      }}
                    />
                  )}
                </Card>
              </Col>
              <Col md={4}>
                <Card bordered={false}>
                  <div className="cart-title">
                   NPS score Tranded
                  </div>
                  {averageScoresData.length > 0 && (
                    <Chart
                      chartType="LineChart"
                      data={avgCustomerSatisfactionOverTime}
                      width="100%"
                      height="400px"
                      options={{
                        hAxis: {
                          title: "Month",
                          textStyle: { color: "#333" },
                        },
                        vAxis: {
                          title: "Average Satisfaction Score",
                          minValue: 0,
                        },
                        curveType: "function",
                        tooltip: { isHtml: true },
                      }}
                    />
                  )}
                </Card>
              </Col>
              <Col md={4}>
                <Card bordered={false}>
                  <div className="cart-title">
                    Number of Respondents in each NPS Category
                  </div>
                  {npsData.length > 0 && (
                    <Chart
                      chartType="ColumnChart"
                      data={npsData}
                      width="100%"
                      height="400px"
                      options={{
                        hAxis: {
                          title: "NPS Category",
                          textStyle: { color: "#333", fontSize: 14 },
                        },
                        vAxis: {
                          title: "Number of Respondents",
                          textStyle: { color: "#333", fontSize: 14 },
                          minValue: 0,
                        },
                        colors: ["#64518A"],
                      }}
                    />
                  )}
                </Card>
              </Col>
              <Row className="chart-section row2" gutter={[24, 0]}>
              <Col md={4}>
                <Card bordered={false}>
                  <div className="cart-title">Conversion Rate</div>
                  <Chart
                    chartType="BarChart"
                    data={funnelChartData}
                    width="100%"
                    height="400px"
                    options={{
                      hAxis: {
                        title: "Number of Respondents",
                        minValue: 0,
                      },
                      colors: [
                        "#0387AD",
                      ],
                    }}
                  />
                </Card>
              </Col>
              </Row>
             
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default Dashboard;
