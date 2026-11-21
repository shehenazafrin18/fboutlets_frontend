import React from "react";
import { useField } from "formik";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

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

export function Select({
  label,
  withFeedbackLabel = false,
  customFeedbackLabel,
  children,
  errors,
  touched,
  onChange = false,
  defaultValue = "",
  options = [],
  ...props
}) {
  return (
    <>
      {label && <label>{label}</label>}
      <Select
        defaultValue={defaultValue}
        style={{
          width: "100%",
        }}
        status={errors ? "error" : null}
        onChange={onChange}
        options={options}
      />
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          erros={errors}
          touched={touched}
          label={label}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
