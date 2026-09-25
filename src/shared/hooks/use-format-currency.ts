import { useSettingsStore } from "@/features/settings/store";

export const useFormatCurrency = () => {
  const { privacyModeEnabled } = useSettingsStore();

  const formatCurrency = (
    amount: number,
    currency: string = "KES",
    showSign: boolean = false,
  ) => {
    if (privacyModeEnabled) {
      return "***";
    }

    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      signDisplay: showSign ? "always" : "auto",
    }).format(amount);
  };

  return formatCurrency;
};
