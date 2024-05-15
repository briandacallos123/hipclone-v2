import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import { useState, useCallback, useRef, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _appointmentList } from 'src/_mock';

// types
import { ICalendarView } from 'src/types/calendar';
import { useLazyQuery } from '@apollo/client';
import { appointment_calendar } from '@/libs/gqls/drappts';
import { usePathname } from 'src/routes/hook';
// ----------------------------------------------------------------------

const defaultFilters = {
  status: -1,
  startDate: null,
  endDate: null,
};

export default function useCalendar() {
  // const calendarRef = useRef(null);

  // Function to get the currently displayed year
  const pathname = usePathname();
  const [isPatient, setIspatient] = useState(true);

  useEffect(() => {
    if (pathname.includes('user')) {
      setIspatient(true);
    } else {
      setIspatient(false);
    }
  }, [pathname]);

  const theme = useTheme();
  const [filters, setFilters]: any = useState(defaultFilters);
  const [tableData, setTableData] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [yearData, setYearData] = useState();
  console.log('yearData', yearData);

  const handleFilters = useCallback((status: string, value: any) => {
    setFilters((prevState: any) => ({
      ...prevState,
      [status]: value,
    }));
  }, []);

  const handleChangeYear = useCallback((value: any) => {
    setYearData(value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const [getData, { data, loading }]: any = useLazyQuery(appointment_calendar, {
    context: {
      requestTrackerId: 'calendar_doctor_appointments[calendar_doctor_appointment_request_input]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    getData({
      variables: {
        // payload request
        data: {
          status: filters?.status,
          startDate: filters?.startDate || null,
          endDate: filters?.endDate || null,
          currentYear: Number(yearData),
        },
      },
    }).then(async (result: any) => {
      const { data } = result;
      if (data) {
        const { query_all_appointment_calendar } = data;
        setTableData(query_all_appointment_calendar?.calender_appointments_data);
        setTotalRecords(query_all_appointment_calendar?.total_records);
      }
    });
  }, [filters?.endDate, filters?.startDate, filters?.status, getData, yearData]);

  const colors = (item: any) => {
    if (item === 0) return theme.palette.warning.main; // pending
    if (item === 1) return theme.palette.info.main; // approved
    if (item === 2) return theme.palette.success.main; // canceled
    if (item === 3) return theme.palette.error.main; // canceled
    return theme.palette.success.main;
  };

  const calendarRef = useRef<FullCalendar>(null);

  const calendarEl = calendarRef.current;

  const smUp = useResponsive('up', 'sm');

  const [date, setDate] = useState(new Date());

  const openModal = useBoolean();

  const [currentEventId, setCurrentEventId] = useState<string>('');

  const [view, setView] = useState<ICalendarView>(smUp ? 'dayGridMonth' : 'listWeek');

  const formatDateTime = (dateString: string, timeString: string) => {
    const dateParts = dateString.split('-');
    const timeParts = timeString.split(':');

    // Extract year, month, day, hour, minute, and second components
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed
    const day = parseInt(dateParts[2], 10);
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const second = parseInt(timeParts[2], 10);

    const formattedDate = new Date(year, month, day, hour, minute, second);

    return formattedDate; // Returns the formatted date as a Date object
  };

  // const dateString = tableData[index]?.date;
  // const timeString = tableData[index]?.time_slot;
  // const formattedDate = formatDateTime(dateString, timeString);

  const eventData = [...Array(totalRecords)].map((_, index) => {
    const dateString = tableData[index]?.date;
    const timeString = tableData[index]?.time_slot;
    const formattedDate = formatDateTime(dateString, timeString);

    return {
      id: tableData[index]?.id,
      // payload:tableData[index],
      title: tableData[index]?.clinicInfo?.clinic_name,
      start: formattedDate,
      // start: _appointmentList[index]?.schedule,
      // start: tableData[index]?.date,
      status: tableData[index]?.status,
      color: colors(tableData[index]?.status),
    };
  });

  // const eventData = [...Array(_appointmentList.length)].map((_, index) => ({
  //   id: _appointmentList[index].id,
  //   title: _appointmentList[index].hospital.name,
  //   start: _appointmentList[index].schedule,
  //   status: _appointmentList[index].status,
  //   color: colors(_appointmentList[index].status),
  // }));

  const events = eventData.map((event) => ({
    ...event,
    textColor: event.color,
  }));

  const onOpenModal = useCallback(() => {
    openModal.onTrue();
  }, [openModal]);

  const onCloseModal = useCallback(() => {
    openModal.onFalse();
  }, [openModal]);

  const onInitialView = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      const newView = smUp ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [calendarEl, smUp]);

  const onChangeView = useCallback(
    (newView: ICalendarView) => {
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();

        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    [calendarEl]
  );

  const onDateToday = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onDatePrev = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onDateNext = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onClickEvent = useCallback(
    (arg: EventClickArg) => {
      // alert('Test');
      // console.log(arg?.event, 'DATA@@@');
      // alert(arg?.event?.id)

      const data = tableData?.find((i: any) => Number(i?.id) === Number(arg.event.id));

      onOpenModal();
      setCurrentEventId(data);
    },
    [onOpenModal]
  );

  const onClickEventInFilters = useCallback(
    (eventId: string) => {
      if (eventId) {
        onOpenModal();
        setCurrentEventId(eventId);
      }
    },
    [onOpenModal]
  );

  return {
    calendarRef,
    //
    view,
    date,
    events,
    currentEventId,
    filters,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onChangeView,
    onInitialView,
    onClickEvent,
    //
    openModal,
    onOpenModal,
    onCloseModal,
    //
    handleFilters,
    handleResetFilters,
    handleChangeYear,
    //
    onClickEventInFilters,
  };
}
