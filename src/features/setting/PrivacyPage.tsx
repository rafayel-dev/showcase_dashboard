import React, { useState } from "react";
import { Typography } from "antd";
import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import JoditEditor from "../../components/common/JoditEditor";
import toast from "../../utils/toast";
import { useGetSettingQuery, useUpdateSettingMutation } from "../../RTK/setting/settingApi";

const { Title } = Typography;

const PrivacyPage: React.FC = () => {
  const { data: setting, isLoading } = useGetSettingQuery("privacy_policy");
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();
  const [content, setContent] = useState("");

  React.useEffect(() => {
    if (setting?.value) {
      setContent(setting.value);
    }
  }, [setting]);

  const handleSave = async () => {
    try {
      await updateSetting({
        key: "privacy_policy",
        value: content,
        type: "html",
      }).unwrap();
      toast.success("Privacy Policy updated successfully!");
    } catch (err) {
      toast.error("Failed to update Privacy Policy");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AppCard>
        <Title level={3}>Privacy Policy</Title>
        <JoditEditor initialContent={content} onChange={setContent} />
        <AppButton
          type="primary"
          onClick={handleSave}
          loading={isUpdating}
          style={{ marginTop: 16 }}
        >
          Save Changes
        </AppButton>
      </AppCard>
    </div>
  );
};

export default PrivacyPage;
