import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
