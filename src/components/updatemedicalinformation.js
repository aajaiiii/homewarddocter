import React, { useEffect, useState, useRef } from "react";
import "../css/alladmin.css";
import "../css/sidebar.css";
import "../css/styles.css";
import logow from "../img/logow.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { fetchAlerts } from './Alert/alert';
import { renderAlerts } from './Alert/renderAlerts';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Updatemedicalinformation() {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [medicalInfo, setMedicalInfo] = useState(null);
    const location = useLocation();
    const { id, user } = location.state;
    //   const { idmd: medicalInfoId } = location.state;
    const [isActive, setIsActive] = useState(false);
    const [HN, setHN] = useState("");
    const [AN, setAN] = useState("");
    const [Diagnosis, setDiagnosis] = useState("");
    const [Chief_complaint, setChief_complaint] = useState("");
    const [Present_illness, setPresent_illness] = useState("");
    const [Phychosocial_assessment, setPhychosocial_assessment] = useState("");
    const [Management_plan, setManagement_plan] = useState("");
    const [Date_Admit, setDate_Admit] = useState("");
    const [Date_DC, setDate_DC] = useState("");
    const [fileM, setFileM] = useState(null);
    const [fileP, setFileP] = useState(null);
    const [filePhy, setFilePhy] = useState(null);
    const [pdfURL, setPdfURL] = useState(null);
    const [selectedFileNameP, setSelectedFileNameP] = useState("");
    const [selectedFileNameM, setSelectedFileNameM] = useState("");
    const [selectedFileNamePhy, setSelectedFileNamePhy] = useState("");
    const [pdfURLP, setPdfURLP] = useState("");
    const [pdfURLM, setPdfURLM] = useState("");
    const [pdfURLPhy, setPdfURLPhy] = useState("");
    const [data, setData] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [userId, setUserId] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filterType, setFilterType] = useState("all");
    const notificationsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationsRef]);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const fetchUserData = (token) => {
        return fetch("http://localhost:5000/profiledt", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ token }),
        })
            .then((res) => res.json())
            .then((data) => {
                setProfileData(data.data);
                if (data.data == "token expired") {
                    window.localStorage.clear();
                    window.location.href = "./";
                }
                return data.data;
            })
            .catch((error) => {
                console.error("Error verifying token:", error);
            });
    };

    const fetchAndSetAlerts = (token, userId) => {
        fetchAlerts(token)
            .then((alerts) => {
                setAlerts(alerts);
                const unreadAlerts = alerts.filter(
                    (alert) => !alert.viewedBy.includes(userId)
                ).length;
                setUnreadCount(unreadAlerts);
            })
            .catch((error) => {
                console.error("Error fetching alerts:", error);
            });
    };

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        setToken(token);

        if (token) {
            fetchUserData(token)
                .then(user => {
                    setUserId(user._id);
                    fetchAndSetAlerts(token, user._id);

                    const interval = setInterval(() => {
                        fetchAndSetAlerts(token, user._id);
                        fetchAllUsers(user._id);
                    }, 1000);

                    return () => clearInterval(interval);
                })
                .catch((error) => {
                    console.error("Error verifying token:", error);
                });
        }
    }, []);


    const markAllAlertsAsViewed = () => {
        fetch("http://localhost:5000/alerts/mark-all-viewed", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: userId }),
        })
            .then((res) => res.json())
            .then((data) => {
                const updatedAlerts = alerts.map((alert) => ({
                    ...alert,
                    viewedBy: [...alert.viewedBy, userId],
                }));
                setAlerts(updatedAlerts);
                setUnreadCount(0);
            })
            .catch((error) => {
                console.error("Error marking all alerts as viewed:", error);
            });
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
    };

    const filteredAlerts = filterType === "unread"
        ? alerts.filter(alert => !alert.viewedBy.includes(userId))
        : alerts;


    const formatDate = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();

        const thaiMonths = [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
        ];

        return `${day < 10 ? "0" + day : day} ${thaiMonths[month - 1]} ${year + 543
            } เวลา ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes
            } น.`;
    };

    const fetchAllUsers = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/alluserchat?userId=${userId}`
            );
            const data = await response.json();

            const usersWithLastMessage = await Promise.all(
                data.data.map(async (user) => {
                    const lastMessageResponse = await fetch(
                        `http://localhost:5000/lastmessage/${user._id}?loginUserId=${userId}`
                    );
                    const lastMessageData = await lastMessageResponse.json();

                    const lastMessage = lastMessageData.lastMessage;
                    return { ...user, lastMessage: lastMessage ? lastMessage : null };
                })
            );

            const sortedUsers = usersWithLastMessage.sort((a, b) => {
                if (!a.lastMessage) return 1;
                if (!b.lastMessage) return -1;
                return (
                    new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
                );
            });

            setAllUsers(sortedUsers);
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    };
    //polling
    useEffect(() => {
        const interval = setInterval(() => {
            fetchAllUsers(data._id);
        }, 1000);
        return () => clearInterval(interval);
    }, [data]);

    const countUnreadUsers = () => {
        const unreadUsers = allUsers.filter((user) => {
            const lastMessage = user.lastMessage;
            return (
                lastMessage && lastMessage.senderModel === "User" && !lastMessage.isRead
            );
        });
        return unreadUsers.length;
    };

    const initialSelectedPersonnel = medicalInfo
        ? medicalInfo.selectedPersonnel
        : "";

    const [selectedPersonnel, setSelectedPersonnel] = useState(
        initialSelectedPersonnel
    );

    const handleFileChangeP = (e) => {
        setFileP(e.target.files[0]); // อัปเดต state ของไฟล์ Present illness
        setSelectedFileNameP(e.target.files[0].name); // อัปเดตชื่อไฟล์ที่เลือก
        const pdfURLP = URL.createObjectURL(e.target.files[0]);
        setPdfURLP(pdfURLP);
    };

    const handleFileChangeM = (e) => {
        setFileM(e.target.files[0]); // อัปเดต state ของไฟล์ Management plan
        setSelectedFileNameM(e.target.files[0].name); // อัปเดตชื่อไฟล์ที่เลือก
        const pdfURLM = URL.createObjectURL(e.target.files[0]);
        setPdfURLM(pdfURLM);
    };

    const handleFileChangePhy = (e) => {
        setFilePhy(e.target.files[0]); // อัปเดต state ของไฟล์ Phychosocial assessment
        setSelectedFileNamePhy(e.target.files[0].name); // อัปเดตชื่อไฟล์ที่เลือก
        const pdfURLPhy = URL.createObjectURL(e.target.files[0]);
        setPdfURLPhy(pdfURLPhy);
    };


    const FormatDate = (date) => {
        if (!date) {
            return ""; // Return an empty string if the date is null, undefined, or empty
        }
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return ""; // If the date is invalid, return an empty string
        }
        return formattedDate.toISOString().split("T")[0];
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
                    setProfileData(data.data);
                })
                .catch((error) => {
                    console.error("Error verifying token:", error);
                });
        }
    }, []);

    useEffect(() => {
        getAllMpersonnel();
    }, []);

    useEffect(() => {
        const fetchMedicalInformation = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/medicalInformation/${id}`
                );
                const medicalData = await response.json();

                if (medicalData && medicalData.data) {
                    setMedicalInfo(medicalData.data);
                    console.log("medicalDataupdate:", medicalData);
                    setHN(medicalData.data.HN);
                    setAN(medicalData.data.AN);
                    setDiagnosis(medicalData.data.Diagnosis);
                    setChief_complaint(medicalData.data.Chief_complaint);
                    setPresent_illness(medicalData.data.Present_illness);
                    setPhychosocial_assessment(medicalData.data.Phychosocial_assessment);
                    setManagement_plan(medicalData.data.Management_plan);
                    setDate_Admit(FormatDate(medicalData.data.Date_Admit));
                    setSelectedPersonnel(medicalData.data.selectedPersonnel);
                    setDate_DC(FormatDate(medicalData.data.Date_DC));
                    // setFileP(medicalData.data.fileP);
                    // setFileM(medicalData.data.fileM);
                    // setFilePhy(medicalData.data.filePhy);

                    const filePath = medicalData.data.fileP.replace(/\\/g, "/");
                    const fileName = filePath.split("/").pop();
                    setFileP(fileName);

                    const filePathM = medicalData.data.fileM.replace(/\\/g, "/");
                    const fileNameM = filePathM.split("/").pop();
                    setFileM(fileNameM);

                    const filePathPhy = medicalData.data.filePhy.replace(/\\/g, "/");
                    const fileNamePhy = filePathPhy.split("/").pop();
                    setFilePhy(fileNamePhy);

                } else {
                    console.error("Medical information not found for this user");
                }
            } catch (error) {
                console.error("Error fetching medical information:", error);
            }
        };
        fetchMedicalInformation();
    }, [id]);



    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "./";
    };
    // bi-list
    const handleToggleSidebar = () => {
        setIsActive(!isActive);
    };

    const getAllMpersonnel = () => {
        fetch("http://localhost:5000/allMpersonnel", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // เพิ่ม Authorization header เพื่อส่ง token ในการร้องขอ
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "AllMpersonnel");
                setData(data.data);
            });
    };

    const UpdateMedical = async () => {
        console.log(HN, AN,);
        const selectedPersonnelValue =
            document.getElementById("selectedPersonnel").value;

        try {
            if (!medicalInfo) {
                console.error("ไม่พบข้อมูลการแพทย์");
                return;
            }

            const updatedSelectedPersonnel = selectedPersonnelValue !== "" ? selectedPersonnelValue : selectedPersonnel;

            const formData = new FormData();
            formData.append("HN", HN);
            formData.append("AN", AN);
            formData.append("Date_Admit", Date_Admit);
            formData.append("Date_DC", Date_DC);
            formData.append("Diagnosis", Diagnosis);
            formData.append("Chief_complaint", Chief_complaint);
            formData.append("Present_illness", Present_illness);
            formData.append("selectedPersonnel", updatedSelectedPersonnel); // ใช้ค่าที่อัปเดตแล้ว
            formData.append("Phychosocial_assessment", Phychosocial_assessment);
            formData.append("Management_plan", Management_plan);

            if (fileP) {
                formData.append("fileP", fileP);
            }

            if (fileM) {
                formData.append("fileM", fileM);
            }

            if (filePhy) {
                formData.append("filePhy", filePhy);
            }

            console.log("info:", id);
            const response = await fetch(
                `http://localhost:5000/updatemedicalinformation/${medicalInfo._id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                const updatemedicalinformation = data; // ใช้ข้อมูลที่อ่านได้ในการทำงานต่อไป
                console.log("แก้ไข้อมูลแล้ว:", updatemedicalinformation);
                toast.success("แก้ไขข้อมูลสำเร็จ");
                setTimeout(() => {
                    navigate("/infopatient", { state: { id: id, user: user } });

                    // navigate("/allinfo");
                }, 1100);
            } else {
                console.error("แก้ไขไม่ได้:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating medical information:", error);
            // ดำเนินการเมื่อเกิดข้อผิดพลาดในการส่งคำขอ
        }
    };

    return (
        <main className="body">
            <ToastContainer />
            <div className={`sidebar ${isActive ? 'active' : ''}`}>
                <div class="logo_content">
                    <div class="logo">
                        <div class="logo_name" >
                            <img src={logow} className="logow" alt="logo" ></img>
                        </div>
                    </div>
                    <i class='bi bi-list' id="btn" onClick={handleToggleSidebar}></i>
                </div>
                <ul class="nav-list">
                    <li>
                        <a href="home">
                            <i class="bi bi-house"></i>
                            <span class="links_name" >หน้าหลัก</span>
                        </a>
                    </li>
                    <li>
                        <a href="assessment" >
                            <i class="bi bi-clipboard2-pulse"></i>
                            <span class="links_name" >ติดตาม/ประเมินอาการ</span>
                        </a>
                    </li>
                    <li>
                        <a href="allpatient" >
                            <i class="bi bi-people"></i>
                            <span class="links_name" >จัดการข้อมูลการดูแลผู้ป่วย</span>
                        </a>
                    </li>
                    <li>
                        <a href="assessreadiness" >
                            <i class="bi bi-clipboard-check"></i>
                            <span class="links_name" >ประเมินความพร้อมการดูแล</span>
                        </a>
                    </li>
                    <li>
                        <a href="assessinhomesss" >
                            <i class="bi bi-house-check"></i>
                            <span class="links_name" >แบบประเมินเยี่ยมบ้าน</span>
                        </a>
                    </li>
                    <li>
                        <a href="chat" style={{ position: "relative" }}>
                            <i className="bi bi-chat-dots"></i>
                            <span className="links_name">แช็ต</span>
                            {countUnreadUsers() !== 0 && (
                                <span className="notification-countchat">
                                    {countUnreadUsers()}
                                </span>
                            )}
                        </a>
                    </li>
                    <div class="nav-logout">
                        <li>
                            <a href="./" onClick={logOut}>
                                <i class='bi bi-box-arrow-right' id="log_out" onClick={logOut}></i>
                                <span class="links_name" >ออกจากระบบ</span>
                            </a>
                        </li>
                    </div>
                </ul>
            </div>
            <div className="home_content">
                <div className="homeheader">
                    <div className="header">จัดการข้อมูลการดูแลผู้ป่วย</div>
                    <div className="profile_details">
                        <ul className="nav-list">
                            <li>
                                <a className="bell-icon" onClick={toggleNotifications}>
                                    {showNotifications ? (
                                        <i className="bi bi-bell-fill"></i>
                                    ) : (
                                        <i className="bi bi-bell"></i>
                                    )}
                                    {unreadCount > 0 && (
                                        <span className="notification-count">{unreadCount}</span>
                                    )}
                                </a>
                            </li>
                            <li>
                                <a href="profile">
                                    <i className="bi bi-person"></i>
                                    <span className="links_name">
                                        {profileData && profileData.nametitle + profileData.name + " " + profileData.surname}
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {showNotifications && (
                    <div className="notifications-dropdown" ref={notificationsRef}>
                        <div className="notifications-head">
                            <h2 className="notifications-title">การแจ้งเตือน</h2>
                            <p className="notifications-allread" onClick={markAllAlertsAsViewed}>
                                ทำเครื่องหมายว่าอ่านทั้งหมด
                            </p>
                            <div className="notifications-filter">
                                <button className={filterType === "all" ? "active" : ""} onClick={() => handleFilterChange("all")}>
                                    ดูทั้งหมด
                                </button>
                                <button className={filterType === "unread" ? "active" : ""} onClick={() => handleFilterChange("unread")}>
                                    ยังไม่อ่าน
                                </button>
                            </div>
                        </div>
                        {filteredAlerts.length > 0 ? (
                            <>
                                {renderAlerts(filteredAlerts, token, userId, navigate, setAlerts, setUnreadCount, formatDate)}
                            </>
                        ) : (
                            <p className="no-notification">ไม่มีการแจ้งเตือน</p>
                        )}
                    </div>
                )}
                <div className="breadcrumbs mt-4">
                    <ul>
                        <li>
                            <a href="home">
                                <i class="bi bi-house-fill"></i>
                            </a>
                        </li>
                        <li className="arrow">
                            <i class="bi bi-chevron-double-right"></i>
                        </li>
                        <li>
                            <a href="allpatient">จัดการข้อมูลการดูแลผู้ป่วย</a>
                        </li>
                        <li className="arrow">
                            <i class="bi bi-chevron-double-right"></i>
                        </li>
                        <li>
                            <a href="infopatient" onClick={() => navigate("/infopatient", { state: { id: id, user: user } })}>ข้อมูลการดูแลผู้ป่วย</a>
                        </li>
                        <li className="arrow">
                            <i class="bi bi-chevron-double-right"></i>
                        </li>
                        <li>
                            <a>แก้ไขข้อมูลการเจ็บป่วย</a>
                        </li>
                    </ul>
                </div>
                <br></br>
                <h3>แก้ไขข้อมูลการเจ็บป่วย</h3>
                {medicalInfo && (
                    <div className="adminall card mb-1">
                        <div className="mb-1">
                            <label>HN</label>
                            <input
                                type="text"
                                className="form-control"
                                value={HN}
                                onChange={(e) => setHN(e.target.value)}
                            />
                        </div>
                        <div className="mb-1">
                            <label>AN</label>
                            <input
                                type="text"
                                value={AN}
                                className="form-control"
                                onChange={(e) => setAN(e.target.value)}
                            />
                        </div>

                        <div className="mb-1">
                            <label>วันที่ Admit </label>
                            <input
                                type="date"
                                value={Date_Admit}
                                className="form-control"
                                onChange={(e) => setDate_Admit(e.target.value)}
                            />
                        </div>
                        <div className="mb-1">
                            <label>วันที่ D/C</label>
                            <input
                                type="date"
                                value={Date_DC}
                                className="form-control"
                                onChange={(e) => setDate_DC(e.target.value)}
                            />
                        </div>
                        <div className="mb-1">
                            <label>แพทย์ผู้ดูแล</label>
                            <select
                                id="selectedPersonnel"
                                className="form-select"
                                value={selectedPersonnel}
                                onChange={(e) => setSelectedPersonnel(e.target.value)}
                            >
                                <option value="">โปรดเลือกแพทย์</option>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((personnel) => (
                                        <option key={personnel._id} value={personnel._id}>
                                            {`${personnel.nametitle} ${personnel.name} ${personnel.surname}`}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">ไม่มีข้อมูลแพทย์</option>
                                )}
                            </select>
                        </div>

                        <div className="mb-1">
                            <label>Diagnosis</label>
                            <textarea
                                className="form-control"
                                value={Diagnosis}
                                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                                style={{ resize: "vertical" }} // ให้ textarea สามารถปรับขนาดได้ในทิศทางดิสพล์เมนต์
                                onChange={(e) => setDiagnosis(e.target.value)}
                            />
                        </div>
                        <div className="mb-1">
                            <label>Chief complaint</label>
                            <textarea
                                className="form-control"
                                value={Chief_complaint}
                                rows="3" // กำหนดจำนวนแถวเริ่มต้น
                                style={{ resize: "vertical" }}
                                onChange={(e) => setChief_complaint(e.target.value)}
                            />
                        </div>
                        <div className="mb-1">
                            <label>Present illness</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="application/pdf"
                                onChange={handleFileChangeP}
                            />
                            <div className="filename">
                                {pdfURLP ? (
                                    <a href={pdfURLP} target="_blank" rel="noopener noreferrer">
                                        {selectedFileNameP}
                                    </a>
                                ) : (
                                    fileP && (
                                        <a
                                            onClick={() => {
                                                window.open(
                                                    `http://localhost:5000/file/${fileP}`,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            {fileP}
                                        </a>
                                    )
                                )}
                            </div>
                            <textarea
                                className="form-control"
                                value={Present_illness} // Set the value attribute
                                rows="3"
                                style={{ resize: "vertical" }}
                                onChange={(e) => setPresent_illness(e.target.value)}
                            />

                        </div>

                        <div className="mb-1">
                            <label>Management plan</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="application/pdf"
                                onChange={handleFileChangeM}
                            />
                            <div className="filename">
                                {pdfURLM ? (
                                    <a href={pdfURLM} target="_blank" rel="noopener noreferrer">
                                        {selectedFileNameM}
                                    </a>
                                ) : (
                                    fileM && (
                                        <a
                                            onClick={() => {
                                                window.open(
                                                    `http://localhost:5000/file/${fileM}`,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            {fileM}
                                        </a>
                                    )
                                )}
                            </div>
                            <textarea
                                className="form-control"
                                value={Management_plan} // Set the value here
                                rows="3"
                                style={{ resize: "vertical" }}
                                onChange={(e) => setManagement_plan(e.target.value)}
                            />
                        </div>

                        <div className="mb-1">
                            <label>Phychosocial assessment</label>

                            <input
                                type="file"
                                className="form-control"
                                accept="application/pdf"
                                onChange={handleFileChangePhy}
                            />

                            <div className="filename">
                                {pdfURLPhy ? (
                                    <a href={pdfURLPhy} target="_blank" rel="noopener noreferrer">
                                        {selectedFileNamePhy}
                                    </a>
                                ) : (
                                    filePhy && (
                                        <a
                                            onClick={() => {
                                                window.open(
                                                    `http://localhost:5000/file/${filePhy}`,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            {filePhy}
                                        </a>
                                    )
                                )}
                            </div>
                            <textarea
                                className="form-control"
                                value={Phychosocial_assessment} // Set the value here
                                rows="3"
                                style={{ resize: "vertical" }}
                                onChange={(e) => setPhychosocial_assessment(e.target.value)}
                            />
                        </div>

                    </div>

                )}
                <div className="btn-group">
                    <div className="btn-next">
                        <button onClick={UpdateMedical} className="btn btn-outline py-2">
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>

            <div></div>
        </main>
    );
}
