import React from "react";
import { Result, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface ErrorFallbackPageProps {
  status?: "403" | "404" | "500";
  title?: string;
  subTitle?: string;
}

const ErrorFallbackPage: React.FC<ErrorFallbackPageProps> = ({
  status = "404",
  title = "Page Not Found",
  subTitle = "Sorry, the page you are looking for does not exist or has been moved.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Result
        status={status}
        title={title}
        subTitle={
          <>
            <Text type="secondary">{subTitle}</Text>
          </>
        }
        extra={[
          <Button
            type="primary"
            className="bg-violet-500!"
            key="home"
            onClick={() => navigate("/")}
          >
            Go to Dashboard
          </Button>,
          <Button key="back" onClick={() => navigate(-1)}>
            Go Back
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorFallbackPage;
