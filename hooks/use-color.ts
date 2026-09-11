const colors = {
  dark: {
    bgOverlay: "#00000080",
    bg: "#000000",
    card: "#1d1d1d",
    text: "#FFFFFF",
    muted: "#E1E2E2",
    border: "#0d131a",
    inactiveColor: "#dbdbdb",
  },

  light: {
    bgOverlay: "#00000050",
    bg: "#F5F6F8",
    card: "#FFFFFF",
    text: "#172033",
    muted: "#505050",
    border: "#e0e0e0",
    inactiveColor: "#dbdbdb",
  },
};

export function useAppColors(isDark: boolean) {
  return colors[isDark ? "dark" : "light"];
}