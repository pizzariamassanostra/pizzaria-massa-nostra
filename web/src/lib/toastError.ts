import { toast } from "react-toastify";

export function toastError(error: any) {
  let message = "Erro desconhecido";
  if (error) {
    if (error?.response?.data?.errors?.[0]?.userMessage)
      message = error.response.data.errors[0].userMessage;
    else if (error?.response?.data?.errors?.[0]?.message)
      message = error.response.data.errors[0].message;
    else if (error.response?.data?.userMessage)
      message = error.response.data.userMessage;
    else if (error.response?.data?.message)
      message = error.response.data.message;
    else if (error?.response?.data?.error.userMessage)
      message = error.response.data.error.userMessage;
    else if (error.userMessage) message = error.userMessage;
    else if (error.message) message = error.message;
    else if (typeof error === "string") message = error;
  }
  toast.error(message);
}
