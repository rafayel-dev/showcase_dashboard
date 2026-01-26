import { message } from "antd";


interface ToastProps {
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  warning: (content: string, duration?: number) => void;
  info: (content: string, duration?: number) => void;
  loading: (content: string, duration?: number) => ReturnType<typeof message.loading>;
}

const toast: ToastProps = {
  success: (content, duration = 3) => {
    message.success({ content, duration, key: "global-toast" });
  },
  error: (content, duration = 3) => {
    message.error({ content, duration, key: "global-toast" });
  },
  warning: (content, duration = 3) => {
    message.warning({ content, duration, key: "global-toast" });
  },
  info: (content, duration = 3) => {
    message.info({ content, duration, key: "global-toast" });
  },
  loading: (content, duration = 0) => {
    return message.loading({ content, duration, key: "global-toast" });
  },
};

export default toast;