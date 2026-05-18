export const sendOtpService = async (phone) => {
  console.log(`OTP sent to ${phone}`);

  return true;
};

export const verifyOtpService = async (otp) => {
  if (otp === "1234") {
    return true;
  }

  return false;
};