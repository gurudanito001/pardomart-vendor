import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

interface OpeningHoursInputProps {
  dayLabel: string; // e.g., 'Monday'
  initialOpenTime: string; // e.g., '09:00'
  initialCloseTime: string; // e.g., '21:00'
  initialIsClosed: boolean;
  onTimeChange: (day: string, open: string, close: string, isClosed: boolean) => void;
}

const formatTime = (time: string): string => {
  const cleaned = time.replace(/[^0-9]/g, '');
  if (cleaned.length > 4) return cleaned.substring(0, 4);

  let formatted = cleaned;
  if (cleaned.length > 2) {
    formatted = `${cleaned.substring(0, 2)}:${cleaned.substring(2, 4)}`;
  }
  return formatted;
};

const validateTime = (time: string): boolean => {
  if (!time) return true; // Empty time is valid if day is closed or handled by other logic
  const [hours, minutes] = time.split(':').map(Number);
  return !isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

const OpeningHoursInput: React.FC<OpeningHoursInputProps> = ({
  dayLabel,
  initialOpenTime,
  initialCloseTime,
  initialIsClosed,
  onTimeChange,
}) => {
  const [openTime, setOpenTime] = useState(initialOpenTime);
  const [closeTime, setCloseTime] = useState(initialCloseTime);
  const [isClosed, setIsClosed] = useState(initialIsClosed);

  useEffect(() => {
    setOpenTime(initialOpenTime);
    setCloseTime(initialCloseTime);
    setIsClosed(initialIsClosed);
  }, [initialOpenTime, initialCloseTime, initialIsClosed]);

  const handleOpenTimeChange = (text: string) => {
    const formatted = formatTime(text);
    setOpenTime(formatted);
    if (validateTime(formatted) && validateTime(closeTime)) {
      onTimeChange(dayLabel, formatted, closeTime, isClosed);
    }
  };

  const handleCloseTimeChange = (text: string) => {
    const formatted = formatTime(text);
    setCloseTime(formatted);
    if (validateTime(openTime) && validateTime(formatted)) {
      onTimeChange(dayLabel, openTime, formatted, isClosed);
    }
  };

  const handleToggleClosed = (value: boolean) => {
    setIsClosed(value);
    if (value) {
      // Clear times when closed
      setOpenTime('');
      setCloseTime('');
      onTimeChange(dayLabel, '', '', true);
    } else {
      // Restore default or previous times when opened
      const o = initialOpenTime || '09:00';
      const c = initialCloseTime || '21:00';
      setOpenTime(o);
      setCloseTime(c);
      onTimeChange(dayLabel, o, c, false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dayLabel}>{dayLabel}</Text>
      <View style={styles.timeInputs}>
        <TextInput
          style={[styles.timeInput, isClosed && styles.disabledInput]}
          value={openTime}
          onChangeText={handleOpenTimeChange}
          keyboardType="numeric"
          maxLength={5} // HH:MM
          placeholder="HH:MM"
          editable={!isClosed}
        />
        <Text style={styles.timeSeparator}>-</Text>
        <TextInput
          style={[styles.timeInput, isClosed && styles.disabledInput]}
          value={closeTime}
          onChangeText={handleCloseTimeChange}
          keyboardType="numeric"
          maxLength={5} // HH:MM
          placeholder="HH:MM"
          editable={!isClosed}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Closed</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#C70000" }} // Red for closed
          thumbColor={isClosed ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggleClosed}
          value={isClosed}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#000',
    fontWeight: '600',
    flex: 1,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#B4BED4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: 60,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#000',
  },
  disabledInput: {
    backgroundColor: '#E0E0E0',
    color: '#7C7B7B',
  },
  timeSeparator: {
    marginHorizontal: 5,
    fontSize: 14,
    fontFamily: 'Open Sans',
    color: '#000',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  switchLabel: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    color: '#000',
    marginRight: 5,
  },
});

export default OpeningHoursInput;
