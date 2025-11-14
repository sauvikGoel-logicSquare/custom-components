import React from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { User, X, Save, Download, RefreshCcw } from "lucide-react";

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
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">CustomForm component</h1>

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

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">CustomButton Examples</h2>

        <div className="flex flex-wrap gap-4">
          <CustomButton text="Default Button" />

          <CustomButton
            text="With Left Icon"
            leftIcon={<User className="h-4 w-4" />}
          />

          <CustomButton
            text="With Right Icon"
            rightIcon={<Save className="h-4 w-4" />}
            variant="secondary"
          />

          <CustomButton text="Loading" loading={true} variant="outline" />

          <CustomButton text="Small Button" btnSize="sm" />

          <CustomButton text="Large Button" btnSize="lg" />

          <CustomButton text="Disabled" disabled={true} />

          {/* icon with text */}
          <CustomButton
            text="Download"
            leftIcon={<Download className="h-4 w-4" />}
            variant="ghost"
          />

          {/* only icon */}
          <CustomButton
            btnSize="icon"
            variant="ghost"
            leftIcon={<RefreshCcw className="h-4 w-4" />}
          />
        </div>

        <CustomButton
          text="Full Width Button"
          fullWidth={true}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default CustomForm;
