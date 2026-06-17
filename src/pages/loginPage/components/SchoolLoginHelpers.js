// دالة فك تشفير التوكن بأمان وتجنب خطأ atob
export const parseJwtSafely = (token) => {
  try {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) { 
        base64 += "="; 
    }
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error("Error reading token safely", e);
    return null;
  }
};