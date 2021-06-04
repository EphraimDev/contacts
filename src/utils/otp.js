const otp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

export { otp, addMinutes };
