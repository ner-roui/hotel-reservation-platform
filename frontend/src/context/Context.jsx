import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const AppContext = createContext();

export default function ContextProvider({ children }) {

    const [chambres, setChambres] = useState([]);
    const [lenChambres, setLenChambres] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [sejours, setSejours] = useState([]);
    const [reservations, setReservations] = useState([])
  
  
    
const getUserData = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:3000/api/auth/getuserdata",
      {
        withCredentials: true,
      }
    );

    console.log(data);

    setUser(data.user);
  } catch (e) {
    console.log(e);

    alert(e.response?.data?.message || e.message);
  }
};


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

const fetchSejours = async() =>{
      try{
        const {data} = await axios.get("http://localhost:3000/api/reservations/myreservation",{
          withCredentials : true
        })
        console.log(data.reservations);
        setSejours(data.reservations)
      }catch(e){
        console.error("Error fetching chambres:", err);
      }
    }
    const fetchAllReservations = async () => {
        try {
          setLoading(true);

          const { data } = await axios.get(
            "http://localhost:3000/api/reservations/getallreservations",
            {
              withCredentials: true,
            }
          );

          console.log(data.reservations);
          setReservations(data.reservations);
        } catch (err) {
          console.error("Error fetching all reservations:", err);
          setReservations([]);
        } finally {
          setLoading(false);
        }
      };


  useEffect(() => {
  const init = async () => {
    setLoading(true);

    await getUserData();
    await fetchChambres();
    await fetchSejours();
    await fetchAllReservations();

    setLoading(false);
  };

  init();
}, []);
  const value = {
    chambres,
    loading,
    setUser,
    getUserData,
    user,
    setSejours,
    sejours,
    reservations, 
    setReservations
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}