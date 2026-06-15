import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}

const ChevronDownIcon = ({ expanded }: { expanded: boolean }) => (
  <Svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={expanded ? styles.chevronUp : styles.chevronDown}>
    <Path d="M1 1.5L6 6.5L11 1.5" stroke="#484C52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Accordion: React.FC<AccordionProps> = ({ title, children, initialExpanded = false }) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <ChevronDownIcon expanded={expanded} />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#B4BED4',
    borderRadius: 16,
    marginBottom: 21,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    color: '#000',
  },
  chevronDown: {
    transform: [{ rotate: '0deg' }],
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default Accordion;
