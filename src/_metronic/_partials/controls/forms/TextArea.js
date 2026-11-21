import React from "react";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors) => {
  const classes = ["form-control form-control-lg"];
  if (touched && errors) {
    classes.push("is-invalid");
  }

  if (touched && !errors) {
    classes.push("is-valid");
  }

  return classes.join(" ");
};

export function TextArea({
  field, // { name, value, onChange, onBlur }
  touched,
  errors,
  label,
  withFeedbackLabel = true,
  customFeedbackLabel,
  type = "text",
  isRequired = false,
  ...props
}) {

  return (
    <>
      {label && <label className={isRequired ? "required" : ""}>{label}</label>}
      <textarea
        type={type}
        className={getFieldCSSClasses(touched, errors)}
        {...field}
        {...props}
        rows={5}
      />
      {withFeedbackLabel && (
        <FieldFeedbackLabel
          error={errors}
          touched={touched}
          // label={label}
          // type={type}
          customFeedbackLabel={customFeedbackLabel}
        />
      )}
    </>
  );
}
