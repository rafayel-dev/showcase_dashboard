import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
import JoditEditor from "../../components/common/JoditEditor";
import toast from "../../../utils/toast";

const { Title } = Typography;

const PrivacyPage: React.FC = () => {
  const [content, setContent] = useState("<p>Initial privacy policy content.</p>");

  const handleSave = () => {
    // Here you would typically save the content to your backend
    console.log("Saving content:", content);
    toast.success("Privacy Policy updated successfully!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="rounded-2xl">
        <Title level={3}>Privacy Policy</Title>
        <JoditEditor initialContent={content} onChange={setContent} />
        <Button type="primary" onClick={handleSave} style={{ marginTop: 16 }} className="bg-violet-500!">
          Save Changes
        </Button>
      </Card>
    </div>
  );
};

export default PrivacyPage;
