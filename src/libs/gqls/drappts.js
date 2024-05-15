import { gql } from '@apollo/client';

export const DR_APPTS = gql`
  query AllAppointments($data: AllAppointmentInputType!) {
    allAppointments(data: $data) {
      appointments_data {
        id
        voucherId
        patient_no
        e_time
        add_date
        doctorPayment {
          filename
          dp_id
          date
          dpDetails {
            acct
            title
            description
          }
        }
        patient_hmo {
          id
          patientID
          idno
          hmo
          member_id
          isDeleted
          hmoInfo {
            id
            name
          }
        }
        patientInfo {
          S_ID
          IDNO
          FNAME
          LNAME
          MNAME
          SUFFIX
          SEX
          HOME_ADD
          AGE
          userInfo {
            id
            uuid
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
        doctor_no
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_LNAME
          EMP_SUFFIX
          CONTACT_NO
          EMP_EMAIL
          FEES
          MEDCERT_FEE
          MEDCLEAR_FEE
          MEDABSTRACT_FEE
        }
        clinic
        date
        time_slot
        clinicInfo {
          id
          doctor_idno
          time_interval
          clinic_name
          clinicDPInfo {
            id
            filename
          }
        }
        appt_hmo_attachment {
          id
          patientID
          doctorID
          clinic
          appt_hmo_id
          patient
          doctor
          filename
          file_url
          file_size
          file_type
          date
          isDeleted
        }
        appt_payment_attachment {
          id
          patientID
          doctorID
          clinic
          appt_id
          patient
          doctor
          filename
          file_url
          file_size
          file_type
          date
          isDeleted
        }
        hmo_claims {
          id
          appt_id
          hmo
          claim_status
          member_name
          member_id
          doctor
          date_appt
          time_appt
          diagnosis_code
          diagnosis
          dispo_code
          disposition
          ver_code
          treatment
          approval_no
          c_email
          c_contact
          c_clinic
          c_caddress
          payment_type
          dateCreated
          export_stat
          isDeleted
        }
        type
        symptoms
        AddRequest
        Others
        payment_status
        status
      }
      total_records
      summary {
        total
        pending
        approved
        cancelled
        done
      }
    }
  }
`;

export const GET_APPT_TODAY = gql`
  query TodaysAPR($data: AllAppointmentInputType!) {
    todaysAPR(data: $data) {
      clinic_data {
        clinicDPInfo {
          doctor
        }
        clinic_name
        date
        location
      }
      totalAPR
    }
  }
`;

export const GET_APPT_TODAY_NEW = gql`
  query TodaysAPRNew($data: AllAppointmentInputType!) {
    todaysAPRNew(data: $data) {
      appointData {
        approved_count
        clinic_id
        clinicInfo {
          id
          location
          clinic_name
          Province
          uuid
          clinicDPInfo {
            id
            filename
            clinic
            doctor
            date
            doctorID
          }
        }
      }
      totalAPR
    }
  }
`;

export const doctor_appointments_by_id_data = gql`
  query AllAppointments_by_id($data: doctor_appointments_by_id_request!) {
    doctor_appointments_by_id_data(data: $data) {
      doctor_appointments_by_id {
        id
        voucherId
        remarks
        patient_no
        e_time
        doctorPayment {
          filename
          dp_id
          date
          dpDetails {
            acct
            title
            description
          }
        }
        patient_hmo {
          id
          patientID
          idno
          hmo
          member_id
          isDeleted
          hmoInfo {
            id
            name
          }
        }
        patientInfo {
          S_ID
          IDNO
          FNAME
          LNAME
          MNAME
          SUFFIX
          ACCUPATION
          EMAIL
          SEX
          HOME_ADD
          AGE
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
        doctor_no
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_LNAME
          EMP_SUFFIX
          CONTACT_NO
          EMP_EMAIL
          FEES
          MEDCERT_FEE
          MEDCLEAR_FEE
          MEDABSTRACT_FEE
          EMPID
        }
        doctor_no
        clinic
        userId
        date
        time_slot
        clinicInfo {
          id
          doctor_idno
          clinic_name
          uuid
          clinicDPInfo {
            id
            filename
          }
        }
        appt_hmo_attachment {
          id
          patientID
          doctorID
          clinic
          appt_hmo_id
          patient
          doctor
          filename
          file_url
          file_size
          file_type
          date
          isDeleted
        }
        appt_payment_attachment {
          id
          patientID
          doctorID
          clinic
          appt_id
          patient
          doctor
          filename
          file_url
          file_size
          file_type
          date
          isDeleted
        }
        hmo_claims {
          id
          appt_id
          hmo
          claim_status
          member_name
          member_id
          doctor
          date_appt
          time_appt
          diagnosis_code
          diagnosis
          dispo_code
          disposition
          ver_code
          treatment
          approval_no
          c_email
          c_contact
          c_clinic
          c_caddress
          payment_type
          dateCreated
          export_stat
          isDeleted
        }
        type
        AddRequest
        Others
        symptoms
        payment_status
        status
      }
    }
  }
`;

export const GET_QUEUES = gql`
  query QueueAll($data: QueueInputType!) {
    QueueAll(data: $data) {
      queue_data {
        patientInfo {
          FNAME
          LNAME
          UUID
          EMAIL
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
        time_slot
        payment_status
        status
        type
        id
      }
      total_records
      telemed
      face2face
    }
  }
`;
export const MUTATE_QUEUES = gql`
  mutation CreateDoctorAppointment($data: UpdateDoctor!) {
    CreateDoctorAppointment(data: $data) {
      message
      status
    }
  }
`;

export const DR_APPTS_byuuid = gql`
  query allAppointmentsbyUuid($data: AllAppointmentInputType!) {
    allAppointmentsbyUuid(data: $data) {
      appointments_data {
        id
        patient_no
        doctor_no
        clinic
        
        date
        time_slot
        add_date
        patientInfo {
          S_ID
          IDNO
          FNAME
          LNAME
          MNAME
          SUFFIX
          SEX
          HOME_ADD
          AGE
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_LNAME
          EMP_SUFFIX
          CONTACT_NO
          EMP_EMAIL
          FEES
          MEDCERT_FEE
          MEDCLEAR_FEE
          MEDABSTRACT_FEE
        }
        clinicInfo {
          id
          doctor_idno
          clinic_name
          clinicDPInfo {
            id
            filename
          }
        }
        appt_hmo_attachment {
          id
          patientID
          doctorID
          clinic
          appt_hmo_id
          patient
          doctor
          filename
          file_url
          file_size
          file_type
          date
          isDeleted
        }
        appt_payment_attachment {
          id
          patientID
          doctorID
          clinic
          appt_id
          patient
          doctor
          filename
          file_url
          file_size
          file_type
          date
          isDeleted
        }
        hmo_claims {
          id
          appt_id
          hmo
          claim_status
          member_name
          member_id
          doctor
          date_appt
          time_appt
          diagnosis_code
          diagnosis
          dispo_code
          disposition
          ver_code
          treatment
          approval_no
          c_email
          c_contact
          c_clinic
          c_caddress
          payment_type
          dateCreated
          export_stat
          isDeleted
        }
        type
        symptoms
        AddRequest
        Others
        payment_status
        status
      }
      total_records
      summary {
        total
        pending
        approved
        cancelled
        done
        telemedicine
        faceToFace
      }
    }
  }
`;

export const appointment_calendar = gql`
  query AllAppointmentsCalendar($data: calendar_doctor_appointment_request_input!) {
    query_all_appointment_calendar(data: $data) {
      calender_appointments_data {
        id
        patient_no
        patientInfo {
          S_ID
          IDNO
          FNAME
          LNAME
          MNAME
          SUFFIX
          SEX
          HOME_ADD
          AGE
          userInfo {
            id
            display_picture {
              id
              userID
              idno
              filename
            }
          }
        }
        doctor_no
        doctorInfo {
          EMP_ID
          EMP_FULLNAME
          EMP_FNAME
          EMP_MNAME
          EMP_LNAME
          EMP_SUFFIX
          CONTACT_NO
          EMP_EMAIL
          FEES
          MEDCERT_FEE
          MEDCLEAR_FEE
          MEDABSTRACT_FEE
        }
        clinic
        date
        time_slot
        clinicInfo {
          id
          doctor_idno
          clinic_name
          clinicDPInfo {
            id
            filename
          }
        }
        appt_hmo_attachment {
          id
          patientID
          doctorID
          clinic
          appt_hmo_id
          patient
          doctor
          filename
          file_url
          file_size
          file_type
          date
          isDeleted
        }
        appt_payment_attachment {
          id
          patientID
          doctorID
          clinic
          appt_id
          patient
          doctor
          filename
          file_url
          file_size
          file_type
          date
          isDeleted
        }
        hmo_claims {
          id
          appt_id
          hmo
          claim_status
          member_name
          member_id
          doctor
          date_appt
          time_appt
          diagnosis_code
          diagnosis
          dispo_code
          disposition
          ver_code
          treatment
          approval_no
          c_email
          c_contact
          c_clinic
          c_caddress
          payment_type
          dateCreated
          export_stat
          isDeleted
        }
        type
        symptoms
        AddRequest
        Others
        payment_status
        status
      }
      total_records
    }
  }
`;

export const BOOK_POST = gql`
  mutation BOOK_POST($data: BookingObjInputType!, $file: Upload) {
    BookAppointment(data: $data, file: $file) {
      id
      clinic
      time_slot
      symptoms
      type
      status
      patientID
      doctorID
      date
      add_date
      AddRequest
    }
  }
`;
export const UpdateAppointmentM = gql`
  mutation UpdateAppointmentM($data: AppointmentUpdateMultitple!) {
    UpdateAppointmentM(data: $data) {
      message
    }
  }
`;
