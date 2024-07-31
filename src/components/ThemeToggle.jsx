import { IconButton, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useTheme } from "../ThemeContext";

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();
    const iconColor = useColorModeValue("black", "white");
    const bgColor = useColorModeValue("white", "black");
    const hoverBgColor = useColorModeValue("gray.200", "gray.600");
    const icon = isDark ? (
        <SunIcon color={iconColor} />
    ) : (
        <MoonIcon color={iconColor} />
    );
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";

    return (
        <Tooltip label={label} aria-label={label}>
            <IconButton
                aria-label="Toggle theme"
                icon={icon}
                onClick={toggleTheme}
                position="fixed"
                top="1rem"
                right="1rem"
                bg={bgColor}
                _hover={{ bg: hoverBgColor }}
                _focus={{ outline: "none" }}
            />
        </Tooltip>
    );
};

export default ThemeToggle;
