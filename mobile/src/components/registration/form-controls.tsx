import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

export function RegistrationField({ label, error, optional, ...props }: TextInputProps & { label: string; error?: string; optional?: boolean }) {
  return <View style={styles.group}><Text style={styles.label}>{label}{optional ? <Text style={styles.optional}>  Opsional</Text> : null}</Text><TextInput placeholderTextColor="#9298A2" {...props} style={[styles.input, props.multiline && styles.multiline, error && styles.inputError, props.style]} />{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

function toDate(value: string) {
  const date = value ? new Date(`${value}T12:00:00`) : new Date(1990, 0, 1);
  return Number.isNaN(date.getTime()) ? new Date(1990, 0, 1) : date;
}

export function DateField({ label, value, onChange, error, optional }: { label: string; value: string; onChange: (value: string) => void; error?: string; optional?: boolean }) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);
  const changed = (_event: DateTimePickerEvent, date?: Date) => { setOpen(Platform.OS === "ios"); if (date) onChange(date.toISOString().slice(0, 10)); };
  if (Platform.OS === "web") return <RegistrationField label={label} optional={optional} value={value} onChangeText={onChange} placeholder="YYYY-MM-DD" error={error} inputMode="numeric" />;
  return <View style={styles.group}><Text style={styles.label}>{label}{optional ? <Text style={styles.optional}>  Opsional</Text> : null}</Text><Pressable onPress={() => setOpen(true)} style={[styles.input, styles.dateButton, error && styles.inputError]}><Text style={[styles.dateText, !value && { color: "#9298A2" }]}>{value ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(selected) : `Pilih ${label.toLowerCase()}`}</Text><Ionicons name="calendar-outline" size={20} color={colors.navy} /></Pressable>{open ? <DateTimePicker value={selected} mode="date" maximumDate={label === "Tanggal Lahir" ? new Date() : undefined} onChange={changed} /> : null}{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

export function GenderSelector({ value, onChange, error }: { value: string; onChange: (value: "Laki-laki" | "Perempuan") => void; error?: string }) {
  return <View style={styles.group}><Text style={styles.label}>Jenis Kelamin</Text><View style={styles.genderRow}>{(["Laki-laki", "Perempuan"] as const).map((item) => <Pressable key={item} onPress={() => onChange(item)} style={styles.radioOption}><View style={[styles.radio, value === item && styles.radioSelected]}>{value === item ? <View style={styles.radioDot} /> : null}</View><Text style={styles.radioText}>{item}</Text></Pressable>)}</View>{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  group: { gap: 7 }, label: { color: colors.ink, fontFamily: "Montserrat_700Bold", fontSize: 14 }, optional: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12 },
  input: { minHeight: 56, borderWidth: 1, borderColor: "#D8DDE3", backgroundColor: colors.white, borderRadius: 14, paddingHorizontal: 15, color: colors.ink, fontFamily: "Montserrat_400Regular", fontSize: 16 },
  multiline: { minHeight: 92, paddingTop: 14, textAlignVertical: "top" }, inputError: { borderColor: colors.danger }, error: { color: colors.danger, fontFamily: "Montserrat_400Regular", fontSize: 12.5 },
  dateButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, dateText: { flex: 1, color: colors.ink, fontFamily: "Montserrat_400Regular", fontSize: 15 },
  genderRow: { flexDirection: "row", gap: 24, minHeight: 48, alignItems: "center" }, radioOption: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 }, radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#A8AFB9", alignItems: "center", justifyContent: "center" }, radioSelected: { borderColor: colors.navy }, radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.navy }, radioText: { color: colors.ink, fontFamily: "Montserrat_500Medium", fontSize: 15 },
});
