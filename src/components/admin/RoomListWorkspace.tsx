"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BedSingle,
  Building2,
  ChevronDown,
  ChevronRight,
  DoorOpen,
  Edit3,
  Hotel,
  Plus,
  UserPlus,
  AlertCircle,
  X,
  ArrowRightLeft,
  Check,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  ROOM_CAPACITIES,
  type RoomCity,
  type RoomType,
} from "@/lib/management/domain";
import { assignRoomAction, renameRoomAction } from "@/lib/management/actions";
import { AdminPageHeader } from "./AdminUi";
import type { getManagementContext } from "@/lib/management/data";

type Context = Awaited<ReturnType<typeof getManagementContext>>;
type RegistrationItem = Context["registrations"][number];

export function RoomListWorkspace({ data }: { data: Context }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeGender, setActiveGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [activeCity, setActiveCity] = useState<RoomCity>("makkah");
  const [selectedDepartureId, setSelectedDepartureId] = useState<string>("");
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});

  // Modals state
  const [renameModal, setRenameModal] = useState<{
    currentRoomNumber: string;
    city: RoomCity;
    departureId?: string;
  } | null>(null);

  const [assignModal, setAssignModal] = useState<{
    targetRoomNumber: string;
    targetRoomType: RoomType;
    departureId?: string;
  } | null>(null);

  const [moveModal, setMoveModal] = useState<{
    registration: RegistrationItem;
    currentRoomNumber: string;
  } | null>(null);

  // Filter registrations with valid genders & optional departure filter
  const genderRegistrations = useMemo(() => {
    return data.registrations.filter((item) => {
      if (item.pilgrim?.gender !== activeGender) return false;
      if (item.status !== "active") return false;
      if (selectedDepartureId && item.departure?.id !== selectedDepartureId) return false;
      return true;
    });
  }, [data.registrations, activeGender, selectedDepartureId]);

  // Find accommodation hotel name for departure if available
  const hotelsByDepartureAndCity = useMemo(() => {
    const map = new Map<string, string>();
    if (data.accommodations) {
      for (const acc of data.accommodations) {
        const cityKey = acc.city.toLowerCase().includes("madinah") ? "madinah" : "makkah";
        map.set(`${acc.departureId}-${cityKey}`, acc.hotelName);
      }
    }
    return map;
  }, [data.accommodations]);

  // Build room grouping for the current gender and city
  const { rooms, unassigned } = useMemo(() => {
    const roomMap = new Map<
      string,
      {
        roomNumber: string;
        roomType: RoomType;
        departureId?: string;
        departureName: string;
        hotelName: string;
        occupants: RegistrationItem[];
      }
    >();

    const unassignedList: RegistrationItem[] = [];

    for (const item of genderRegistrations) {
      const departureId = item.booking?.departureId ?? "default";
      const depHotel = hotelsByDepartureAndCity.get(`${departureId}-${activeCity}`) || (activeCity === "makkah" ? "Hotel Pullman Zamzam" : "Hotel Arkan Almanar");
      const chosenRoomType = (item.roomType?.toLowerCase() as RoomType) || "quad";

      // Room number depends on city
      const roomNum = activeCity === "madinah"
        ? (item.madinahRoomNumber || "").trim()
        : (item.makkahRoomNumber || item.roomNumber || "").trim();

      // If already assigned
      if (roomNum) {
        if (!roomMap.has(roomNum)) {
          roomMap.set(roomNum, {
            roomNumber: roomNum,
            roomType: chosenRoomType,
            departureId: item.booking?.departureId,
            departureName: item.package?.name ?? "Paket Umroh",
            hotelName: depHotel,
            occupants: [],
          });
        }
        roomMap.get(roomNum)!.occupants.push(item);
      } else {
        unassignedList.push(item);
      }
    }

    return {
      rooms: Array.from(roomMap.values()).sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)),
      unassigned: unassignedList,
    };
  }, [genderRegistrations, activeCity, hotelsByDepartureAndCity]);

  // Rooms that have available slots in current city and gender
  const availableRoomsWithSlots = useMemo(() => {
    return rooms.filter((r) => {
      const cap = ROOM_CAPACITIES[r.roomType] || 4;
      return r.occupants.length < cap;
    });
  }, [rooms]);

  // Count totals for badges
  const totalMen = useMemo(() => data.registrations.filter((r) => r.pilgrim?.gender === "Laki-laki" && r.status === "active").length, [data.registrations]);
  const totalWomen = useMemo(() => data.registrations.filter((r) => r.pilgrim?.gender === "Perempuan" && r.status === "active").length, [data.registrations]);
  const ungendered = useMemo(() => data.registrations.filter((r) => !r.pilgrim?.gender && r.status === "active"), [data.registrations]);

  function toggleRoom(roomNumber: string) {
    setExpandedRooms((prev) => ({
      ...prev,
      [roomNumber]: prev[roomNumber] === undefined ? false : !prev[roomNumber],
    }));
  }

  function isExpanded(roomNumber: string) {
    return expandedRooms[roomNumber] ?? true; // Default open for easy visibility
  }

  // Handle direct rename room
  async function handleRenameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await renameRoomAction(fd);
      if (res.ok) {
        toast.success(res.message);
        setRenameModal(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  // Handle quick slot assignment (unassigned pilgrim -> room)
  async function handleAssignSlot(registrationId: string) {
    if (!assignModal) return;
    const fd = new FormData();
    fd.set("registrationId", registrationId);
    fd.set("city", activeCity);
    fd.set("roomType", assignModal.targetRoomType);
    fd.set("roomNumber", assignModal.targetRoomNumber);

    startTransition(async () => {
      const res = await assignRoomAction({ ok: false, message: "" }, fd);
      if (res.ok) {
        toast.success(res.message);
        setAssignModal(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  // Handle move pilgrim to existing or new room
  async function handleMoveSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!moveModal) return;
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await assignRoomAction({ ok: false, message: "" }, fd);
      if (res.ok) {
        toast.success(res.message);
        setMoveModal(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="roomlist-elder-container">
      <AdminPageHeader
        eyebrow="OPERASIONAL KAMAR & MANIFEST"
        title="Manifest & Room List"
        description="Susun kamar Quad (4 orang), Triple (3 orang), atau Double (2 orang). Tampilan besar, rapi, dan terpisah per Hotel Makkah & Madinah."
        action={
          data.registrations.length
            ? { href: "/admin/manajemen/manifest-room-list/baru", label: "+ Atur Kamar Jamaah" }
            : undefined
        }
      />

      {ungendered.length > 0 && (
        <div className="management-warning" style={{ marginBlock: "0 20px" }}>
          <AlertCircle className="size-5 text-amber-600" />
          <span>
            <strong>Perhatian:</strong> Ada {ungendered.length} jamaah yang belum diisi jenis kelaminnya di data profil. Mohon lengkapi jenis kelamin agar dapat dimasukkan ke kamar.
          </span>
        </div>
      )}

      {/* 1. TINGKAT PERTAMA: PILIH GENDER DENGAN TOMBOL BESAR & JELAS */}
      <section className="roomlist-gender-selector">
        <button
          type="button"
          onClick={() => setActiveGender("Laki-laki")}
          className={`roomlist-gender-btn ${activeGender === "Laki-laki" ? "active" : ""}`}
        >
          <div className="gender-btn-icon">
            <User className="size-6 text-sky-800" />
          </div>
          <div className="gender-btn-text">
            <strong>Jamaah Laki-laki</strong>
            <small>{totalMen} orang terdaftar</small>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveGender("Perempuan")}
          className={`roomlist-gender-btn ${activeGender === "Perempuan" ? "active" : ""}`}
        >
          <div className="gender-btn-icon">
            <Users className="size-6 text-emerald-800" />
          </div>
          <div className="gender-btn-text">
            <strong>Jamaah Perempuan</strong>
            <small>{totalWomen} orang terdaftar</small>
          </div>
        </button>
      </section>

      {/* 2. TINGKAT KEDUA: PILIH JADWAL KEBERANGKATAN & LOKASI HOTEL */}
      <section className="roomlist-city-selector">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "700", color: "#173251", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Jadwal:</span>
              <select
                value={selectedDepartureId}
                onChange={(e) => setSelectedDepartureId(e.target.value)}
                style={{ minHeight: "40px", padding: "6px 12px", borderRadius: "8px", border: "1px solid #c8d3e0", background: "#fff", color: "#102a4c", fontWeight: "600", fontSize: "13px" }}
              >
                <option value="">Semua Keberangkatan</option>
                {data.departures.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.dateLabel} ({dep.package?.name ?? "Umrah"})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="roomlist-city-pills">
            <button
              type="button"
              onClick={() => setActiveCity("makkah")}
              className={`roomlist-city-pill ${activeCity === "makkah" ? "active" : ""}`}
            >
              <Hotel className="size-5" />
              <span>Hotel Makkah</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCity("madinah")}
              className={`roomlist-city-pill ${activeCity === "madinah" ? "active" : ""}`}
            >
              <Building2 className="size-5" />
              <span>Hotel Madinah</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION UNASSIGNED / BELUM DAPAT KAMAR */}
      {unassigned.length > 0 && (
        <section className="roomlist-unassigned-panel">
          <header className="roomlist-unassigned-header">
            <div>
              <span className="roomlist-tag-warn">BELUM MASUK KAMAR</span>
              <h3>Ada {unassigned.length} Jamaah {activeGender} belum dapat kamar di {activeCity === "makkah" ? "Makkah" : "Madinah"}</h3>
              <p>Pilih kamar yang sudah ada langsung di kartu kamar di bawah, atau klik tombol &ldquo;Atur Kamar&rdquo;.</p>
            </div>
          </header>

          <div className="roomlist-unassigned-grid">
            {unassigned.map((item) => (
              <div key={item.id} className="roomlist-unassigned-card">
                <div className="unassigned-avatar">
                  <User className="size-5 text-stone-600" />
                </div>
                <div className="unassigned-info">
                  <strong>{item.pilgrim?.fullName}</strong>
                  <small>{item.package?.name ?? "Paket Umroh"} · {item.pilgrim?.passportNumber ? `Paspor: ${item.pilgrim.passportNumber}` : "Paspor belum diisi"}</small>
                  <span className="roomlist-type-badge">{item.roomType ? item.roomType.toUpperCase() : "QUAD"}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setMoveModal({
                      registration: item,
                      currentRoomNumber: "",
                    })}
                    className="roomlist-assign-btn roomlist-action-inline-btn"
                  >
                    <DoorOpen className="size-4" />
                    <span>Masuk Kamar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. SECTION DAFTAR KAMAR (GROUPING ROOM BOXES / CARDS) */}
      <section className="roomlist-rooms-section">
        <header className="roomlist-rooms-header">
          <div>
            <small>PENGELOMPOKAN KAMAR {activeCity.toUpperCase()}</small>
            <h2>
              {rooms.length} Kamar Jamaah {activeGender} ({activeCity === "makkah" ? "Hotel Makkah" : "Hotel Madinah"})
            </h2>
          </div>
          <Link
            href="/admin/manajemen/manifest-room-list/baru"
            className="roomlist-new-room-btn"
          >
            <Plus className="size-4" />
            <span>+ Atur Kamar Baru</span>
          </Link>
        </header>

        {rooms.length === 0 ? (
          <div className="roomlist-empty-box">
            <BedSingle className="size-10 text-stone-400" />
            <h3>Belum ada pembagian kamar di {activeCity === "makkah" ? "Makkah" : "Madinah"}</h3>
            <p>
              Seluruh jamaah {activeGender.toLowerCase()} belum ditempatkan ke nomor kamar. Klik tombol &ldquo;Atur Kamar Baru&rdquo; di atas untuk mulai menyusun kamar.
            </p>
          </div>
        ) : (
          <div className="roomlist-cards-grid">
            {rooms.map((room) => {
              const capacity = ROOM_CAPACITIES[room.roomType] || 4;
              const filledCount = room.occupants.length;
              const isFull = filledCount >= capacity;
              const remaining = Math.max(0, capacity - filledCount);
              const open = isExpanded(room.roomNumber);

              return (
                <article
                  key={room.roomNumber}
                  className={`roomlist-card ${isFull ? "room-full" : "room-available"}`}
                >
                  {/* CARD HEADER (CLICKABLE ACCORDION) */}
                  <div
                    className="roomlist-card-header"
                    onClick={() => toggleRoom(room.roomNumber)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="roomlist-card-title-group">
                      <span className="roomlist-accordion-arrow">
                        {open ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                      </span>
                      <div>
                        <div className="roomlist-title-row">
                          <h3 className="roomlist-room-title">{room.roomNumber}</h3>
                          <span className={`roomlist-status-pill ${isFull ? "pill-full" : "pill-open"}`}>
                            {isFull ? `Penuh (${filledCount}/${capacity})` : `Tersedia ${remaining} Slot (${filledCount}/${capacity})`}
                          </span>
                        </div>
                        <p className="roomlist-meta-sub">
                          Tipe: <strong>{room.roomType.toUpperCase()} ({capacity} Orang)</strong> · {room.hotelName} · {room.departureName}
                        </p>
                      </div>
                    </div>

                    <div className="roomlist-header-action" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setRenameModal({
                          currentRoomNumber: room.roomNumber,
                          city: activeCity,
                          departureId: room.departureId,
                        })}
                        className="roomlist-edit-room-link roomlist-action-inline-btn"
                        title="Ubah nama nomor kamar ini langsung untuk semua jamaah di dalamnya"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Edit Nama Kamar</span>
                      </button>
                    </div>
                  </div>

                  {/* CARD BODY: COLLAPSIBLE LIST OF OCCUPANTS */}
                  {open && (
                    <div className="roomlist-card-body">
                      <ul className="roomlist-occupants-list">
                        {room.occupants.map((occupant, idx) => (
                          <li key={occupant.id} className="roomlist-occupant-row">
                            <div className="occupant-left">
                              <span className="occupant-slot-num">{idx + 1}</span>
                              <div className="occupant-details">
                                <strong className="occupant-name">{occupant.pilgrim?.fullName}</strong>
                                <small className="occupant-sub">
                                  Paspor: {occupant.pilgrim?.passportNumber || "Belum ada"} · WhatsApp: {occupant.pilgrim?.whatsapp || "—"}
                                </small>
                              </div>
                            </div>
                            <div className="occupant-right">
                              <button
                                type="button"
                                onClick={() => setMoveModal({
                                  registration: occupant,
                                  currentRoomNumber: room.roomNumber,
                                })}
                                className="occupant-move-btn roomlist-action-inline-btn"
                              >
                                <ArrowRightLeft className="size-3 mr-1" />
                                <span>Pindah Kamar</span>
                              </button>
                            </div>
                          </li>
                        ))}

                        {/* EMPTY SLOTS INDICATOR */}
                        {Array.from({ length: remaining }).map((_, slotIdx) => (
                          <li key={`empty-${slotIdx}`} className="roomlist-empty-slot">
                            <span className="occupant-slot-num empty">{filledCount + slotIdx + 1}</span>
                            <span className="empty-slot-text">
                              Slot Kosong ({room.roomType.toUpperCase()}) — Masih muat 1 jamaah lagi
                            </span>
                            <button
                              type="button"
                              onClick={() => setAssignModal({
                                targetRoomNumber: room.roomNumber,
                                targetRoomType: room.roomType,
                                departureId: room.departureId,
                              })}
                              className="occupant-add-btn roomlist-action-inline-btn"
                            >
                              <UserPlus className="size-3.5" />
                              <span>Isi Slot</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* DIALOG 1: EDIT / GANTI NAMA KAMAR */}
      {renameModal && (
        <div className="roomlist-modal-backdrop" onClick={() => !isPending && setRenameModal(null)}>
          <div className="roomlist-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="roomlist-modal-header">
              <h3>Edit Nama / Nomor Kamar</h3>
              <button
                type="button"
                className="roomlist-modal-close-btn"
                onClick={() => setRenameModal(null)}
                disabled={isPending}
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleRenameSubmit}>
              <div className="roomlist-modal-body">
                <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>
                  Mengubah nama kamar <strong>{renameModal.currentRoomNumber}</strong> di <strong>{renameModal.city === "makkah" ? "Makkah" : "Madinah"}</strong> akan langsung memperbarui seluruh jamaah di kamar ini sekaligus tanpa harus memindahkan satu per satu.
                </p>
                <input type="hidden" name="currentRoomNumber" value={renameModal.currentRoomNumber} />
                <input type="hidden" name="city" value={renameModal.city} />
                {renameModal.departureId && (
                  <input type="hidden" name="departureId" value={renameModal.departureId} />
                )}

                <div className="roomlist-modal-field">
                  <label htmlFor="newRoomNumber">Nama / Nomor Kamar Baru *</label>
                  <input
                    id="newRoomNumber"
                    name="newRoomNumber"
                    defaultValue={renameModal.currentRoomNumber}
                    placeholder="Contoh: MKH-Pullman-Quad-01 atau Kamar 402"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="roomlist-modal-actions">
                <button
                  type="button"
                  className="roomlist-btn-secondary"
                  onClick={() => setRenameModal(null)}
                  disabled={isPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="roomlist-btn-primary"
                  disabled={isPending}
                >
                  {isPending ? "Menyimpan..." : "Simpan Nama Kamar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG 2: ISI SLOT KOSONG (PILIH DARI JAMAAH BELUM DAPAT KAMAR) */}
      {assignModal && (
        <div className="roomlist-modal-backdrop" onClick={() => !isPending && setAssignModal(null)}>
          <div className="roomlist-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="roomlist-modal-header">
              <h3>Isi Slot Kamar: {assignModal.targetRoomNumber}</h3>
              <button
                type="button"
                className="roomlist-modal-close-btn"
                onClick={() => setAssignModal(null)}
                disabled={isPending}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="roomlist-modal-body">
              <p style={{ fontSize: "14px", color: "#475569", margin: 0 }}>
                Pilih jamaah <strong>{activeGender}</strong> yang belum masuk kamar di {activeCity === "makkah" ? "Makkah" : "Madinah"} untuk dimasukkan ke kamar <strong>{assignModal.targetRoomNumber}</strong>:
              </p>

              {unassigned.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", background: "#f8fafc", borderRadius: "10px" }}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                    Semua jamaah {activeGender.toLowerCase()} sudah mendapatkan kamar di {activeCity === "makkah" ? "Makkah" : "Madinah"}.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                  {unassigned.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                      }}
                    >
                      <div>
                        <strong style={{ display: "block", fontSize: "14px", color: "#1e293b" }}>{p.pilgrim?.fullName}</strong>
                        <small style={{ color: "#64748b", fontSize: "12px" }}>
                          {p.package?.name ?? "Paket Umroh"} · Tipe req: {(p.roomType || "quad").toUpperCase()}
                        </small>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAssignSlot(p.id)}
                        disabled={isPending}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          background: "#bd8d1b",
                          color: "#fff",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Check className="size-3.5" />
                        <span>Pilih</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="roomlist-modal-actions">
              <button
                type="button"
                className="roomlist-btn-secondary"
                onClick={() => setAssignModal(null)}
                disabled={isPending}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG 3: PINDAH / MASUK KAMAR JAMAAH */}
      {moveModal && (
        <div className="roomlist-modal-backdrop" onClick={() => !isPending && setMoveModal(null)}>
          <div className="roomlist-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="roomlist-modal-header">
              <h3>{moveModal.currentRoomNumber ? "Pindah Kamar Jamaah" : "Tempatkan ke Kamar"}</h3>
              <button
                type="button"
                className="roomlist-modal-close-btn"
                onClick={() => setMoveModal(null)}
                disabled={isPending}
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleMoveSubmit}>
              <div className="roomlist-modal-body">
                <input type="hidden" name="registrationId" value={moveModal.registration.id} />
                <input type="hidden" name="city" value={activeCity} />

                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <strong style={{ display: "block", fontSize: "15px", color: "#1e293b" }}>{moveModal.registration.pilgrim?.fullName}</strong>
                  <small style={{ color: "#64748b", fontSize: "12px" }}>
                    Paket: {moveModal.registration.package?.name ?? "Umroh"} · Gender: {moveModal.registration.pilgrim?.gender}
                  </small>
                  {moveModal.currentRoomNumber && (
                    <div style={{ marginTop: "4px", fontSize: "12px", color: "#b45309", fontWeight: 600 }}>
                      Kamar Saat Ini: {moveModal.currentRoomNumber}
                    </div>
                  )}
                </div>

                <div className="roomlist-modal-field">
                  <label htmlFor="modalRoomType">Tipe Kamar *</label>
                  <select
                    id="modalRoomType"
                    name="roomType"
                    defaultValue={moveModal.registration.roomType?.toLowerCase() || "quad"}
                    required
                  >
                    <option value="quad">Quad (4 Orang)</option>
                    <option value="triple">Triple (3 Orang)</option>
                    <option value="double">Double (2 Orang)</option>
                  </select>
                </div>

                <div className="roomlist-modal-field">
                  <label htmlFor="modalRoomNumber">Pilih Kamar yang Ada atau Ketik Baru *</label>
                  <input
                    id="modalRoomNumber"
                    name="roomNumber"
                    defaultValue={moveModal.currentRoomNumber}
                    list="move-modal-room-suggestions"
                    placeholder="Pilih atau ketik nomor kamar..."
                    required
                  />
                  <datalist id="move-modal-room-suggestions">
                    {availableRoomsWithSlots.map((r) => {
                      const cap = ROOM_CAPACITIES[r.roomType] || 4;
                      const sisa = cap - r.occupants.length;
                      return (
                        <option key={r.roomNumber} value={r.roomNumber}>
                          {r.roomNumber} (Tersedia {sisa} slot)
                        </option>
                      );
                    })}
                  </datalist>
                </div>

                {availableRoomsWithSlots.length > 0 && (
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "6px" }}>
                      Kamar yang masih ada slot kosong di {activeCity === "makkah" ? "Makkah" : "Madinah"}:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {availableRoomsWithSlots.map((r) => {
                        const cap = ROOM_CAPACITIES[r.roomType] || 4;
                        const sisa = cap - r.occupants.length;
                        return (
                          <button
                            key={r.roomNumber}
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.closest("form")?.elements.namedItem("roomNumber") as HTMLInputElement | null;
                              if (input) input.value = r.roomNumber;
                              const select = e.currentTarget.closest("form")?.elements.namedItem("roomType") as HTMLSelectElement | null;
                              if (select) select.value = r.roomType.toLowerCase();
                            }}
                            style={{
                              fontSize: "12px",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #bd8d1b",
                              background: "#fff9ec",
                              color: "#946a0c",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            {r.roomNumber} (Sisa {sisa})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="roomlist-modal-actions">
                <button
                  type="button"
                  className="roomlist-btn-secondary"
                  onClick={() => setMoveModal(null)}
                  disabled={isPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="roomlist-btn-primary"
                  disabled={isPending}
                >
                  {isPending ? "Menyimpan..." : "Simpan Kamar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
