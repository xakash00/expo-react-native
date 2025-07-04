import Toast from 'react-native-toast-message';

export const showToast = {
  success: (message) => Toast.show({ type: 'success', text1: message }),
  error: (message) => Toast.show({ type: 'error', text1: message }),
  info: (message) => Toast.show({ type: 'info', text1: message }),
  hide: () => Toast.hide()
};