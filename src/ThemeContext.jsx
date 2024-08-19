import { createContext, useContext, useState, useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

const lightTheme = extendTheme({
    styles: {
        global: {
            body: {
                bg: "white",
                color: "black",
            },
        },
    },
    colors: {
        skeleton: {
            start: "gray.100", // Light theme start color
            end: "gray.200",   // Light theme end color
        },
    },
});

const darkTheme = extendTheme({
    styles: {
        global: {
            body: {
                bg: "gray.800",
                color: "white",
            },
        },
    },
    colors: {
        skeleton: {
            start: "gray.700",
            end: "gray.600",
        },
    },
});

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(
        () => JSON.parse(localStorage.getItem("isDark")) || false
    );

    const toggleTheme = () => {
        setIsDark((prevTheme) => {
            const newTheme = !prevTheme;
            localStorage.setItem("isDark", JSON.stringify(newTheme));
            return newTheme;
        });
    };

    useEffect(() => {
        const savedTheme = JSON.parse(localStorage.getItem("isDark"));
        if (savedTheme !== null) {
            setIsDark(savedTheme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <ChakraProvider theme={isDark ? darkTheme : lightTheme}>
                {children}
            </ChakraProvider>
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useTheme = () => useContext(ThemeContext);
