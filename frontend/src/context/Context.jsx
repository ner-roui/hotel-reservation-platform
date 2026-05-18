import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const AppContext = createContext();

export default function ContextProvider({ children }) {

    const [chambres, setChambres] = useState([]);
    const [lenChambres, setLenChambres] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null)

    
    const getuserData = async (req, res) => {
        try {
          console.log(req.user);

          const { userId } = req.user;

          const user = await User.findById(userId);

          res.json({ user });
        } catch (e) {
          console.log(e);

          res.status(500).json({
            message: e.message,
          });
        }
      };

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
    loading,
    setUser,
    user,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}