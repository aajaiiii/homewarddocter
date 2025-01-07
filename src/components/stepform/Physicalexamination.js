import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from 'react-hook-form';

export const Physicalexamination = ({ onDataChange }) => {
  const { control, setValue, getValues } = useFormContext();
  const [otherTexts, setOtherTexts] = useState({});

  useEffect(() => {
    const initialOtherTexts = {};
    const fieldsWithOther = [
      "moodandaffect",
      "appearanceAndBehavior",
      "eyeContact",
      "attention",
      "orientation",
      "thoughtProcess",
      "thoughtContent",
    ];
    fieldsWithOther.forEach((field) => {
      const otherValue = getValues(`${field}Other`);
      if (otherValue) {
        initialOtherTexts[field] = otherValue;
      }
    });
    setOtherTexts(initialOtherTexts);
  }, [getValues]);

  const handleCheckboxChange = (name, value, isChecked) => {
    const currentValues = getValues(name) || [];
    const updatedValues = isChecked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);
    setValue(name, updatedValues);
    onDataChange(getValues());
  };

  const handleOtherInputChange = (name, value) => {
    const currentValues = getValues(name) || [];
    const updatedValues = value
      ? [...currentValues.filter((item) => item !== otherTexts[name]), value]
      : currentValues.filter((item) => item !== otherTexts[name]);

    setOtherTexts((prev) => ({ ...prev, [name]: value }));
    setValue(name, updatedValues);
    setValue(`${name}Other`, value);
    onDataChange(getValues());
  };

  const handleInputChange = (name, value) => {
    setValue(name, value);
    onDataChange(getValues());
  };

  // Reusable field with checkboxes and an "Other" input
  const renderCheckboxGroupWithOther = (fieldName, options, label) => (
    <div className="info3 card mt-3">
      <div className="m-4">
        <label className="form-label">{label} :</label>
        <p style={{ color: "gray", marginTop: "-20px", marginBottom: "10px" }}>
          (เลือกได้มากกว่า 1 ข้อ)
        </p>
        {options.map((option) => (
          <div key={option}>
            <Controller
              name={fieldName}
              control={control}
              defaultValue={[]} // ค่าเริ่มต้นเป็น array ว่าง
              render={({ field }) => (
                <input
                  type="checkbox"
                  value={option}
                  checked={field.value.includes(option)}
                  style={{ transform: "scale(1.3)", marginLeft: "5px" }}
                  onChange={(e) => {
                    handleCheckboxChange(fieldName, option, e.target.checked);
                    field.onChange(
                      e.target.checked
                        ? [...field.value, option]
                        : field.value.filter((item) => item !== option)
                    );
                  }}
                />
              )}
            />
            <span style={{ marginLeft: "10px" }}>{option}</span>
          </div>
        ))}
        {/* Input field for 'Other' */}
        <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          <span style={{ marginLeft: "4px" }}> อื่นๆ</span>
          <Controller
            name={fieldName}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <input
                type="text"
                placeholder="กรอกคำตอบอื่นๆ"
                className="google-form-input"
                value={otherTexts[fieldName] || ""}
                onChange={(e) => {
                  handleOtherInputChange(fieldName, e.target.value);
                  field.onChange(
                    e.target.value
                      ? [
                          ...field.value.filter(
                            (item) => item !== otherTexts[fieldName]
                          ),
                          e.target.value,
                        ]
                      : field.value.filter(
                          (item) => item !== otherTexts[fieldName]
                        )
                  );
                }}
                style={{
                  borderBottom: "1px solid #4285f4",
                  outline: "none",
                  marginLeft: "30px",
                  width: "85%",
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );



  return (
    <div>
      <div className="info3 card">
        <div className="header">
          <b>Physical Examination</b>
        </div>
        <div style={{ marginLeft: '26px' }}>
          <p>การซักประวัติและการตรวจร่างกายทั่วไป</p>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className="header">
          <b>Vital Signs</b>
        </div>
        <div className='m-4'>
          <label className="form-label">Temperature ( °C) :</label><br></br>
          <div>
            <Controller
              name="temperature"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("temperature", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className='m-4'>
          <label className="form-label">Blood pressure  (mm/Hg) :</label><br></br>
          <div>
            <Controller
              name="bloodPressure"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("bloodPressure", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className='m-4'>
          <label className="form-label">Pulse (/min) :</label><br></br>
          <div>
            <Controller
              name="pulse"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("pulse", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className='m-4'>
          <label className="form-label">Respiration (/min) :</label><br></br>
          <div>
            <Controller
              name="respiratoryRate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("respiratoryRate", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className="header">
          <b>ตรวจร่างกายทั่วไป</b>
        </div>
        <div className='m-4'>
          <label className="form-label">GA (ลักษณะโดยรวม) :</label><br></br>
          <div>
            <Controller
              name="generalAppearance"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("generalAppearance", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className='m-4'>
          <label className="form-label">CVS (ระบบหัวใจ) :</label><br></br>
          <div>
            <Controller
              name="cardiovascularSystem"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("cardiovascularSystem", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className='m-4'>
          <label className="form-label">RS (ระบบหายใจ) :</label><br></br>
          <div>
            <Controller
              name="respiratorySystem"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("respiratorySystem", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className='m-4'>
          <label className="form-label">Abd (ช่องท้อง) :</label><br></br>
          <div>
            <Controller
              name="abdominal"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("abdominal", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className='m-4'>
          <label className="form-label">NS (ระบบประสาท) :</label><br></br>
          <div>
            <Controller
              name="nervousSystem"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("nervousSystem", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="info3 card mt-3">
        <div className='m-4'>
          <label className="form-label">Ext (รยางค์แขน/ขา) :</label><br></br>
          <div>
            <Controller
              name="extremities"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className="google-form-input"
                  placeholder="กรอกคำตอบ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange("extremities", e.target.value);
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>

      {renderCheckboxGroupWithOther("moodandaffect", ["Euthymia", "Depressed", "Apathetic"], "Mood and affect")}
      {renderCheckboxGroupWithOther(
        "appearanceAndBehavior",
        ["Cooperative", "Guarded", "Candid", "Defensive"],
        "Appearance and Behavior"
      )}
      {renderCheckboxGroupWithOther(
        "eyeContact",
        ["Good", "Sporadic", "Fleeting", "None"],
        "Eye contact"
      )}
      {renderCheckboxGroupWithOther(
        "attention",
        ["Adequate", "Inadequate"],
        "Attention"
      )}
      {renderCheckboxGroupWithOther(
        "orientation",
        ["Place", "Time", "Person", "Situation"],
        "Orientation"
      )}
      {renderCheckboxGroupWithOther(
        "thoughtProcess",
        ["Coherence", "Tangential", "Disorganized"],
        "Thought process"
      )}
      {renderCheckboxGroupWithOther(
        "thoughtContent",
        ["Reality", "Obsession", "Delusion"],
        "Thought content"
      )}
    </div>
  )
}
