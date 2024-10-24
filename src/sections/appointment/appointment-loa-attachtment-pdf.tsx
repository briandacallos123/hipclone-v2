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
        h2: { fontSize: 20, fontWeight: 700 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        h5: { fontSize: 12, fontWeight: 500 },
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
  item?: any;
  appt_patient_info?: any;
};

export default function AppointmentLoaPDF({ item, appt_patient_info }: Props) {
  // console.log(item,"wooooo");
  // const keyPatient = _patientList.filter((_) => _.id === item?.patientId)[0].patient;

  // const patientName = `${keyPatient.firstName} ${keyPatient.lastName}`;

  // const patientName = `${item?.date_appt?.FNAME} ${item?.patientInfo?.MNAME} ${item?.patientInfo?.FNAME}`;
  const patientName = `${appt_patient_info?.patientInfo?.FNAME} ${appt_patient_info?.patientInfo?.MNAME} ${appt_patient_info?.patientInfo?.LNAME}`;
  // SEX
  // AGE
  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Document Header */}
        <View style={[styles.gridContainer, styles.mb8]}>
          <View style={styles.col8}>
            <Text style={styles.body1}>
              <Text style={styles.h5}>Fullname: </Text>
              {patientName}
            </Text>
            <Text style={styles.body1}>
              <Text style={styles.h5}>Age : </Text> {appt_patient_info?.patientInfo?.AGE || 20} yrs
              old,&nbsp;
            </Text>
            <Text style={styles.body1}>
              <Text style={styles.h5}>Gender: </Text>{' '}
              {(appt_patient_info?.patientInfo?.SEX === '1' && 'Male') ||
                (appt_patient_info?.patientInfo?.SEX === '2' && 'Female')}
            </Text>
            <Text style={styles.body1}>
              <Text style={styles.h5}>Address : </Text> {appt_patient_info?.patientInfo?.HOME_ADD}
            </Text>
          </View>

          <View style={[styles.col4, { alignItems: 'flex-end', flexDirection: 'column' }]}>
            <Text style={styles.h5}>LOA # {item?.id}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb8]}>
          <View style={styles.col8}>
            <Text style={styles.body1}>
              <Text style={styles.h2}>LOA ATTACHMENTS</Text>
            </Text>
          </View>
        </View>

        {/* Image List */}

        {/* <View style={[styles.stackContainer, styles.mb40]}>
          {item?.appt_hmo_attachment?.map((url:any) => (
            <><Text style={styles.h5}>{url?.filename} </Text> 
            <Image
              key={url}
              source={url?.file_url}
              style={[styles.mb8, { height: 'auto', width: '100%' }]}
            />
            </>
          ))}
        </View> */}
        <View style={[styles.stackContainer, styles.mb40]}>
          {item?.appt_hmo_attachment?.map((urlObject: any) => {
            const url = urlObject?.file_url || '';
            const parts = url.split('public');
            const publicPart = parts[1];

            return (
              <>
                <View key={url}>
                  {/* <Text style={styles.h5}>{urlObject?.filename} </Text> */}
                  <Image
                    key={url}
                    source={{ uri: publicPart }}
                    style={[styles.mb8, { height: '90%', width: '500px' }]}
                  />
                </View>
              </>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
