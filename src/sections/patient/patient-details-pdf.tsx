import { useMemo } from 'react';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { capitalize, upperCase  } from 'lodash';
import { useContextData } from './@view/patient-details-view';
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
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb12: { marginBottom: 12 },
        mb15: { marginBottom: 15 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        caption: { fontSize: 7 },
        alignRight: { textAlign: 'right' },
        overline: {
          fontSize: 8,
          marginBottom: 8,
          fontWeight: 700,
          textTransform: 'uppercase',
        },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          padding: '24px',
        },
        section: {
          paddingBottom: '10px',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
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
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        listContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
        },
        listItem: {
          width: 'calc(33.33% - 8px)',
          marginBottom: 8,
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        borderBottom: {
          borderBottomWidth: 1,
          borderStyle: 'dashed',
          borderColor: '#DFE3E8',
        },
        tableCell_1: {
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  item?: any;
  allData?: any;
  soapData?: any;
  prescription?: any;
  // patientData?: any;
};

export default function PatientDetailsPDF({item,allData,soapData,prescription}: Props) {
  const styles = useStyles();
  // const {allData, setAllData}:any = useContextData();

  // console.log(allData);

  const PROFILE_INFO = [
    {
      category: 'personal',
      data: [
        { label: 'Birthdate', value: fDate(item?.patientInfo?.BDAY) || '-' },
        { label: 'Age', value: item?.patientInfo?.AGE || '-' },
        {
          label: 'Gender',
          value: capitalize(item?.patientInfo?.SEX === 1 ? 'MALE' : 'Female') || '-',
        },
        { label: 'Blood type', value: item?.patientInfo?.BLOOD_TYPE || '-' },
      ],
    },
    {
      category: 'contact',
      data: [
        { label: 'Address', value: item?.patientInfo?.HOME_ADD || '-' },
        { label: 'Phone number', value: item?.patientInfo?.CONTACT_NO || '-' },
        { label: 'Email', value: item?.patientInfo?.EMAIL || '-' },
      ],
    },
    {
      category: 'employment',
      data: [
        { label: 'Occupation', value: item?.patientInfo?.OCCUPATION || '-' },
        { label: 'Employer', value: item?.patientInfo?.EMPLOYERSNAME || '-' },
        { label: 'Address', value: item?.patientInfo?.EMPLOYERSADDRESS || '-' },
        { label: 'Phone number', value: item?.patientInfo?.EMPLOYERSPHONENO || '-' },
      ],
    },
    {
      category: 'emergency',
      data: [
        { label: 'Name', value: item?.patientInfo?.EMERGENCYNAME || '-' },
        { label: 'Address', value: item?.patientInfo?.EMERGENCYADDRESS || '-' },
        { label: 'Phone number', value: item?.patientInfo?.EMERGENCYCONTACTNO || '-' },
        { label: 'Relationship', value: item?.patientInfo?.EMERGENCYRELATIONSHIP || '-' },
      ],
    },
    {
      category: 'physician',
      data: [
        { label: 'Referring', value: item?.patientInfo?.REFFERINGPHYSICIAN || '-' },
        { label: 'Primary', value: item?.patientInfo?.PRIMARYCAREPHYSICIAN || '-' },
        { label: 'Other', value: item?.patientInfo?.OTHERPHYSICIAN || '-' },
      ],
    },
  ];

  const renderDetails = (
    <View style={[styles.mb8, styles.section, styles.listContainer, { rowGap: 8 }]}>
      {PROFILE_INFO.map((group) => (
        <View key={group.category} style={styles.col6}>
          <Text style={[styles.h4, { textTransform: 'capitalize' }]}>
            {group.category} Information
          </Text>
          {group.data.map((item) => (
            <Text key={item.label} style={styles.body1}>
              {item.label}: <Text style={{ fontWeight: 'bold' }}>{item.value}</Text>
            </Text>
          ))}
        </View>
      ))}
    </View>
  );

  const medicationDummy = ['arbdsbnsrtn', 'wba aen bfbf', 'sfbdsfb'];

  const renderMedication = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={styles.h4}>Medication</Text>
      <View style={styles.listContainer}>
        {allData?.medication?.map((item: any) => (
          <Text key={item?.id} style={[styles.col6, styles.body1]}>
            •&nbsp; {item?.medication || '-'}
          </Text>
        ))}
      </View>
    </View>
  );

  const renderAllergies = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={styles.h4}>Allergies</Text>
      <View style={styles.listContainer}>
        {allData?.allergies?.map((item: any) => (
          <Text key={item?.id} style={[styles.col6, styles.body1]}>
            •&nbsp; {item?.allergy || '-'}
          </Text>
        ))}
      </View>
    </View>
  );

  const renderFamilyHistory = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={styles.h4}>Family History</Text>
      <View style={styles.listContainer}>
        {allData?.family_history?.map((item: any) => (
          <Text key={item?.id} style={[styles.col6, styles.body1]}>
            •&nbsp; {item?.family_history || '-'}
          </Text>
        ))}
      </View>
    </View>
  );

  const renderMedicalHistory = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={styles.h4}>Medical History</Text>
      <View style={styles.listContainer}>
        {allData?.medical_history?.map((item: any) => (
          <Text key={item?.id} style={[styles.col6, styles.body1]}>
            •&nbsp; {item?.medhistory || '-'}
          </Text>
        ))}
      </View>
    </View>
  );


  const renderSmoking = (
    <View style={[styles.mb12, styles.section]}>
      <Text style={styles.h4}>Smoking</Text>
      <View style={styles.listContainer}>
        {allData?.smoking?.map((item: any) => (
          <Text key={item?.id} style={[styles.col6, styles.body1]}>
            •&nbsp; {item?.smoking || '-'}
          </Text>
        ))}
      </View>
    </View>
  );


  const renderMedicalNotes = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={[styles.h4, styles.mb8]}>Medical Note (S.O.A.P)</Text>
    </View> 
  );


  const renderSubjective = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={[styles.h4, styles.mb8]}>Subjective</Text>

      <View style={[styles.mb8, styles.gridContainer]}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Chief Complaint:</Text>
        </View>
        <View style={styles.col8}>
          <Text style={styles.body1}>{soapData?.complaint}</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.col4}>
          <Text style={styles.overline}>History of Present Illness:</Text>
        </View>
        <View style={styles.col8}>
          <Text style={styles.body1}>{soapData?.illness}</Text>
        </View>
      </View>
    </View>
  );

  const renderObjective = (
    <NotePDFSoapObjective item={soapData?.physicalInfo} vitData={soapData} />
  );

  const renderAssessment = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={[styles.h4, styles.mb8]}>Assessment</Text>

      <View style={styles.gridContainer}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Diagnosis:</Text>
        </View>
        <View style={styles.col8}>
          <Text style={styles.body1}>{soapData?.diagnosis}</Text>
        </View>
      </View>
    </View>
  );

  const renderPlan = (
    <View style={[styles.mb8, styles.section]}>
      <Text style={[styles.h4, styles.mb8]}>Plan</Text>

      <View style={styles.gridContainer}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Medical Plan:</Text>
        </View>
        <View style={styles.col8}>
          <Text style={styles.body1}>{soapData?.plan}</Text>
        </View>
      </View>
    </View>
  );

  const maxItemsPerColumn = 5;

  const prescriptionsByColumns: any = [];

  for (let i = 0; i < prescription[0]?.prescriptions_child.length; i += 5) {
    prescriptionsByColumns.push(prescription[0]?.prescriptions_child.slice(i, i + 5));
  }

  const renderPrescription = (
    <View>
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
    </View>
  );

  

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.mb8, { justifyContent: 'center', textAlign: 'center' }]}>
          <Text style={styles.h3}>{item?.patientInfo?.FNAME} {item?.patientInfo?.MNAME} {item?.patientInfo?.LNAME}</Text>
          <Text style={styles.body1}>{item?.patientInfo?.CONTACT_NO} | {item?.patientInfo?.EMAIL}</Text>
        </View>

        {renderDetails}

        {renderMedication}

        {renderAllergies}
        {renderFamilyHistory}
        {renderMedicalHistory}
        {renderSmoking}

        {renderMedicalNotes}

        {renderSubjective}

        {renderObjective}

        {renderAssessment}

        {renderPlan}

        <View style={styles.mb8}>
          <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
            <Image source="/assets/rx_logo.png" style={{ marginRight: 8, height: 32, width: 32 }} />
            <Text style={styles.overline}>Prescription Details</Text>
          </View>
        </View>

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
        
      </Page>
    </Document>
  );
}
