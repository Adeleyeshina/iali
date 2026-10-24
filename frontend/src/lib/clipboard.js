import { toast } from '../context/ToastContext.jsx';

export async function copyToClipboard(text, label = 'Copied to clipboard!') {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    toast.success(label);
    return true;
  } catch {
    toast.error('Failed to copy');
    return false;
  }
}

