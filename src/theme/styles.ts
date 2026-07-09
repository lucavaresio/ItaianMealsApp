import { StyleSheet } from "react-native";
import type { Theme } from "./colors";

export function createSharedStyles(theme: Theme) {
  const { colors, spacing } = theme;

  return StyleSheet.create({
    screen: {
      flex: 1,
      padding: spacing.lg,
      gap: spacing.md,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      padding: spacing.md,
      gap: spacing.sm,
      justifyContent: "center",
      alignItems: "center",
    },
    rowCenter: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    error: {
      color: colors.error,
      fontWeight: "600",
    },
    emptyText: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 15,
      paddingHorizontal: spacing.md,
    },
    button: {
      alignSelf: "flex-start",
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg - 4,
      borderWidth: 1,
      borderRadius: 999,
      borderColor: colors.warning,
      backgroundColor: colors.warningBackground,
    },
    buttonText: {
      fontWeight: "600",
      color: colors.warningText,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm + 2,
      marginRight: spacing.xs,
    },
    favBadge: {
      paddingVertical: spacing.xs + 1,
      paddingHorizontal: spacing.sm + 2,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.accentBorder,
      backgroundColor: colors.accentBackground,
    },
    favBadgeText: {
      fontWeight: "700",
      color: colors.accent,
      fontSize: 13,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.accentBorder,
    },
    flatListContent: {
      gap: spacing.sm,
      paddingBottom: spacing.lg,
    },
    columnWrapper: {
      gap: spacing.md,
    },
    gridItem: {
      flex: 1,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm + 2,
      borderRadius: 12,
      backgroundColor: colors.surface,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    listItemThumb: {
      width: 56,
      height: 56,
      borderRadius: 10,
    },
    listTitle: {
      flex: 1,
      fontWeight: "600",
      color: colors.textPrimary,
      flexShrink: 1,
    },
  });
}

export type SharedStyles = ReturnType<typeof createSharedStyles>;