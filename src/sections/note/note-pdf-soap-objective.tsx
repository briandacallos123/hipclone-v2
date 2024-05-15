import { useMemo } from 'react';
import { View, Text, Font, StyleSheet } from '@react-pdf/renderer';
// _mock
import { _noteSoapList } from 'src/_mock';
// types
import { INoteItem } from 'src/types/document';
import { NexusGenObjects } from 'generated/nexus-typegen';
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
        colBullet: { width: '3%' },
        colContent: { width: '97%' },
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
        section: {
          padding: '10px',
          backgroundColor: '#F4F6F8',
        },
        borderBottom: {
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
        stackContainer: {
          flexDirection: 'column',
        },
        listContainer: { flexDirection: 'row', flexWrap: 'wrap' },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  item?: NexusGenObjects['NotePhysObj'];
  vitData?: NexusGenObjects['notesVitalObj'];
};

export default function NotePDFSoapObjective({ item, vitData }: Props) {
  // const document = _noteSoapList.filter((_) => _.id === item?.documentId)[0];
  // console.log('eeeeeh',vitData)
  const styles = useStyles();

  const HEARING_OPTIONS = [
    {
      label: 'Normal',
      option: item?.hearing === '1',
    },
    {
      label: 'Impaired',
      option: item?.hearing === '2',
    },
    {
      label: 'Hearing Aid',
      option: item?.hearing === '3',
    },
  ];

  const EXAMINATION = [
    {
      label: 'General Appearance/BMI',
      option: item?.bmi_status,
      comment: item?.bmi_comment || '-',
    },
    {
      label: 'Skin',
      option: item?.skin_status,
      comment: item?.skin_comment || '-',
    },
    {
      label: 'HEENT',
      option: item?.heent_status,
      comment: item?.heent_comment || '-',
    },
    {
      label: 'Teeth',
      option: item?.teeth_status,
      comment: item?.teeth_comment || '-',
    },
    {
      label: 'Neck',
      option: item?.neck_status,
      comment: item?.neck_comment || '-',
    },
    {
      label: 'Lungs',
      option: item?.lungs_status,
      comment: item?.lungs_comment || '-',
    },
    {
      label: 'Heart',
      option: item?.heart_status,
      comment: item?.heart_comment || '-',
    },
    {
      label: 'Abdomen',
      option: item?.abdomen_status,
      comment: item?.abdomen_comment || '-',
    },
    {
      label: 'GU System',
      option: item?.gusystem_status,
      comment: item?.gusystem_comment || '-',
    },
    {
      label: 'Musculoskeletal Functioning',
      option: item?.musculoskeletal_status,
      comment: item?.musculoskeletal_comment || '-',
    },
    {
      label: 'Back / Spine',
      option: item?.backspine_status,
      comment: item?.backspine_comment || '-',
    },
    {
      label: 'Neurological',
      option: item?.neurological_status,
      comment: item?.neurological_comment || '-',
    },
    {
      label: 'Psychiatric',
      option: item?.psychiatric_status,
      comment: item?.psychiatric_comment || '-',
    },
  ];

  return (
    <View style={[styles.mb8, styles.section]}>
      <Text style={[styles.h4, styles.mb8]}>Objective</Text>

      <View style={[styles.mb8, styles.gridContainer, styles.borderBottom, { gap: 15 }]}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Vitals:</Text>
        </View>

        <View style={[styles.col8, styles.gridContainer]}>
          <View style={styles.col5}>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Weight: </Text>
              {vitData?.wt || '-'} kg
            </Text>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Height: </Text>
              {vitData?.ht || '-'} cm
            </Text>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>BMI: </Text>
              {vitData?.bmi || '-'} kg/m2
            </Text>
          </View>

          <View style={styles.col5}>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>BP (mm): </Text>
              {vitData?.bp2 || '-'}
            </Text>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>BP (Hg): </Text>
              {vitData?.bp1 || '-'}
            </Text>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Oxygen Saturation: </Text>
              {vitData?.spo2 || '-'}%
            </Text>
          </View>

          <View style={styles.col5}>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Resp. Rate: </Text>
              {vitData?.bp2 || '-'} breathes/min
            </Text>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Heart Rate: </Text>
              {vitData?.bp1 || '-'} bpm
            </Text>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Temperature: </Text>
              {vitData?.bt || '-'}°C
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.mb8, styles.gridContainer, styles.borderBottom, { gap: 15 }]}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Vision:</Text>
        </View>

        <View style={[styles.col8, styles.gridContainer]}>
          <View style={styles.col4}>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Right: </Text>20/{item?.vision_r || '-'}
            </Text>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Left: </Text>20/{item?.vision_l || '-'}
            </Text>
          </View>

          <View style={styles.col8}>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Pupils: </Text>
              {item?.pupils === '1' ? '(⁄) Equal    (  ) Unequal' : '(  ) Equal    (⁄) Unequal'}
            </Text>
            <Text style={styles.body1}>
              <Text style={{ fontWeight: 700 }}>Lenses: </Text>
              {item?.glasses_lenses === '1' ? '(⁄) Yes    (  ) No' : '(  ) Yes    (⁄) No'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.mb8, styles.gridContainer, styles.borderBottom, { gap: 15 }]}>
        <View style={styles.col4}>
          <Text style={styles.overline}>Hearing:</Text>
        </View>

        <View style={[styles.col8, styles.gridContainer]}>
          {HEARING_OPTIONS.map((option) => (
            <View key={option.label} style={[styles.col4, { flexDirection: 'row' }]}>
              <Text style={{ width: '20%' }}>{option.option ? '(⁄)' : '(  )'}</Text>
              <Text style={[styles.body1, { width: '80%' }]}>{option.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.mb8, styles.borderBottom]}>
        <Text style={styles.overline}>Physical Examination:</Text>

        {EXAMINATION.map((exam) => (
          <View key={exam.label} style={[styles.gridContainer, { marginBottom: 5 }]}>
            <View style={styles.col4}>
              <Text style={[styles.caption, { fontWeight: 700 }]}>{exam.label}</Text>
              <Text style={styles.caption}>
                {exam.option === 'normal' && '(⁄) Normal    (  ) Abnormal'}
                {exam.option === 'abnormal' && '(  ) Normal    (⁄) Abnormal'}
                {exam.option === null && '(  ) Normal    (  ) Abnormal'}
              </Text>
            </View>

            <View style={styles.col8}>
              <Text style={styles.caption}>{exam.comment || '-'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View>
        <Text style={styles.overline}>Remarks</Text>
        {vitData?.remarks2?.map((remark: any, index: any) => (
          <Text key={remark} style={styles.body1}>
            {index + 1}. {remark}
          </Text>
        ))}
      </View>
    </View>
  );
}
