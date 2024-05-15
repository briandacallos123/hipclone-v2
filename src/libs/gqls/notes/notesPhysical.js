import { gql } from '@apollo/client';

export const get_note_physical = gql`
  query getOnePhysNotes($data: NotePhysObjInputType!) {
    QueryNotePhys(data: $data) {
      abdomen_comment
      abdomen_status
      backspine_comment
      backspine_status
      bmi_status
      clinic
      bmi_comment
      doctorID
      date
      glasses_lenses
      gusystem_comment
      gusystem_status
      hearing
      heart_comment
      heart_status
      heent_comment
      heent_status
      id
      lungs_comment
      lungs_status
      musculoskeletal_comment
      musculoskeletal_status
      neck_comment
      neck_status
      neurological_comment
      neurological_status
      patientID
      psychiatric_comment
      psychiatric_status
      pupils
      report_id
      skin_comment
      skin_status
      teeth_comment
      teeth_status
      vision_l
      vision_r
    }
  }
`;
