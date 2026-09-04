"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

import {
  ROOM_CAPACITIES,
  type RoomCity,
  type RoomType,
} from "@/lib/management/domain";
import { AdminPageHeader } from "./AdminUi";
import type { getManagementContext } from "@/lib/management/data";

type Context = Awaited<ReturnType<typeof getManagementContext>>;
type RegistrationItem = Context["registrations"][number];

export function RoomListWorkspace({ data }: { data: Context }) {
  const [activeGender, setActiveGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [activeCity, setActiveCity] = useState<RoomCity>("makkah");
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});

  // Filter registrations with valid genders
  const genderRegistrations = useMemo(() => {
    return data.registrations.filter((item) => item.pilgrim?.gender === activeGender && item.status === "active");
  }, [data.registrations, activeGender]);

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
          <div className="gender-btn-icon">👨</div>
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
          <div className="gender-btn-icon">🧕</div>
          <div className="gender-btn-text">
            <strong>Jamaah Perempuan</strong>
            <small>{totalWomen} orang terdaftar</small>
          </div>
        </button>
      </section>

      {/* 2. TINGKAT KEDUA: PILIH KOTA / HOTEL MAKKAH VS MADINAH */}
      <section className="roomlist-city-selector">
        <div className="roomlist-city-label">
          <span>Pilih Lokasi Hotel:</span>
        </div>
        <div className="roomlist-city-pills">
          <button
            type="button"
            onClick={() => setActiveCity("makkah")}
            className={`roomlist-city-pill ${activeCity === "makkah" ? "active" : ""}`}
          >
            <Hotel className="size-5" />
            <span>🕋 Hotel Makkah</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCity("madinah")}
            className={`roomlist-city-pill ${activeCity === "madinah" ? "active" : ""}`}
          >
            <Building2 className="size-5" />
            <span>🕌 Hotel Madinah</span>
          </button>
        </div>
      </section>

      {/* 3. SECTION UNASSIGNED / BELUM DAPAT KAMAR */}
      {unassigned.length > 0 && (
        <section className="roomlist-unassigned-panel">
          <header className="roomlist-unassigned-header">
            <div>
              <span className="roomlist-tag-warn">BELUM MASUK KAMAR</span>
              <h3>Ada {unassigned.length} Jamaah {activeGender} belum dapat kamar di {activeCity === "makkah" ? "Makkah" : "Madinah"}</h3>
              <p>Klik tombol &ldquo;Atur Kamar&rdquo; di bawah untuk langsung menempatkan ke nomor kamar.</p>
            </div>
          </header>

          <div className="roomlist-unassigned-grid">
            {unassigned.map((item) => (
              <div key={item.id} className="roomlist-unassigned-card">
                <div className="unassigned-avatar">👤</div>
                <div className="unassigned-info">
                  <strong>{item.pilgrim?.fullName}</strong>
                  <small>{item.package?.name ?? "Paket Umroh"} · {item.pilgrim?.passportNumber ? `Paspor: ${item.pilgrim.passportNumber}` : "Paspor belum diisi"}</small>
                  <span className="roomlist-type-badge">{item.roomType ? item.roomType.toUpperCase() : "QUAD"}</span>
                </div>
                <Link
                  href={`/admin/manajemen/manifest-room-list/${item.id}`}
                  className="roomlist-assign-btn"
                >
                  <DoorOpen className="size-4" />
                  <span>Atur Kamar</span>
                </Link>
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
                      <Link
                        href={`/admin/manajemen/manifest-room-list/${room.occupants[0]?.id}`}
                        className="roomlist-edit-room-link"
                        title="Edit atau ganti nomor kamar"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Edit Kamar</span>
                      </Link>
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
                              <Link
                                href={`/admin/manajemen/manifest-room-list/${occupant.id}`}
                                className="occupant-move-btn"
                              >
                                Pindah Kamar
                              </Link>
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
                            <Link
                              href="/admin/manajemen/manifest-room-list/baru"
                              className="occupant-add-btn"
                            >
                              <UserPlus className="size-3.5" />
                              <span>Isi Slot</span>
                            </Link>
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
    </div>
  );
}
