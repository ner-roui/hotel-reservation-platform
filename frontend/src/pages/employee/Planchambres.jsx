import { useContext, useState , useEffect} from "react";
import { AppContext } from "../../context/Context";

/* ── data ── */
const floorsData = [
  {
    floor: 1,
    rooms: [
      { id: 101, type: "Standard", size: "24 m²", status: "available" },
      { id: 102, type: "Standard", size: "24 m²", status: "occupied" },
    ],
  },
  {
    floor: 2,
    rooms: [
      { id: 201, type: "Deluxe", size: "32 m²", status: "cleaning" },
      { id: 202, type: "Deluxe", size: "32 m²", status: "available" },
    ],
  },
  {
    floor: 3,
    rooms: [
      { id: 301, type: "Standard", size: "24 m²", status: "occupied" },
    ],
  },
  {
    floor: 4,
    rooms: [
      { id: 402, type: "Suite", size: "58 m²", status: "available" },
    ],
  },
  {
    floor: 5,
    rooms: [
      { id: 501, type: "Présidentielle", size: "90 m²", status: "available" },
    ],
  },
];

/* ── status config ── */
const STATUS = {
  "Disponible": {
    label: "Disponible",
    short: "DISP",
    dot: "bg-emerald-400",
    card: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
    num: "text-emerald-600",
    sub: "text-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  "Occupée": {
    label: "Occupée",
    short: "OCC",
    dot: "bg-blue-400",
    card: "bg-blue-50 border-blue-200 hover:border-blue-400",
    num: "text-blue-600",
    sub: "text-blue-400",
    badge: "bg-blue-100 text-blue-700",
  },
    "À nettoyer" : {
    label: "À nettoyer",
    short: "NETT",
    dot: "bg-amber-400",
    card: "bg-amber-50 border-amber-200 hover:border-amber-400",
    num: "text-amber-600",
    sub: "text-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
};

/* ── icons ── */
const IconSearch = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const IconBell = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3H15" />
  </svg>
);
const IconDoor = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);
const IconClose = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ── Sidebar NavItem ── */
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
      active ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`}>
    {icon}{label}
  </button>
);

/* ── RolePill ── */
const RolePill = ({ label, icon, active, onClick }) => (
  <button onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
      active ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"
    }`}>
    {icon}{label}
  </button>
);

/* ── Room card ── */
const RoomCard = ({ room, onClick }) => {
  console.log('roommaa', room);
  const s = STATUS[room.statut];
  return (
    <button onClick={() => onClick(room)}
      className={`relative w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-sm hover:shadow-md ${s.card}`}>
      <span className={`text-2xl font-bold tracking-tight ${s.num}`}>{room.id}</span>
      <span className={`text-[10px] font-semibold tracking-widest uppercase ${s.sub}`}>{s.short}</span>
    </button>
  );
};

/* ── Detail modal ── */
const RoomModal = ({ room, onClose, onStatusChange }) => {
  if (!room) return null;
  const s = STATUS[room.statut];
  const otherStatuses = Object.keys(STATUS).filter((k) => k !== room.status);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.badge}`}>
              <IconDoor />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Chambre {room.id}</h2>
              <p className="text-sm text-gray-400">{room.type} · {room.size}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <IconClose />
          </button>
        </div>

        {/* current status */}
        <div className="flex items-center gap-2 mb-5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${s.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <span className="text-xs text-gray-400">Étage {Math.floor(room.id / 100)}</span>
        </div>

        {/* change status */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Changer le statut</p>
        <div className="flex flex-col gap-2">
          {otherStatuses.map((key) => {
            const cfg = STATUS[key];
            return (
              <button key={key} onClick={() => { onStatusChange(room.id, key); onClose(); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-sm ${cfg.card}`}>
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className={cfg.num}>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════ */
export default function PlanChambres() {
  // const [floors, setFloors] = useState(floorsData);
  const [floors, setFloors] = useState([]);
  const {chambres} = useContext(AppContext)
  const [activeNav, setActiveNav] = useState("rooms");
  const [activeRole, setActiveRole] = useState("reception");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  console.log('les chambres', chambres)

  useEffect(() => {
    if (chambres?.length) {
      const grouped = groupRoomsByFloor(chambres);
      setFloors(grouped);
    }
  }, [chambres]);

  const groupRoomsByFloor = (rooms) => {
    const grouped = rooms.reduce((acc, room) => {
      const floor = room.etage;

      if (!acc[floor]) {
        acc[floor] = [];
      }

      acc[floor].push({
        id: room.numero,
        type: room.type,
        size: room.superficie,
        statut: room.statut,
        _id: room._id,
      });

      return acc;
    }, {});

  return Object.keys(grouped).map((floor) => ({
    floor: Number(floor),
    rooms: grouped[floor],
  }));
};

  const handleStatusChange = (roomId, newStatus) => {
    setFloors((prev) =>
      prev.map((f) => ({
        ...f,
        rooms: f.rooms.map((r) => r.id === roomId ? { ...r, status: newStatus } : r),
      }))
    );
  };


  const totalRooms = floors.reduce((acc, f) => acc + f.rooms.length, 0);
  const counts = {
    available: floors?.flatMap((f) => f.rooms).filter((r) => r.status === "available").length,
    occupied: floors?.flatMap((f) => f.rooms).filter((r) => r.status === "occupied").length,
    cleaning: floors?.flatMap((f) => f.rooms).filter((r) => r.status === "cleaning").length,
  };

  const navIcon = (d) => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <IconSearch />
            <input type="text" placeholder="Rechercher chambres, clients, réservations…"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconBell />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Page header */}
          <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Plan des chambres</h1>
              <p className="text-sm text-gray-400 mt-0.5">Vue temps réel par étage. {totalRooms} chambres au total.</p>
            </div>

            {/* Legend / filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(STATUS).map(([key, cfg]) => (
                <button key={key} onClick={() => setFilterStatus(filterStatus === key ? null : key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    filterStatus === key
                      ? `${cfg.badge} border-transparent shadow-sm`
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                  <span className="ml-0.5 font-bold">{counts[key]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Floors */}
          <div className="space-y-4">
            {floors.map((f) => {
              const visibleRooms = filterStatus
                ? f.rooms.filter((r) => r.status === filterStatus)
                : f.rooms;
              if (visibleRooms.length === 0) return null;

              return (
                <div key={f.floor} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500">{f.floor}</span>
                      </div>
                      <h2 className="text-sm font-semibold text-gray-700">Étage {f.floor}</h2>
                    </div>
                    <span className="text-xs text-gray-400">{visibleRooms.length} chambre{visibleRooms.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {visibleRooms.map((room) => (
                      <RoomCard key={room.id} room={room} onClick={setSelectedRoom} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── Room detail modal ── */}
      <RoomModal room={selectedRoom} onClose={() => setSelectedRoom(null)} onStatusChange={handleStatusChange} />
    </div>
  );
}