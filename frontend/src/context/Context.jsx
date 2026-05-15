import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const AppContext = createContext();

export default function ContextProvider({ children }) {

    const [chambres, setChambres] = useState([]);
    const [lenChambres, setLenChambres] = useState(0);
    const [loading, setLoading] = useState(true)


useEffect(() => {
    const fetchChambres = async () => {
        try {
        setLoading(true);

        const { data } = await axios.get(
            "http://localhost:3000/api/chambres/get-room"
        );

        setChambres(data.chambres);
        setLenChambres(data.count);
        } catch (err) {
        console.error("Error fetching chambres:", err);
        } finally {
        setLoading(false);
        }
    };

    fetchChambres();
    }, []);

  const value = {
    chambres,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}