import { Stack } from 'expo-router';
import React from 'react';

export default function HelpLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reportIssue" />
      <Stack.Screen name="bugReportList" />
      <Stack.Screen name="bugReportDetails" />
    </Stack>
  );
}
