import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#2f466b',
    maxWidth:'300px'
  },
  section: {
    margin:0,
    padding: 0,
    flexGrow: 0,
  },
});

const PdfTest = () => {
  return (
    <Document>
    <Page size="A6" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1243</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
  )
}

export default PdfTest