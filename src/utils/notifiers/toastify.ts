// ./src/utils/notifiers/toastify.ts
import { toast } from 'react-toastify';

interface INotify {
  // eslint-disable-next-line
  [key: string]: any;
}
// eslint-disable-next-line
const toastify = (message: string, type: 'error' | 'info' | 'success') => {
  // eslint-disable-next-line
  const toast_config: any = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const notifyTypes: INotify = {
    success: () => toast.success(message, toast_config),
    error: () => toast.error(message, toast_config),
    info: () => toast.info(message, toast_config),
  };

  return (notifyTypes[type] || notifyTypes.success)();
};

export default toastify;
