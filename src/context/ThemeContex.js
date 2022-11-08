import { createContext, useReducer } from "react";

export const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_THEME":
      return { ...state, darkMode: action.payload };
    default:
      return state;
  }
};

export function ThemeProvider({ children }) {
  const localTheme = localStorage.getItem("darkMode");
  const localThemeBoolean = localTheme === "true";
  const [state, dispatch] = useReducer(themeReducer, {
    darkMode: localThemeBoolean,
  });

  const changeMode = (darkMode) => {
    localStorage.setItem("darkMode", darkMode);
    dispatch({ type: "CHANGE_THEME", payload: darkMode });
  };

  return (
    <ThemeContext.Provider value={{ ...state, changeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
