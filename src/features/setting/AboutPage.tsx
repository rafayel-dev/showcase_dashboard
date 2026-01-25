import React, { useState } from "react";
import { Typography, Upload, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import JoditEditor from "../../components/common/JoditEditor";
import toast from "../../utils/toast";

const { Title } = Typography;

interface TeamMember {
  name: string;
  title: string;
  image: any;
}

const AboutPage: React.FC = () => {
  const [content, setContent] = useState("<p>Initial about us content.</p>");
  const [team, setTeam] = useState<TeamMember[]>([
    { name: "", title: "", image: null },
    { name: "", title: "", image: null },
    { name: "", title: "", image: null },
    { name: "", title: "", image: null },
  ]);

  const handleSave = () => {
    console.log("Saving content:", content);
    console.log("Saving team:", team);
    toast.success("About Us page updated successfully!");
  };

  const handleTeamChange = (
    index: number,
    field: keyof TeamMember,
    value: any,
  ) => {
    const newTeam = [...team];
    (newTeam[index] as any)[field] = value;
    setTeam(newTeam);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AppCard>
        <Title level={3}>About Us</Title>

        <div style={{ marginBottom: 24 }}>
          <Title level={5}>Cover Image</Title>
          <Upload type="select" maxCount={1}>
            <AppButton icon={<UploadOutlined />}>Upload Image</AppButton>
          </Upload>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Title level={5}>Description</Title>
          <JoditEditor initialContent={content} onChange={setContent} />
        </div>

        <div>
          <Title level={5}>Our Team</Title>
          <Row gutter={16}>
            {team.map((member, index) => (
              <Col span={6} key={index}>
                <AppCard>
                  <Upload maxCount={1} style={{ marginBottom: 8 }}>
                    <AppButton icon={<UploadOutlined />}>
                      Upload Image
                    </AppButton>
                  </Upload>
                  <AppInput
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) =>
                      handleTeamChange(index, "name", e.target.value)
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <AppInput
                    placeholder="Title"
                    value={member.title}
                    onChange={(e) =>
                      handleTeamChange(index, "title", e.target.value)
                    }
                  />
                </AppCard>
              </Col>
            ))}
          </Row>
        </div>

        <AppButton
          type="primary"
          onClick={handleSave}
          style={{ marginTop: 16 }}
        >
          Save Changes
        </AppButton>
      </AppCard>
    </div>
  );
};

export default AboutPage;
