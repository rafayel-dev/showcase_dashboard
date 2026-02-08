import React, { useState, useEffect } from "react";
import { Typography, Upload, Row, Col, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AppCard from "../../components/common/AppCard";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import toast from "../../utils/toast";
import { useGetAboutQuery, useUpdateAboutMutation } from "../../RTK/setting/settingApi";
import AppSpin from "../../components/common/AppSpin";
import { BASE_URL } from "@/RTK/api";

const { Title } = Typography;
const { TextArea } = Input;

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const AboutPage: React.FC = () => {
  const { data: aboutData, isLoading } = useGetAboutQuery();
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ourStory, setOurStory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);

  // New state for deferred uploads
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [teamFiles, setTeamFiles] = useState<{ [key: number]: File }>({});

  const [team, setTeam] = useState<TeamMember[]>([
    { name: "", role: "", image: "" },
    { name: "", role: "", image: "" },
    { name: "", role: "", image: "" },
    { name: "", role: "", image: "" },
  ]);

  useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title || "");
      setDescription(aboutData.description || "");
      setOurStory(aboutData.ourStory || "");
      setCoverImage(aboutData.coverImage || "");

      if (aboutData.coverImage) {
        setFileList([{
          uid: '-1',
          name: 'cover.png',
          status: 'done',
          url: aboutData.coverImage.startsWith('http') ? aboutData.coverImage : `${BASE_URL}${aboutData.coverImage}`
        }]);
      }

      if (aboutData.team && aboutData.team.length > 0) {
        // Map to ensure shape
        const loadedTeam = aboutData.team.map((t: any) => ({
          name: t.name || "",
          role: t.role || "",
          image: t.image || ""
        }));
        // Ensure at least 4 slots if we want grid
        while (loadedTeam.length < 4) {
          loadedTeam.push({ name: "", role: "", image: "" });
        }
        setTeam(loadedTeam);
      }
    }
  }, [aboutData]);

  // Helper to upload a single file
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.filePath || data.image || null;
    } catch (error) {
      console.error("Upload failed", error);
      return null;
    }
  };

  const handleUploadCover = (options: any) => {
    const { file, onSuccess } = options;
    const previewUrl = URL.createObjectURL(file);
    setCoverImage(previewUrl);
    setCoverFile(file);
    setFileList([{ uid: file.uid, name: file.name, status: 'done', url: previewUrl }]);
    onSuccess("Ok");
  };

  const handleTeamMemberImageUpload = (index: number, file: any) => {
    const previewUrl = URL.createObjectURL(file);
    handleTeamChange(index, 'image', previewUrl);
    setTeamFiles(prev => ({ ...prev, [index]: file }));
    return false;
  };

  const handleSave = async () => {
    try {
      let finalCoverImage = coverImage;

      // Upload cover image if changed
      if (coverFile) {
        const uploadedUrl = await uploadFile(coverFile);
        if (uploadedUrl) {
          finalCoverImage = uploadedUrl;
        } else {
          toast.error("Failed to upload cover image");
          return;
        }
      }

      // Upload team images if changed
      const finalTeam = await Promise.all(team.map(async (member, index) => {
        let memberImage = member.image;
        if (teamFiles[index]) {
          const uploadedUrl = await uploadFile(teamFiles[index]);
          if (uploadedUrl) {
            memberImage = uploadedUrl;
          } else {
            toast.error(`Failed to upload image for ${member.name || 'team member'}`);
          }
        }
        return {
          ...member,
          image: memberImage
        };
      }));

      await updateAbout({
        title,
        description,
        ourStory,
        team: finalTeam.filter(t => t.name || t.role || t.image),
        coverImage: finalCoverImage
      }).unwrap();

      // Clear dirty files
      setCoverFile(null);
      setTeamFiles({});

      toast.success("About Us page updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleTeamChange = (index: number, field: keyof TeamMember, value: any) => {
    const newTeam = [...team];
    (newTeam[index] as any)[field] = value;
    setTeam(newTeam);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AppSpin spinning={isLoading}>
        <AppCard>
          <div className="flex justify-between items-center mb-6">
            <Title level={3} className="m-0!">About Us Settings</Title>
            <AppButton type="primary" onClick={handleSave} loading={isUpdating}>Save Changes</AppButton>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Page Title</Title>
            <AppInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. We Are Product Showcase" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Short Description</Title>
            <TextArea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your story..."
              className="rounded-lg! border-gray-300!"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Our Story</Title>
            <TextArea
              rows={4}
              value={ourStory}
              onChange={(e) => setOurStory(e.target.value)}
              placeholder="Tell your story..."
              className="rounded-lg! border-gray-300!"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Cover Image</Title>
            <Upload
              accept="image/*"
              listType="picture-card"
              fileList={fileList}
              customRequest={handleUploadCover}
              onRemove={() => { setCoverImage(""); setFileList([]); setCoverFile(null); }}
              maxCount={1}
            >
              {fileList.length < 1 && <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
            </Upload>
          </div>

          <div>
            <Title level={5}>Our Team</Title>
            <Row gutter={[16, 16]}>
              {team.map((member, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <AppCard className="h-full border border-gray-200">
                    <div className="flex justify-center mb-4">
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        customRequest={({ file }) => handleTeamMemberImageUpload(index, file)}
                      >
                        {member.image ? (
                          <div className="relative group">
                            <img
                              src={
                                member.image.startsWith('http') || member.image.startsWith('blob:')
                                  ? member.image
                                  : `${BASE_URL}${member.image}`
                              }
                              alt="Team"
                              className="w-24 h-24 rounded-full object-cover border border-gray-200"
                            />
                            <div
                              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer text-white text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTeamChange(index, 'image', "");
                                setTeamFiles(prev => {
                                  const newFiles = { ...prev };
                                  delete newFiles[index];
                                  return newFiles;
                                });
                              }}
                            >
                              Remove
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 border border-dashed border-gray-300">
                            <PlusOutlined />
                          </div>
                        )}
                      </Upload>
                    </div>
                    <AppInput
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                      style={{ marginBottom: 8 }}
                    />
                    <AppInput
                      placeholder="Role"
                      value={member.role}
                      onChange={(e) => handleTeamChange(index, "role", e.target.value)}
                    />
                  </AppCard>
                </Col>
              ))}
            </Row>
          </div>
        </AppCard>
      </AppSpin>
    </div>
  );
};

export default AboutPage;
