import { useMemo } from 'react';
import { capitalize, upperCase } from 'lodash';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
// _mock
import { _doctorList, _hospitals, _patientList } from 'src/_mock';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { IPrescriptionItem } from 'src/types/prescription';


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
        mb20: { marginBottom: 20 },
        overline: {
          fontSize: 8,
          marginBottom: 8,
          fontWeight: 700,
          textTransform: 'uppercase',
        },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        caption: { fontSize: 7 },
        page: {
          padding: '24px 24px 170px 24px',
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#fff',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        pageNumber: {
          left: 0,
          bottom: 0,
          position: 'absolute',
        },
        gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
        listContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
        },
        listItem: {
          width: 'calc(33.33% - 8px)',
          marginBottom: 8,
        },
        table: { display: 'flex', width: 'auto' },
        tableHeader: {},
        tableBody: {},
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        tableCell_1: { width: '5%' },
        tableCell_2: { width: '50%', paddingRight: 16 },
        tableCell_3: { width: '15%' },
        block: {
          padding: '8px',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#FF0000',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  item?: any;
  qrImage?:any
};

const calculateColumns = (length) => {
  if (length <= 5) {
    return 1;
  } else if (length <= 10) {
    return 2;
  } else {
    return 3;
  }
};


export default function PrescriptionPDF({ item, qrImage }: Props) {
  const { clinicInfo, patient, prescriptions_child } = item;

  // const keyPatient = _patientList.filter((_) => _.id === item?.patientId)[0].patient;

  // const keyDoctor = _doctorList.filter((_) => _.id === item?.doctor.id)[0].doctor;

  // const keyHospital = _hospitals.filter((_) => _.id === item?.hospitalId)[0];

  const doctorName = item.doctorInfo?.EMP_FULLNAME;

  const patientName = !patient?.MNAME
    ? `${patient?.FNAME} ${patient?.MNAME} ${patient?.LNAME}`
    : `${patient?.FNAME} ${patient?.LNAME}`;

  const styles = useStyles();

  const date = new Date(Number(item?.DATE));

  const doctorInfo = item.doctorInfo?.DoctorClinics.filter((i: any) => {
    if (i?.clinic_name !== item.clinicInfo?.clinic_name) {
      return i;
    }
  }).slice(0, 4);

  const isMore = prescriptions_child?.length > 6;

  const numColumns = calculateColumns(prescriptions_child.length);
  // const styleSmart = () => {
  //   if(prescriptions_child?.length <= 5){
  //     return {flexDirection: 'column', flexWrap: 'wrap', gap: 8 }}
  //   }
  //   if
  // }
  const prescriptionsByColumns: any = [];

  for (let i = 0; i < prescriptions_child.length; i += 5) {
    prescriptionsByColumns.push(prescriptions_child.slice(i, i + 5));
  }

  const maxItemsPerColumn = 5;


  const ESIG = () => {
    let text: any;
    if (item.doctorInfo?.esig_dp?.[0]?.type === 0) {
        text = <></>;
    } else if (item.doctorInfo?.esig_dp?.[0]?.type === 1) {
        text = <>
        <Image source={item.doctorInfo?.esig_dp?.[0]?.filename.split('public')[1]} style={{ height: 72, width: 180 }} />
        </>;
    } else if (item.doctorInfo?.esig_dp?.[0]?.type === 2) {
      text = <>
        <Image source={item.doctorInfo?.esig_dp?.[0]?.filename.split('public')[1]} style={{ height: 72, width: 180 }} />
        </>;
    } 
    return text;
  };


  
  const LIC = () => {
    let text: any;
    if (item?.doctorInfo?.PTR_LIC === "") {
        text = <></>;
    } else if (item?.doctorInfo?.PTR_LIC) {
        text = <>
        <Text style={{...styles.body1,fontSize: 8}}>Ptr License No.: {item?.doctorInfo?.PTR_LIC}</Text>
        </>;
    } 
    return text;
  };

  const S2 = () => {
    let text: any;
    if (item?.doctorInfo?.S2_LIC === "") {
        text = <></>;
    } else if (item?.doctorInfo?.S2_LIC) {
        text = <>
         <Text style={{...styles.body1,fontSize: 8}}>S2 License No.: {item?.doctorInfo?.S2_LIC}</Text>
        </>;
    } 
    return text;
  };



  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Document Header */}
        <View style={styles.mb20}>
          <View style={[styles.mb8, { justifyContent: 'center', textAlign: 'center' }]}>
            <Text style={styles.h3}>{doctorName}</Text>
            <Text style={[styles.body1, { textTransform: 'uppercase' }]}>
              {doctorInfo.SpecializationInfo?.name}
            </Text>
          </View>

          <View
            style={[styles.mb8, { width: '100%', alignItems: 'center', flexDirection: 'column' }]}
          >
            <Text style={styles.h4}>{item.clinicInfo?.clinic_name}</Text>
            <Text style={styles.body1}>{item.clinicInfo?.location}</Text>
            <Text style={styles.body1}>{item.clinicInfo?.number}</Text>
          </View>

          <View style={styles.listContainer}>
            {doctorInfo?.map((clinic) => (
              <View key={clinic.id} style={[styles.col6, styles.mb8]}>
                {clinic.clinic_name && (
                  <View style={styles.listContainer}>
                    <Image
                      source="/assets/icons/pdf/hospital-buildings.png"
                      style={{ height: 10, minWidth: 10, paddingRight: 5 }}
                    />
                    <Text style={styles.subtitle2}>{clinic.clinic_name}</Text>
                  </View>
                )}

                {clinic.location && (
                  <View style={styles.listContainer}>
                    <Image
                      source="/assets/icons/pdf/navigation.png"
                      style={{ height: 8, minWidth: 8, paddingRight: 5 }}
                    />
                    <Text style={styles.caption}>{clinic.location}</Text>
                  </View>
                )}
                {clinic?.number && (
                  <View style={styles.listContainer}>
                    <Image
                      source="/assets/icons/pdf/call.png"
                      style={{ height: 8, minWidth: 8, paddingRight: 5 }}
                    />
                    <Text style={styles.caption}>{clinic?.number}</Text>
                  </View>
                )}
              </View>
            ))}
       
          </View>
        </View>

        {/* Prescription Details */}
        <View
          style={[
            styles.gridContainer,
            {
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: '#DFE3E8',
              display:'flex',
              alignItems:'center',
              paddingRight:2
            },
          ]}
        >
          <View style={styles.col6}>
            <Text style={styles.h4}>Prescription: #{item?.ID}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={styles.h4}>Date: {fDate(date)} </Text>
          </View>
          <View>
          <Image source={qrImage}   style={{ height: 70, width: 70}}/>
          </View>
        </View>

        {/* Patient Details */}
        <View style={[styles.mb20, { marginTop: 5 }]}>
          <Text style={styles.body1}>
            <Text style={styles.subtitle1}>{patientName}</Text>
            {patient?.AGE !== 0 && patient?.AGE && `, ${patient?.AGE} yrs old,&nbsp;`}
          </Text>
          <Text style={styles.body1}>{patient?.HOME_ADD || 'No Address Provided'}</Text>
        </View>

        <View style={styles.mb8}>
          
        </View>

        {/* Prescription List */}
        <View style={styles.mb8}>
          <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
            <Image source="/assets/rx_logo.png" style={{ marginRight: 8, height: 32, width: 32 }} />
            <Text style={styles.overline}>Prescription Details</Text>
          </View>
        </View>

        {/* <View style={[styles.listContainer, { columnGap: 8 }]}>
          {doctorInfo?.map((clinic) => (
            <View key={clinic.id} style={[styles.col6, styles.mb8, styles.block]}>
              <Text style={styles.subtitle2}>{clinic?.clinic_name}</Text>
              <Text style={styles.caption}>{clinic?.location}</Text>
              <Text style={styles.caption}>{clinic?.number}</Text>
            </View>
          ))}
        </View> */}
        {Array(maxItemsPerColumn)
          .fill(0)
          .map((_, rowIndex) => (
            <View key={rowIndex} style={styles.listContainer}>
              {prescriptionsByColumns.map((column: any, columnIndex: any) => (
                <View key={columnIndex} style={styles.listItem}>
                  {rowIndex < column.length ? (
                    <>
                      <Text style={styles.body2}>
                        <Text style={styles.subtitle2}>
                          {rowIndex + 1 + columnIndex * maxItemsPerColumn}.{' '}
                          {column[rowIndex]?.MEDICINE} ({upperCase(column[rowIndex]?.MED_BRAND)})
                        </Text>{' '}
                        {column[rowIndex]?.DOSE}/{column[rowIndex]?.FORM}
                      </Text>
                      <Text>
                        <Text style={styles.subtitle2}>Qty:</Text> {column[rowIndex]?.QUANTITY},{' '}
                        <Text style={styles.subtitle2}>Sig:</Text> {column[rowIndex]?.FREQUENCY}x a
                        day ({column[rowIndex]?.DURATION} days)
                      </Text>
                    </>
                  ) : null}
                </View>
              ))}
            </View>
          ))}
        {/* <View style={[styles.table, styles.mb20]}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Name</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Qty</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Sig.</Text>
              </View>
            </View>
          </View>

          <View style={[styles.tableBody, styles.mb20]}>
            {prescriptions_child?.map((prescription, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>
                    {prescription?.MEDICINE} ({upperCase(prescription?.MED_BRAND)})
                  </Text>
                  <Text>
                    {prescription?.DOSE}/{prescription?.FORM}
                  </Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{prescription?.QUANTITY}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>
                    {prescription?.FREQUENCY}x a day ({prescription?.DURATION} days)
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.tableBody]}>
            <Text style={styles.overline}>Remarks</Text>
            <Text style={styles.body1}>{item?.REMARKS}</Text>
          </View>
        </View> */}

        {/* Document Footer */}
        <View style={[styles.footer, styles.gridContainer]} fixed>
          <View style={[styles.col6, { position: 'relative' }]}>
            <Text style={[styles.caption, styles.mb8]}>
              This document is solely for the use of the patient above-named. Any alteration,
              copying, distribution, or any act of forgery and/or use by any other person other than
              the above-named patient without the knowledge and consent of the undersigned physician
              is STRICTLY PROHIBITED.
            </Text>
            <Text style={[styles.caption, styles.mb8]}>
              Any person who commits acts in violation thereof shall be held liable in accordance
              with the law. Please notify immediately the undersigned physician in case of any
              suspicious use of this prescription.
            </Text>
            <Text
              style={[styles.caption, styles.pageNumber]}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
            />
          </View>

          {/* row?.doctorInfo?.user?.[0]?.display_picture?.[0]?.filename.split('public')[1] */}
          {/* src={row?.doctorInfo?.user?.[0]?.display_picture?.[0]?.filename.split('public')[1]} */}

          {/* //item.doctorInfo?.esig_dp?.[0]?.filename.split('public')[1] */}
          <View style={styles.col5}>
            {ESIG()}
            <Text style={{...styles.subtitle2,fontSize: 10}}>{doctorName}, {item?.doctorInfo?.EMP_TITLE}</Text>
            <Text style={{...styles.body1,fontSize: 8}}>License No.: {item?.doctorInfo?.LIC_NUMBER}</Text>
            {LIC()}
            {S2()}
           
          </View>
        </View>
      </Page>
    </Document>
  );
}
