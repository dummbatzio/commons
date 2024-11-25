export const useFormatReproduction = (
  amountInMinutes: number,
  showMinutes?: boolean
) => {
  if (showMinutes && amountInMinutes < 60) {
    return `${amountInMinutes} Minuten`;
  }

  return `${new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 2,
  }).format(
    amountInMinutes / 60
  )} ${amountInMinutes === 60 ? "Stunde" : "Stunden"}`;
};
