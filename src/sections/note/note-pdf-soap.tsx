import { useMemo } from 'react';
import { capitalize } from 'lodash';
import { Page, View, Text, Document, Image, Font, StyleSheet } from '@react-pdf/renderer';
// _mock
import { _doctorList, _hospitals, _noteSoapList, _patientList } from 'src/_mock';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { INoteItem } from 'src/types/document';
//
import { useResponsive } from 'src/hooks/use-responsive';
import NotePDFSoapObjective from './note-pdf-soap-objective';

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
          padding: '24px 24px 70px 24px',
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#fff',
        },
        section: {
          padding: '10px',
          backgroundColor: '#F4F6F8',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          position: 'absolute',
        },
        pageNumber: {
          left: 0,
          bottom: 0,
          position: 'absolute',
        },
        gridContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
        stackContainer: {
          flexDirection: 'column',
        },
        listContainer: { flexDirection: 'row', flexWrap: 'wrap' },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  item?: any;
};

export default function NotePDFSoap({ item }: Props) {
  // const keyPatient = _patientList.filter((_) => _.id === item?.patientId)[0].patient;

  // const keyDoctor = _doctorList.filter((_) => _.id === item?.doctor.id)[0].doctor;

  // const keyHospital = _hospitals.filter((_) => _.id === item?.hospitalId)[0];

  // const document = _noteSoapList.filter((_) => _.id === item?.documentId)[0];

  // const doctorName = `${keyDoctor.firstName} ${keyDoctor.lastName}, ${keyDoctor.title}`;

  // const patientName = `${keyPatient.firstName} ${keyPatient.lastName}`;
  // const upMd = useResponsive('up', 'md');
  // console.log('pDF', item?.illness);

  const styles = useStyles();
  const formatDate = (date: any) => {
    const dateObj = new Date(date);

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const year = dateObj.getFullYear();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(dateObj);
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${month} ${day}, ${year}`;
  };

  const doctorInfo = item?.doctorInfo?.ClinicList?.filter((i: any) => {
    if (i?.clinic_name !== item.clinicInfo?.clinic_name) {
      return i;
    }
  }).slice(0, 4);

  const renderSubjective = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={[styles.h4, styles.mb8]}>Subjective</Text>

      <View style={[styles.mb8, styles.gridContainer]}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Chief Complaint:</Text>
        </View>
        <View style={styles.col8}>
          <Text style={styles.body1}>{item?.complaint}</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.col4}>
          <Text style={styles.overline}>History of Present Illness:</Text>
        </View>
        <View style={styles.col8}>
          <Text style={styles.body1}>{item?.illness}</Text>
        </View>
      </View>
    </View>
  );

  const renderObjective = <NotePDFSoapObjective item={item?.physicalInfo} vitData={item} />;

  const renderAssessment = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={[styles.h4, styles.mb8]}>Assessment</Text>

      <View style={[styles.mb8, styles.gridContainer]}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Diagnosis:</Text>
        </View>
        <View style={styles.col8}>
          <Text style={styles.body1}>{item?.diagnosis}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.overline}>Remarks</Text>
        {item?.remarks0?.map((remark: any, index: number) => (
          <Text key={remark} style={styles.body1}>
            {index + 1}. {remark}
          </Text>
        ))}
      </View>
    </View>
  );

  const renderPlan = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={[styles.h4, styles.mb8]}>Plan</Text>

      <View style={[styles.mb8, styles.gridContainer]}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Medical Plan:</Text>
        </View>
        <View style={styles.col8}>
          <Text style={styles.body1}>{item?.plan}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.overline}>Remarks</Text>
        {item?.remarks1?.map((remark: any, index: number) => (
          <Text key={remark} style={styles.body1}>
            {index + 1}. {remark}
          </Text>
        ))}
      </View>
    </View>
  );

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
      <Page size='A4' style={styles.page}>
        {/* Document Header */}
        <View style={styles.mb20}>
          <View style={[styles.mb8, { justifyContent: 'center', textAlign: 'center' }]}>
            <Text style={styles.h3}>{item?.doctorInfo?.EMP_FULLNAME}</Text>
            <Text style={[styles.body1, { textTransform: 'uppercase' }]}>
              {item?.doctorInfo?.SpecializationInfo?.name || ''}
            </Text>
          </View>

          <View
            style={[styles.mb8, { width: '100%', alignItems: 'center', flexDirection: 'column' }]}
          >
            <Text style={styles.h4}>{item?.clinicInfo?.clinic_name}</Text>
            <Text style={styles.body1}>{item?.clinicInfo?.location}</Text>
            <Text style={styles.body1}>{item?.clinicInfo?.number}</Text>
          </View>

          <View style={styles.listContainer}>
            {doctorInfo?.map((clinic: any) => (
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

                {/* <Text style={styles.caption}>{clinic.location}</Text>
                <Text style={styles.caption}>{clinic?.Province || ''}</Text> */}
              </View>
            ))}
          </View>
        </View>

        {/* Note Details */}
        <View
          style={[
            styles.gridContainer,
            {
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: '#DFE3E8',
            },
          ]}
        >
          <View style={styles.col6}>
            <Text style={styles.h4}>SOAP: #{item?.id}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={styles.h4}>Date: {formatDate(item?.dateCreated)}</Text>
          </View>
        </View>

        {/* Patient Details */}
        <View style={[styles.mb20, { marginTop: 5 }]}>
          <Text style={styles.body1}>
            <Text
              style={styles.subtitle1}
            >{`${item?.patientInfo?.FNAME} ${item?.patientInfo?.LNAME}`}</Text>
            , {item?.patientInfo?.AGE || '(Not Specified)'} yrs old,&nbsp;
            {item?.patientInfo?.SEX === 1 ? 'Male' : 'Female'}
          </Text>
          <Text style={styles.body1}>{item?.patientInfo?.HOME_ADD}</Text>
        </View>

        {/* Document Content */}
        <Text style={[styles.h3, styles.mb8, { textAlign: 'center' }]}>S.O.A.P</Text>

        {renderSubjective}

        {renderObjective}

        {renderAssessment}

        {renderPlan}

        {/* Document Footer */}
        <View style={[styles.footer, styles.gridContainer]} fixed>
          <View style={[styles.col6, { position: 'relative' }]}>
            <Text
              style={[styles.caption, styles.pageNumber]}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
            />
          </View>

          <View style={styles.col5}>
            {ESIG()}
            <Text style={{...styles.subtitle2,fontSize: 10}}>{item?.doctorInfo?.EMP_FULLNAME}, {item?.doctorInfo?.EMP_TITLE}</Text>
            <Text style={{...styles.body1,fontSize: 8}}>License No.: {item?.doctorInfo?.LIC_NUMBER}</Text>
            {LIC()}
            {S2()}
          </View>
        </View>
      </Page>
    </Document>
  );
}

