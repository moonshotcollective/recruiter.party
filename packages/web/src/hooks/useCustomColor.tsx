import { useColorModeValue } from "@chakra-ui/react";
import { colors } from "@moonshotcollective/ui";

function useCustomColor() {
  const primaryColor = useColorModeValue(
    colors.primary[500],
    colors.primary[200]
  );
  const getOverBgColor = useColorModeValue(
    colors.neutralLighter,
    colors.neutralDarker
  );
  const accentColor = useColorModeValue(
    colors.accentLight[500],
    colors.accentDark[800]
  );
  const accentColorScheme = useColorModeValue("accentLight", "accentDark");

  return { primaryColor, getOverBgColor, accentColor, accentColorScheme };
}

export default useCustomColor;
