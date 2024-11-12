export const useFormatReproduction = (amountInMinutes: number) => {
  if (amountInMinutes < 60) {
    return `${amountInMinutes} Minutes`;
  }

  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountInMinutes / 60);
};
