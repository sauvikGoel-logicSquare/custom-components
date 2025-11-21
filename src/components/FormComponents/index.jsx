import React from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import CustomInputGroup from "./CustomInputGroup";
import CustomSpinner from "./CustomSpinner";
import CustomBadge from "./CustomBadge";
import CustomSwitch from "./CustomSwitch";
import CustomLogo from "./CustomLogo";
import CustomCard from "./CustomCard";
import CustomSelect from "./CustomSelect";
import { useState } from "react";
import {
  User,
  Save,
  Download,
  RefreshCcw,
  Mail,
  Phone,
  MapPin,
  Building2,
  Star,
  Check,
} from "lucide-react";
import InfiniteScrollDropdown from "./InfiniteScrollDropdown";
import { useRef } from "react";

const initialDropDownPayload = {
  page: 1,
  limit: 50,
};

const CustomForm = () => {
  const searchRef = useRef({ current: null });

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

  // Additional state for new components
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [switchWithLabel, setSwitchWithLabel] = useState(true);
  const [requiredSwitch, setRequiredSwitch] = useState(false);

  // Select dropdown states
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  // InfiniteScrollDropdown states
  const [dropdownPayload, setDropdownPayload] = useState(
    JSON.parse(JSON.stringify(initialDropDownPayload))
  );
  const [leads, setLeads] = useState([]);
  const [totalLeadsData, setTotalLeadsData] = useState({
    pages: 0,
    count: 0,
    overAllTotalCount: 0,
  });
  const [loading, setLoading] = useState({
    saveLoading: false,
  });

  const _manageLoading = (key, value) => {
    setLoading((prevLoading) => ({ ...prevLoading, [key]: value }));
  };

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

  const _onLeadSelect = (leadId) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    const leadData = leads?.find((each) => each?._id === leadId?.value);

    newFormFields["lead"] = leadId;

    if (leadData?.location) {
      newFormFields["location"] = {};
      if (leadData?.location?.isOther) {
        newFormFields["location"]["label"] = "Other";
        newFormFields["location"]["value"] = "Other";
        newFormFields["otherLocationCity"] = leadData?.location?.city;
        newFormFields["otherLocationState"] = leadData?.location?.state;
      } else {
        newFormFields["location"]["label"] = leadData?.location?.city;
        newFormFields["location"]["value"] = leadData?.location?.city;
      }
    }

    if (leadData?.name) {
      newFormFields["name"] =
        leadData?.name?.full ||
        leadData?.name?.first ||
        leadData?.name?.last ||
        "";
    }

    if (leadData?.email) {
      newFormFields["email"] = leadData?.email || "";
    }

    if (leadData?.phone) {
      newFormFields["phone"] = leadData?.phone || "";
    }

    if (leadData?.linkedinProfileLink) {
      newFormFields["linkedinUrl"] = leadData?.linkedinProfileLink || "";
    }

    setFormFields(newFormFields);

    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _onInputChange = async (value) => {
    try {
      // if (!value?.length) {
      //   if (
      //     actionMeta.action !== "input-backspace" ||
      //     actionMeta.action !== "menu-close"
      //   ) {
      //     return;
      //   }
      // }

      if (leads?.length === totalLeadsData?.overAllTotalCount) {
        return; // no need to fetch more if all leads are already loaded
      }

      _manageLoading("getAllLeadsLoading", true);
      let payload;

      if (!value?.length) {
        payload = JSON.parse(JSON.stringify(initialDropDownPayload));
      } else {
        payload = {
          name: value,
        };
      }

      clearTimeout(searchRef.current);

      searchRef.current = setTimeout(async () => {
        const res = await getAllLeads(payload);

        const newOptions = res?.candidate?.map((obj) => ({
          ...obj,
          label: obj?.name?.full || obj?.name?.first || obj?.name?.last || "",
          value: obj?._id,
        }));

        setLeads(newOptions || []);

        setTotalLeadsData({
          pages: Math.ceil(res?.totalCount / payload?.limit),
          count: res?.totalCount,
          overAllTotalCount: res?.overAllTotalCount,
        });

        _manageLoading("getAllLeadsLoading", false);
      }, 1000);
    } catch (err) {
      console.log({ err });
      // errorHandler(err);
      _manageLoading("getAllLeadsLoading", false);
    }
  };

  const getAllLeads = async (payload) => {
    const res = await fetch(
      "https://api-dev.smoothire.com/api/v1/find/external/user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMzI3YWNiNmFiYTYwMTA5NzhiZDFiMiIsIl9pZCI6IjVmMzI3YWNiNmFiYTYwMTA5NzhiZDFiMiIsImZ1bGxOYW1lIjoiQWxleCBTaHJtYSIsImVtYWlsIjoiYWJoaXNoZWsuc2hhcm1hK2FsZXhAbG9naWMtc3F1YXJlLmNvbSIsInBob25lIjoiNzg0Nzg2MzQ3NSIsIm9yZ2FuaXphdGlvbklkIjoiNWYzMjdhY2I2YWJhNjAxMDk3OGJkMmIwIiwib3JnYW5pemF0aW9uQ2F0ZWdvcnkiOiJhZ2VuY3kiLCJyb2xlIjoiYWRtaW4iLCJwcm9maWxlUGljVXJsIjoiaHR0cHM6Ly9zbW9vdGhpcmUtZGV2LnMzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tL291dHB1dC1vbmxpbmVwbmd0b29scy5wbmciLCJpc1JlY3J1aXRlck1hbmFnZXIiOmZhbHNlLCJpc1Nlbmlvck1hbmFnZXIiOmZhbHNlLCJkZXZpY2VJZCI6ImU4ZGMwZmM4LWJjNWEtNDkyMS1iMWI2LWE2NDllYWQyMzA0OCIsImNvdW50cnlDb2RlIjoiKzkxIiwiY3VycmVuY3kiOiJJTlIiLCJjb3VudHJ5TmFtZSI6IklOIiwiaWF0IjoxNzYyOTMzMzEyLCJleHAiOjE3NjU1MjUzMTJ9.WgONe7uA8AQw5_kp-atRmhk2Xkb-4hytwf_l8XmM7zs",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res?.json();
    return data;
  };

  const _getAllLeads = async (payload) => {
    _manageLoading("getAllLeadsLoading", true);
    try {
      let newLeads = [...leads];
      // newLeads?.push({
      //   // label: <i className="fa fa-spinner fa-spin mr-1" />,
      //   label: "Loading...",
      //   value: "loading",
      //   isDisabled: true,
      // });

      setLeads(newLeads);
      const res = await getAllLeads(payload);

      // removing the loading item added above
      // newLeads?.pop();

      // now concatenating the latest results with previous ones
      const newOptions = newLeads.concat(
        res?.candidate?.map((obj) => ({
          ...obj,
          label: obj?.name?.full || obj?.name?.first || obj?.name?.last || "",
          value: obj?._id,
        }))
      );

      setLeads(newOptions || []);

      setTotalLeadsData({
        pages: Math.ceil(res?.totalCount / payload?.limit),
        count: res?.totalCount,
        overAllTotalCount: res?.overAllTotalCount,
      });
    } catch (err) {
      console.log({ err });
      // errorHandler(err);
    } finally {
      _manageLoading("getAllLeadsLoading", false);
    }
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

      {/* CustomSpinner Examples */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">CustomSpinner Examples</h2>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <CustomSpinner />
            <span className="text-xs text-gray-500">Default</span>
          </div>

          <CustomSpinner size="sm" label="Small" />

          <CustomSpinner size="lg" label="Large" />
          <CustomSpinner size="xl" label="Extra Large" />
          <CustomSpinner label="Loading..." />
          <CustomSpinner size="lg" label="Please wait..." color="#10b981" />

          <CustomSpinner variant="dotted" label="Dotted" />
        </div>
      </div>

      {/* CustomBadge Examples */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">CustomBadge Examples</h2>
        <div className="flex flex-wrap gap-3">
          <CustomBadge text="Default" />
          <CustomBadge text="Secondary" variant="secondary" />
          <CustomBadge text="Success" variant="success" />
          <CustomBadge text="Warning" variant="warning" />
          <CustomBadge text="Destructive" variant="destructive" />
          <CustomBadge text="Outline" variant="outline" />
          <CustomBadge text="Small" variant="success" size="sm" />
          <CustomBadge text="Large" size="lg" />
          <CustomBadge
            text="With Icon"
            leftIcon={<Star className="h-3 w-3" />}
          />
          <CustomBadge
            text="With Dot"
            dot
            // dotColor="#10b981"
            leftIcon={<Check className="h-3 w-3" />}
            variant="success"
          />
          <CustomBadge
            text="Removable"
            variant="secondary"
            onRemove={() => alert("Badge removed!")}
          />
        </div>
      </div>

      {/* CustomSwitch Examples */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">CustomSwitch Examples</h2>
        <div className="space-y-4">
          <CustomSwitch
            checked={switchEnabled}
            onCheckedChange={setSwitchEnabled}
          />
          <CustomSwitch
            label="Enable notifications"
            description="Receive email notifications about your account activity"
            checked={switchWithLabel}
            onCheckedChange={setSwitchWithLabel}
          />
          <CustomSwitch
            label="Required setting"
            description="This is a required setting"
            checked={requiredSwitch}
            onCheckedChange={setRequiredSwitch}
            required
          />
          <CustomSwitch
            label="Disabled switch"
            description="This switch is currently disabled"
            disabled
          />
          <div style={{ display: "flex", gap: "16px" }}>
            <CustomSwitch
              label="Label on right"
              labelPosition="right"
              checked={true}
            />
            <CustomSwitch
              label="Label on left"
              labelPosition="left"
              checked={true}
            />
          </div>
        </div>
      </div>

      {/* CustomLogo Examples */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">CustomLogo Examples</h2>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <CustomLogo
              size="sm"
              alt="Small Logo"
              src="https://avatar.iran.liara.run/public/90"
            />
            <span className="text-xs text-gray-500">Small (40x40)</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <CustomLogo alt="Default Logo" />
            <span className="text-xs text-gray-500">Default (100x100)</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <CustomLogo size="lg" alt="Large Logo" />
            <span className="text-xs text-gray-500">Large (150x150)</span>
          </div>

          <CustomLogo
            src="https://avatar.iran.liara.run/public/20"
            alt="Custom Logo"
          />

          <div className="flex flex-col items-center gap-2">
            <CustomLogo
              src="invalid-url.jpg"
              fallbackSrc="https://avatar.iran.liara.run/public/71"
              alt="With Fallback"
            />
            <span className="text-xs text-gray-500">With Fallback</span>
          </div>
        </div>
      </div>

      {/* CustomCard Examples */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">CustomCard Examples</h2>

        <div className="flex gap-4 flex-wrap">
          {/* Info Card - matching the design shown */}
          <CustomCard
            title="Basic Info"
            headerBgColor="#EEF2FF"
            footer={
              <div className="flex gap-2">
                <CustomButton text="Cancel" variant="outline" />
                <CustomButton text="Save" variant="default" />
              </div>
            }
            className="flex-1"
            onClick={() => alert("Card clicked!")}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}
            >
              {/* Email Row */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#94a3b8",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  EMAIL ID
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <a
                    href="mailto:kiran+111@logic-square.com"
                    style={{
                      fontSize: "16px",
                      color: "#0f172a",
                      textDecoration: "underline",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    kiran+111@logic-square.com
                  </a>
                  <a
                    href="mailto:kiran+111@logic-square.com"
                    style={{
                      fontSize: "16px",
                      color: "#0f172a",
                      textDecoration: "underline",
                      fontWeight: "500",
                    }}
                  >
                    Send Email
                  </a>
                </div>
              </div>

              {/* Phone and Job Title Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    PHONE NUMBER
                  </div>
                  <div style={{ fontSize: "16px", color: "#0f172a" }}>
                    (+91) 9876567689
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    JOB TITLE
                  </div>
                  <div style={{ fontSize: "16px", color: "#0f172a" }}>
                    Not Provided
                  </div>
                </div>
              </div>

              {/* Location and Daily Export Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    LOCATION
                  </div>
                  <div style={{ fontSize: "16px", color: "#0f172a" }}>
                    Kolkata
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    DAILY EXPORT LIMIT LEFT
                  </div>
                  <div style={{ fontSize: "16px", color: "#0f172a" }}>50</div>
                </div>
              </div>
            </div>
          </CustomCard>

          <CustomCard
            title="Basic Info"
            headerBgColor="#EEF2FF"
            footer={
              <div className="flex gap-2">
                <CustomButton text="Cancel" variant="outline" />
                <CustomButton text="Save" variant="default" />
              </div>
            }
            className="flex-1"
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}
            >
              {/* Email Row */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#94a3b8",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  EMAIL ID
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <a
                    href="mailto:kiran+111@logic-square.com"
                    style={{
                      fontSize: "16px",
                      color: "#0f172a",
                      textDecoration: "underline",
                    }}
                  >
                    kiran+111@logic-square.com
                  </a>
                  <a
                    href="mailto:kiran+111@logic-square.com"
                    style={{
                      fontSize: "16px",
                      color: "#0f172a",
                      textDecoration: "underline",
                      fontWeight: "500",
                    }}
                  >
                    Send Email
                  </a>
                </div>
              </div>

              {/* Phone and Job Title Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    PHONE NUMBER
                  </div>
                  <div style={{ fontSize: "16px", color: "#0f172a" }}>
                    (+91) 9876567689
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    JOB TITLE
                  </div>
                  <div style={{ fontSize: "16px", color: "#0f172a" }}>
                    Not Provided
                  </div>
                </div>
              </div>

              {/* Location and Daily Export Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    LOCATION
                  </div>
                  <div style={{ fontSize: "16px", color: "#0f172a" }}>
                    Kolkata
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    DAILY EXPORT LIMIT LEFT
                  </div>
                  <div style={{ fontSize: "16px", color: "#0f172a" }}>50</div>
                </div>
              </div>
            </div>
          </CustomCard>
        </div>
      </div>

      {/* CustomSelect Examples */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">CustomSelect Examples</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic select */}
          <div>
            <CustomSelect
              label="Country"
              options={[
                "United States",
                "United Kingdom",
                "Canada",
                "Australia",
                "Germany",
              ]}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder="Select a country"
            />
            {selectedCountry && (
              <p
                style={{ marginTop: "8px", fontSize: "13px", color: "#64748b" }}
              >
                Selected: {selectedCountry}
              </p>
            )}
          </div>

          {/* Searchable select */}
          <div>
            <CustomSelect
              label="Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending", label: "Pending" },
                { value: "archived", label: "Archived" },
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Select status"
              isSearchable
              helperText="Searchable dropdown"
            />
          </div>

          {/* Searchable + Clearable */}
          <div>
            <CustomSelect
              label="Department"
              options={[
                { value: "engineering", label: "Engineering" },
                { value: "marketing", label: "Marketing" },
                { value: "sales", label: "Sales" },
                { value: "hr", label: "Human Resources" },
              ]}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Select department"
              required
              isSearchable
              isClearable
              error={!selectedDepartment ? "Department is required" : ""}
              helperText="Searchable with clear button"
            />
          </div>

          {/* Multi-select */}
          <div>
            <CustomSelect
              label="Skills"
              options={[
                { value: "javascript", label: "JavaScript" },
                { value: "react", label: "React" },
                { value: "nodejs", label: "Node.js" },
                { value: "python", label: "Python" },
                { value: "java", label: "Java" },
                { value: "typescript", label: "TypeScript" },
              ]}
              value={selectedSkills}
              onChange={setSelectedSkills}
              placeholder="Select skills"
              isMulti
              helperText="Multi-select dropdown"
            />
            {selectedSkills.length > 0 && (
              <p
                style={{ marginTop: "8px", fontSize: "13px", color: "#64748b" }}
              >
                Selected: {selectedSkills.join(", ")}
              </p>
            )}
          </div>

          {/* Multi-select + Searchable + Clearable */}
          <div>
            <CustomSelect
              label="Languages"
              options={[
                "English",
                "Spanish",
                "French",
                "German",
                "Chinese",
                "Japanese",
                "Korean",
                "Arabic",
              ]}
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              placeholder="Select languages"
              isMulti
              isSearchable
              isClearable
              helperText="Multi-select with search and clear"
            />
          </div>

          {/* Small size with search */}
          <div>
            <CustomSelect
              label="Priority"
              size="sm"
              options={["Low", "Medium", "High", "Critical"]}
              placeholder="Select priority"
              isSearchable
              isClearable
            />
          </div>

          {/* Large size with search */}
          <div>
            <CustomSelect
              label="Category"
              size="defausdslt"
              options={[
                { value: "tech", label: "Technology" },
                { value: "business", label: "Business" },
                { value: "design", label: "Design" },
              ]}
              placeholder="Select category"
              isSearchable
            />
          </div>

          {/* Disabled select */}
          <div>
            <CustomSelect
              label="Region"
              options={["North", "South", "East", "West"]}
              disabled
              value="North"
              placeholder="Select region"
            />
          </div>
        </div>

        {/* Full width searchable multi-select */}
        <div>
          <CustomSelect
            label="Projects"
            options={[
              { value: "project1", label: "Website Redesign" },
              { value: "project2", label: "Mobile App Development" },
              { value: "project3", label: "API Integration" },
              { value: "project4", label: "Database Migration" },
              { value: "project5", label: "Security Audit" },
              { value: "project6", label: "Cloud Migration" },
              { value: "project7", label: "Performance Optimization" },
            ]}
            placeholder="Select projects"
            isMulti
            isSearchable
            isClearable
            helperText="Search and select multiple projects"
          />
        </div>
      </div>

      {/* InfiniteScrollDropdown Examples */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">
          InfiniteScrollDropdown Examples
        </h2>
        <h3 className="text-lg font-semibold">Existing Leads</h3>
        <InfiniteScrollDropdown
          isClearable={true}
          optionsConfig={leads}
          onChangeFunc={(value) => _onLeadSelect(value)}
          onInputChange={(value, actionMeta) =>
            _onInputChange(value, actionMeta)
          }
          value={formFields?.lead}
          totalDataCount={totalLeadsData?.count}
          totalDataPages={totalLeadsData?.pages}
          updateOptionsConfig={(payload) => _getAllLeads(payload)}
          dropdownPayload={dropdownPayload}
          setDropdownPayload={(newDropDownPayload) =>
            setDropdownPayload(newDropDownPayload)
          }
          isLoading={loading?.getAllLeadsLoading}
        />
      </div>
    </div>
  );
};

export default CustomForm;
