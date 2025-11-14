import React from "react";
import CustomInput from "./CustomInput";
import { useState } from "react";
import { User, X } from "lucide-react";

const CustomForm = () => {
  const [formFields, setFormFields] = useState({
    name: "",
  });
  const [isDirty, setIsDirty] = useState({
    name: false,
  });
  const [errors, setErrors] = useState({
    name: "",
  });

  const _onChangeFormFields = (key, value) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[key] = value;
    newIsDirty[key] = true;

    setFormFields(newFormFields);
    setIsDirty(newIsDirty);
    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _validateFormFields = ({ newFormFields, newIsDirty }) => {
    return new Promise((resolve) => {
      const newErrors = { ...errors };
      let isFormValid = true;

      Object.keys(newFormFields).forEach((key) => {
        if (newIsDirty[key]) {
          if (newFormFields[key]?.length < 3) {
            newErrors[key] = `*${key} field is required`;
            isFormValid = false;
          } else {
            newErrors[key] = "";
            newIsDirty[key] = false;
          }
        }
      });

      setErrors(newErrors);
      setIsDirty(newIsDirty);

      resolve(isFormValid);
    });
  };

  console.log({ errors, isDirty, formFields });

  return (
    <>
      <h1>CustomForm component</h1>

      <CustomInput
        label="Name"
        title="Name tite"
        placeholder="Enter your name"
        value={formFields?.name}
        onChange={(value) => _onChangeFormFields("name", value)}
        error={errors?.name}
        isDirty={isDirty?.name}
        isRequired
      />
    </>
  );
};

export default CustomForm;
