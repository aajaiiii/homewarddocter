import React, { useEffect, useState } from "react";
import "../css/sidebar.css";
import "../css/alladmin.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import Pt from "../img/pt.png";
import Pt2 from "../img/pt2.png";
import Bh from "../img/better-health.png";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import CountUp from 'react-countup';

export default function Home() {
  const [data, setData] = useState([]);
  const [datauser, setDatauser] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [token, setToken] = useState('');
  const [medicalData, setMedicalData] = useState({});
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(0);

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./";
  };

  // bi-list
  const handleToggleSidebar = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setToken(token);
    if (token) {
      fetch("http://localhost:5000/profiledt", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          token: token,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setData(data.data);
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
        });
    }
  }, []);

  useEffect(() => {
    getAllUser();
  }, []);


  const getAllUser = () => {
    fetch("http://localhost:5000/alluser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "AllUser");
        setDatauser(data.data);
      });
  };

  useEffect(() => {
    const fetchCompletedCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/completedAssessmentsCount', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCompletedCount(data.count);
      } catch (error) {
        console.error('Error fetching completed assessments count:', error);
      }
    };

    fetchCompletedCount();
  }, []);

  useEffect(() => {
    const fetchMedicalData = async () => {
      const promises = datauser.map(async (user) => {
        if (user.deletedAt === null) {
          try {
            const response = await fetch(`http://localhost:5000/medicalInformation/${user._id}`);
            const medicalInfo = await response.json();
            return {
              userId: user._id,
              hn: medicalInfo.data?.HN,
              an: medicalInfo.data?.AN,
              diagnosis: medicalInfo.data?.Diagnosis,
              isCaseClosed: medicalInfo.data?.isCaseClosed, // สมมติว่า API ส่งสถานะการปิดเคสมา
            };
          } catch (error) {
            console.error(`Error fetching medical information for user ${user._id}:`, error);
            return {
              userId: user._id,
              hn: "Error",
              an: "Error",
              diagnosis: "Error fetching data",
              isCaseClosed: false, // ถ้าเกิดข้อผิดพลาด กำหนดเป็น false
            };
          }
        }
        return null;
      });

      const results = await Promise.all(promises);
      const medicalDataMap = results.reduce((acc, result) => {
        if (result) {
          acc[result.userId] = result;
        }
        return acc;
      }, {});
      setMedicalData(medicalDataMap);
    };


    if (datauser.length > 0) {
      fetchMedicalData();
    }
  }, [datauser]);

  // Aggregate diagnosis data
  const diagnosisCount = datauser.reduce((acc, user) => {
    if (user.deletedAt === null && medicalData[user._id]?.diagnosis) {
      const diagnosis = medicalData[user._id].diagnosis;
      if (acc[diagnosis]) {
        acc[diagnosis]++;
      } else {
        acc[diagnosis] = 1;
      }
    }
    return acc;
  }, {});

  const diagnosisData = Object.entries(diagnosisCount).map(([name, value]) => ({ name, value }));

  // Define colors for each diagnosis
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28AFF', '#FF6F91', '#FF6361', '#BC5090'];

  // คำนวณจำนวนเพศแต่ละประเภท
  const genderCounts = datauser.reduce((acc, user) => {
    if (user.deletedAt === null && user.gender) {
      acc[user.gender] = (acc[user.gender] || 0) + 1;
    }
    return acc;
  }, {});

  // แปลงข้อมูลเพศเป็นรูปแบบที่เหมาะสมสำหรับแท่งกราฟ
  const genderData = Object.keys(genderCounts).map((gender) => ({
    gender,
    count: genderCounts[gender],
  }));

  // เตรียมข้อมูลสำหรับแท่งกราฟ
  const barChartData = genderData.map((entry) => ({
    name: entry.gender,
    count: entry.count,
  }));

  // กำหนดสีแต่ละแท่งกราฟ
  const BAR_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28AFF', '#FF6F91', '#FF6361', '#BC5090'];

  // ฟังก์ชั่นเพื่อหากลุ่มอายุ
  const getAgeGroup = (age) => {
    if (age >= 1 && age <= 10) {
      return '1-10';
    } else if (age >= 11 && age <= 20) {
      return '11-20';
    } else if (age >= 21 && age <= 30) {
      return '21-30';
    } else if (age >= 31 && age <= 40) {
      return '31-40';
    } else if (age >= 41 && age <= 50) {
      return '41-50';
    } else if (age >= 51 && age <= 60) {
      return '51-60';
    } else if (age >= 61 && age <= 70) {
      return '61-70';
    } else if (age >= 71 && age <= 80) {
      return '71-80';
    } else if (age >= 81 && age <= 90) {
      return '81-90';
    } else {
      return '91-100';
    }
  };

  // คำนวณจำนวนผู้ป่วยตามช่วงอายุและเพศ
  const ageGroupCounts = datauser.reduce((acc, user) => {
    if (user.deletedAt === null && user.age) {
      const ageGroup = getAgeGroup(user.age);
      if (!acc[ageGroup]) {
        acc[ageGroup] = {};
      }
      if (!acc[ageGroup][user.gender]) {
        acc[ageGroup][user.gender] = 0;
      }
      acc[ageGroup][user.gender]++;
    }
    return acc;
  }, {});

  // แปลงข้อมูลเป็นรูปแบบที่เหมาะสมสำหรับแผนภูมิแท่ง
  const ageGroupData = Object.keys(ageGroupCounts).map((ageGroup) => ({
    ageGroup,
    Male: ageGroupCounts[ageGroup]['Male'] || 0,
    Female: ageGroupCounts[ageGroup]['Female'] || 0,
  }));

  return (
    <main className="body">
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <div class="logo_content">
          <div class="logo">
            <div class="logo_name" >
              <img src={logow} className="logow" alt="logo" ></img>
            </div>
          </div>
          <i className='bi bi-list' id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <ul className="nav-list">
          <li>
            <a href="home">
              <i className="bi bi-house"></i>
              <span className="links_name">หน้าหลัก</span>
            </a>
          </li>
          <li>
            <a href="assessment">
              <i className="bi bi-clipboard2-pulse"></i>
              <span className="links_name">ติดตาม/ประเมินอาการ</span>
            </a>
          </li>
          <li>
            <a href="allpatient">
              <i className="bi bi-people"></i>
              <span className="links_name">จัดการข้อมูลการดูแลผู้ป่วย</span>
            </a>
          </li>
          <li>
            <a href="assessreadiness">
              <i className="bi bi-clipboard-check"></i>
              <span className="links_name">ประเมินความพร้อมการดูแล</span>
            </a>
          </li>
          <li>
            <a href="assessinhomesss">
              <i className="bi bi-house-check"></i>
              <span className="links_name">แบบประเมินเยี่ยมบ้าน</span>
            </a>
          </li>
          <li>
            <a href="chat">
              <i className="bi bi-chat-dots"></i>
              <span className="links_name">แช็ต</span>
            </a>
          </li>
          <div className="nav-logout">
            <li>
              <a href="./" onClick={logOut}>
                <i className='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                <span className="links_name">ออกจากระบบ</span>
              </a>
            </li>
          </div>
        </ul>
      </div>
      <div className="home_content">
        <div className="homeheader">
          <div className="header">ภาพรวมระบบ
          </div>
          <div className="profile_details">
            <li>
              <a href="profile">
                <i className="bi bi-person"></i>
                <span className="links_name">
                {data && data.nametitle + data.name + " " + data.surname}
                </span>
              </a>
            </li>
          </div>
        </div>
        <div className="breadcrumbs mt-4">
          <ul>
            <li>
              <a href="home">
                <i className="bi bi-house-fill"></i>
              </a>
            </li>
            <li className="arrow">
              <i className="bi bi-chevron-double-right"></i>
            </li>
            <li><a>ภาพรวมระบบ</a></li>
          </ul>
        </div>
        <div className="row px-5 mt-5">
          <div className="grid">
            <div className="item">
              <div className="countcontent">
                <div className="row align-items-center">
                  <div className="color-strip bg-primary"></div>
                  <div className="col">
                    <div className="bg-icon">
                      <img src={Pt2} className="patient" alt="patient" />
                    </div>
                  </div>
                  <div className="col">
                    <p className="num mt-2"><CountUp end={datauser.filter((user) => user.deletedAt === null).length} /></p>
                    <p className="name fs-5">ผู้ป่วยทั้งหมด</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="countcontent">
                <div className="row align-items-center">
                  <div className="color-strip bg-success"></div>
                  <div className="col">
                    <div className="bg-icon">
                      <img src={Pt} className="patient" alt="patient" />
                    </div>
                  </div>
                  <div className="col">
                    <p className="num mt-2"><CountUp end={datauser.filter((user) => user.deletedAt === null).length} /></p>
                    <p className="name fs-5">ผู้ป่วยที่กำลังรักษา</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="countcontent">
                <div className="row align-items-center">
                  <div className="color-strip bg-yellow"></div>
                  <div className="col">
                    <div className="bg-icon">
                      <img src={Bh} className="patient" alt="patient" />
                    </div>
                  </div>
                  <div className="col">
                    <p className="num mt-2"><CountUp end={((user) => user.deletedAt === null).length} duration={2} /></p>
                    <p className="name fs-5">ผู้ป่วยที่ปิดเคสแล้ว</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="item">
              <h6> <b>Gender</b></h6>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}
                  isAnimationActive={true}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" label={{ position: 'top' }}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="item">
              <h6><b></b></h6>
              <ResponsiveContainer width="100%" height={300}>

              </ResponsiveContainer>
            </div> */}
          </div>
        </div>
        <div className="chart-container d-flex justify-content-center mt-5">
          <div className="chart-content">
            <PieChart width={500} height={500}>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={diagnosisData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={({ name, percent }) => ` ${(percent * 100).toFixed(0)}%`}
              >
                {diagnosisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`ผู้ป่วย${name}`]} />
            </PieChart>
          </div>
          <div className="legend-content mb-5">
            <div className="diagnosis-legend">
              <h5> <b>Diagnosis</b></h5>
              <ul>
                {diagnosisData.map((entry, index) => (
                  <li key={`item-${index}`} style={{ color: COLORS[index % COLORS.length] }}>
                    <span style={{ color: COLORS[index % COLORS.length], padding: '10px 10px', borderRadius: '5px', lineHeight: '30px' }}>
                      ผู้ป่วย{entry.name} : {entry.value} cases
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

