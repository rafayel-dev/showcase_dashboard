import React, { useState } from "react";
import { Typography } from "antd";
import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import JoditEditor from "../../components/common/JoditEditor";
import toast from "../../utils/toast";

const { Title } = Typography;

const TermsPage: React.FC = () => {
  const [content, setContent] = useState("<p>Initial terms and conditions content.</p>");

  const handleSave = () => {
    // Here you would typically save the content to your backend
    console.log("Saving content:", content);
    toast.success("Terms and Conditions updated successfully!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AppCard>
        <Title level={3}>Terms and Conditions</Title>
        <JoditEditor initialContent={content} onChange={setContent} />
        <AppButton type="primary" onClick={handleSave} style={{ marginTop: 16 }}>
          Save Changes
        </AppButton>
      </AppCard>
    </div>
  );
};

export default TermsPage;
