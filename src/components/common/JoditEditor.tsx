import React, { useRef } from "react";
import JoditEditor from "jodit-react";

/* ================= JODIT CONFIG ================= */
export const joditConfig = {
  readonly: false,
  height: "400px",
  buttons:
    "bold,italic,underline,|,align,|,link,|,fontsize,paragraph",
  buttonsMD:
    "bold,italic,underline,|,align,|,link,|,fontsize,paragraph",
  buttonsSM:
    "bold,italic,underline,|,align,|,link,|,fontsize,paragraph",
  buttonsXS:
    "bold,italic,underline,|,align,|,link,|,fontsize,paragraph",
  placeholder: "",
};

/* ================= PROPS TYPE ================= */
interface CustomJoditEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

/* ================= COMPONENT ================= */
const CustomJoditEditor: React.FC<CustomJoditEditorProps> = ({
  initialContent = "",
  onChange,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useRef<any>(null);

  return (
    <JoditEditor
      ref={editor}
      value={initialContent}
      config={joditConfig}
      onBlur={(newContent: string) => onChange(newContent)}
      onChange={() => { }}
    />
  );
};

export default CustomJoditEditor;
