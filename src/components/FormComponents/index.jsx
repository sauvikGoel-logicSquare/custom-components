import React from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import CustomInputGroup from "./CustomInputGroup";
import { useState } from "react";
import {
  User,
  X,
  Save,
  Download,
  RefreshCcw,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";

const CustomForm = () => {
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [isDirty, setIsDirty] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    country: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
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
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">CustomForm component</h1>

      {/* Single Input Example */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Single Input Group</h2>

        <CustomInputGroup>
          <CustomInput
            label="Name"
            title="Name title"
            placeholder="Enter your name"
            value={formFields?.name}
            onChange={(value) => _onChangeFormFields("name", value)}
            error={errors?.name}
            isDirty={isDirty?.name}
            isRequired
          />
        </CustomInputGroup>
      </div>

      {/* CustomInputGroup - 2 Columns Example */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          CustomInputGroup - 2 Columns (Responsive)
        </h2>
        <CustomInputGroup columns={2}>
          <CustomInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formFields?.email}
            onChange={(value) => _onChangeFormFields("email", value)}
            error={errors?.email}
            leftIcon={<Mail className="h-4 w-4" />}
            isRequired
          />
          <CustomInput
            label="Phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formFields?.phone}
            onChange={(value) => _onChangeFormFields("phone", value)}
            error={errors?.phone}
            leftIcon={<Phone className="h-4 w-4" />}
          />
        </CustomInputGroup>
      </div>

      {/* CustomInputGroup - 3 Columns Example */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          CustomInputGroup - 3 Columns (Responsive)
        </h2>
        <CustomInputGroup columns={3}>
          <CustomInput
            label="City"
            placeholder="Enter city"
            value={formFields?.city}
            onChange={(value) => _onChangeFormFields("city", value)}
            error={errors?.city}
            leftIcon={<Building2 className="h-4 w-4" />}
          />
          <CustomInput
            label="State"
            placeholder="Enter state"
            value={formFields?.state}
            onChange={(value) => _onChangeFormFields("state", value)}
            error={errors?.state}
          />
          <CustomInput
            label="Zip Code"
            placeholder="Enter zip code"
            value={formFields?.zipCode}
            onChange={(value) => _onChangeFormFields("zipCode", value)}
            error={errors?.zipCode}
          />
        </CustomInputGroup>
      </div>

      {/* CustomInputGroup - Mixed Layout Example */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          CustomInputGroup - Mixed with Textarea
        </h2>
        <CustomInputGroup columns={2} gap="lg">
          <CustomInput
            label="Country"
            placeholder="Enter country"
            value={formFields?.country}
            onChange={(value) => _onChangeFormFields("country", value)}
            error={errors?.country}
            leftIcon={<MapPin className="h-4 w-4" />}
          />
          <CustomInput
            label="Address"
            type="textarea"
            placeholder="Enter your address"
            value={formFields?.address}
            onChange={(value) => _onChangeFormFields("address", value)}
            error={errors?.address}
            rows={3}
          />
        </CustomInputGroup>
      </div>

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
