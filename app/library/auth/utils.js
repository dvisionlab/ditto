export const skipAuthorizationInterceptorUrls = [
  "auth/jwt",
  "auth/users/activation",
  "auth/users/resend_activation",
  "auth/users/reset_email",
  "auth/users/reset_email_confirm",
  "auth/users/reset_password",
  "auth/users/reset_password_confirm"
];

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
