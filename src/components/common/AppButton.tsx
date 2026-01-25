import React from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";

const AppButton: React.FC<ButtonProps> = ({ className, type, ...props }) => {
  const isPrimary = type === "primary";

  // Base classes for primary button to enforce the violet theme
  const primaryClasses = isPrimary
    ? "bg-violet-500! hover:bg-violet-600! border-violet-500! text-white!"
    : "";

  return (
    <Button
      type={type}
      className={`${primaryClasses} ${className || ""}`}
      {...props}
    />
  );
};

export default AppButton;
