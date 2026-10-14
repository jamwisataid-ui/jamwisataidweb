declare module "@react-native-community/datetimepicker" {
  import type { ComponentType } from "react";

  export type DateTimePickerEvent = { type: "set" | "dismissed" | "neutralButtonPressed"; nativeEvent: { timestamp: number; utcOffset?: number } };
  type Props = {
    value: Date;
    mode?: "date" | "time" | "datetime" | "countdown";
    maximumDate?: Date;
    minimumDate?: Date;
    onChange?: (event: DateTimePickerEvent, date?: Date) => void;
  };
  const DateTimePicker: ComponentType<Props>;
  export default DateTimePicker;
}
