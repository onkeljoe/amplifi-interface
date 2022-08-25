import toast, { Toaster } from "react-hot-toast";
const notify = (message: string) => toast(message);
const success = (message: string) => toast.success(message);

export default {
  notify,
  success,
  Toaster,
};
