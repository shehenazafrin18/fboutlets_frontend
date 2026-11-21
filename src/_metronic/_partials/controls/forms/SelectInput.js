import React from "react";
import { useField } from "formik";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";
import { Select, Space } from "antd";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control"];
  if (touched && errors) {
    classes.push("is-invalid-select");
  }

  if (touched && !errors) {
    classes.push("is-valid-select");
  }

  return classes.join(" ");
};

export function SelectInput({
  label,
  withFeedbackLabel = false,
  customFeedbackLabel,
  children,
  errors,
  touched,
  onChange = false,
  isRequired = false,
  defaultValue = "",
  value = "",
  options = [],
  showSearch = true,
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label className={isRequired ? "required" : ""}>{label}</label>}
      <Select
        defaultValue={defaultValue}
        style={{
          width: "100%",
          height: "42px",
        }}
        status={errors ? "error" : null}
        onChange={onChange}
        options={options}
        value={value}
        showSearch={showSearch}
        filterOption={(inputValue, option) =>
          option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          erros={errors}
          touched={touched}
          label={label}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </div>
  );
}
