import React, { useState } from "react";

const OtherPeopleForm = ({ formData, onSave, onClose }) => {
    const [formValues, setFormValues] = useState({ ...formData });

    const handleChange = (field, value) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 🔹 เช็คว่ามีการเปลี่ยนแปลงหรือไม่
        if (JSON.stringify(formValues) === JSON.stringify(formData)) {
            const confirmSave = window.confirm("ไม่มีการเปลี่ยนแปลงข้อมูล ต้องการบันทึกหรือไม่?");
            if (!confirmSave) {
                return; // ❌ ถ้าผู้ใช้กดยกเลิก ไม่ต้องบันทึก
            }
        }

        onSave(formValues); // ส่งข้อมูลที่อัปเดตกลับไปยัง `DetailAgendaForm`
    };
    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header d-flex justify-content-center">
                        <h5 className="modal-title text-black text-center">
                            แก้ไข Other People
                        </h5>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="m-2">
                                <label className="form-label">ชื่อ - นามสกุล</label>
                                <input
                                    className="form-control"
                                    disabled
                                    value={`${formValues.firstName || ""} ${formValues.lastName || ""}`}
                                />
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">วันเกิด :</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formValues.birthDate || ""}
                                    onChange={(e) => handleChange("birthDate", e.target.value)
                                    }
                                />
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">ความสัมพันธ์ :</label>
                                <input
                                    className="form-control"
                                    value={formValues.relationship || ""}
                                    onChange={(e) =>
                                        handleChange("relationship", e.target.value)
                                    }
                                />
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">อาชีพ :</label>
                                <select
                                    className="form-select"
                                    value={formValues.occupation || ""}
                                    onChange={(e) =>
                                        handleChange("occupation", e.target.value)
                                    }
                                >
                                    <option value="">เลือกอาชีพ</option>
                                    <option value="ข้าราชการ">ข้าราชการ</option>
                                    <option value="รับจ้างทั่วไป">รับจ้างทั่วไป</option>
                                    <option value="พนักงานบริษัทเอกชน">พนักงานบริษัทเอกชน</option>
                                    <option value="นักเรียน/นักศึกษา">นักเรียน/นักศึกษา</option>
                                    <option value="ว่างงาน">ว่างงาน</option>
                                    <option value="เจ้าของธุรกิจ">เจ้าของธุรกิจ</option>
                                    <option value="อาชีพอิสระ">อาชีพอิสระ</option>
                                    <option value="ค้าขาย">ค้าขาย</option>
                                    <option value="เกษตรกร">เกษตรกร</option>
                                    <option value="ครู/อาจารย์ ">ครู/อาจารย์ </option>
                                    <option value="แพทย์/พยาบาล/บุคลากรทางการแพทย์">แพทย์/พยาบาล/บุคลากรทางการแพทย์</option>
                                    <option value="วิศวกร">วิศวกร</option>
                                    <option value="เกษียณอายุ">เกษียณอายุ</option>
                                </select>
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">สถานภาพ :</label>
                                <select
                                    className="form-select"
                                    value={formValues.status || ""}
                                    onChange={(e) =>
                                        handleChange("status", e.target.value)
                                    }
                                >
                                    <option value="">เลือกสถานภาพ</option>
                                    <option value="โสด">โสด</option>
                                    <option value="แต่งงาน">แต่งงาน</option>
                                    <option value="หย่าร้าง">หย่าร้าง</option>
                                    <option value="หม้าย">หม้าย</option>
                                    <option value="แยกกันอยู่">แยกกันอยู่</option>
                                </select>
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">การศึกษา :</label>
                                <select
                                    className="form-select"
                                    value={formValues.education || ""}
                                    onChange={(e) =>
                                        handleChange("education", e.target.value)
                                    }
                                >
                                    <option value="">เลือกการศึกษา</option>
                                    <option value="ไม่ได้รับการศึกษา">ไม่ได้รับการศึกษา</option>
                                    <option value="ประถมศึกษา">ประถมศึกษา</option>
                                    <option value="มัธยมศึกษาตอนต้น">มัธยมศึกษาตอนต้น</option>
                                    <option value="มัธยมศึกษาตอนปลาย">มัธยมศึกษาตอนปลาย</option>
                                    <option value="ปวช.">ปวช.</option>
                                    <option value="ปวส.">ปวส.</option>
                                    <option value="ปริญญาตรี">ปริญญาตรี</option>
                                    <option value="ปริญญาโท">ปริญญาโท</option>
                                    <option value="ปริญญาเอก">ปริญญาเอก</option>

                                </select>
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">รายได้ต่อเดือน :</label>
                                <select
                                    className="form-select"
                                    value={formValues.income || ""}
                                    onChange={(e) =>
                                        handleChange("income", e.target.value)
                                    }
                                >
                                    <option value="">เลือกรายได้</option>
                                    <option value="ต่ำกว่า 10,000 บาท">ต่ำกว่า 10,000 บาท</option>
                                    <option value="10,000 - 20,000 บาท">10,000 - 20,000 บาท</option>
                                    <option value="20,001 - 30,000 บาท">20,001 - 30,000 บาท</option>
                                    <option value="30,001 - 50,000 บาท">30,001 - 50,000 บาท</option>
                                    <option value="มากกว่า 50,000 บาท">มากกว่า 50,000 บาท</option>
                                </select>
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">สิทธิ :</label>
                                <select
                                    className="form-select"
                                    value={formValues.benefit || ""}
                                    onChange={(e) =>
                                        handleChange("benefit", e.target.value)
                                    }
                                >
                                    <option value="">เลือกสิทธิ</option>
                                    <option value="บัตรทอง">บัตรทอง</option>
                                    <option value="ประกันสังคม">ประกันสังคม</option>
                                    <option value="ประกันสุขภาพ">ประกันสุขภาพเอกชน</option>
                                    <option value="สวัสดิการข้าราชการ">สวัสดิการข้าราชการ</option>
                                    <option value="กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)">กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)</option>
                                    <option value="บัตรสวัสดิการแห่งรัฐ (บัตรคนจน)">บัตรสวัสดิการแห่งรัฐ (บัตรคนจน)</option>
                                </select>
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">โรคประจำตัว :</label>
                                <textarea
                                    className="form-control mt-2"
                                    rows="2"
                                    style={{ resize: "vertical" }}
                                    value={formValues.ud || ""}
                                    onChange={(e) =>
                                        handleChange("ud", e.target.value)
                                    }
                                />
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">อุปนิสัย :</label>
                                <textarea
                                    className="form-control mt-2"
                                    rows="2"
                                    style={{ resize: "vertical" }}
                                    value={formValues.habit || ""}
                                    onChange={(e) =>
                                        handleChange("habit", e.target.value)
                                    }
                                />
                            </div>
                            <div className="m-2">
                                <label className="form-label mt-2">รายละเอียดการดูแลผู้ป่วย :</label>
                                <textarea
                                    className="form-control mt-1"
                                    rows="2"
                                    style={{ resize: "vertical" }}
                                    value={formValues.careDetails || ""}
                                    onChange={(e) =>
                                        handleChange("careDetails", e.target.value)
                                    }
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer d-flex justify-content-between">
                        <button className="btn-EditMode btn-secondary" onClick={onClose}>
                            ยกเลิก
                        </button>
                        <button className="btn-EditMode btnsave" onClick={handleSubmit}>
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherPeopleForm;
