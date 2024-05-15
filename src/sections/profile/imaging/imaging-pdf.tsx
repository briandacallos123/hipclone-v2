import { useMemo } from 'react';
import { capitalize } from 'lodash';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
// _mock
import { _patientList } from 'src/_mock';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { IImagingItem } from 'src/types/document';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col5: { width: '40%' },
        col6: { width: '50%' },
        col7: { width: '60%' },
        col8: { width: '75%' },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        body1: { fontSize: 10 },
        page: {
          padding: '40px 24px 0 24px',
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#fff',
        },
        stackContainer: {
          flexDirection: 'column',
          paddingTop: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  item?: IImagingItem;
};

export default function ProfileImagingPDF({ item }: Props) {
  const keyPatient = _patientList.filter((_) => _.id === item?.patientId)[0].patient;

  const patientName = `${keyPatient.firstName} ${keyPatient.lastName}`;

  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Document Header */}
        <View style={[styles.gridContainer, styles.mb8]}>
          <View style={styles.col8}>
            <Text>
              <Text style={styles.h3}>{patientName}&nbsp;</Text>
              <Text style={styles.body1}>{`${keyPatient.age} yrs old, ${capitalize(
                keyPatient.gender
              )}`}</Text>
            </Text>
            <Text style={styles.body1}>{keyPatient.address}</Text>
          </View>

          <View style={[styles.col4, { alignItems: 'flex-end', flexDirection: 'column' }]}>
            <Text style={styles.h3}>{`#${item?.imageNumber}`}</Text>
            <Text style={styles.body1}> {fDate(item?.date)} </Text>
          </View>
        </View>

        {/* Image List */}
        {/* <View style={[styles.stackContainer, styles.mb40]}>
          {item?.attachment.map((image) => (
            <Image
              key={image}
              source={image}
              style={[styles.mb8, { height: 'auto', width: '100%' }]}
            />
          ))}
        </View> */}
       <View style={[styles.stackContainer, styles.mb40]}>
       {item?.attachment?.map((urlObject: any) => {
              const url = urlObject?.file_url || '';
              const parts = url.split('public');
              const publicPart = parts[1];
              
              return (
                <View key={url}>
                  <Text style={styles.h5}>{urlObject?.file_name} </Text> 
                  <Image
                    source={{ uri: publicPart }} 
                    style={[styles.mb8, { height: 'auto', width: '100%' }]}
                  />
                </View>
              );
            })}
        </View>
      </Page>
    </Document>
  );
}
