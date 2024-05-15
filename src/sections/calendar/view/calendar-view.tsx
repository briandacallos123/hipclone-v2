'use client';

import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import { EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
//
import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// redux
import { useDispatch } from 'src/redux/store';
import { getEvents } from 'src/redux/slices/calendar';
// types
import { ICalendarFilters, ICalendarFilterValue } from 'src/types/calendar';
// utils
import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
import { isDateError } from 'src/components/custom-date-range-picker';
//
import { AppointmentDetailsView } from 'src/sections/appointment/view';
import { useCalendar } from '../hooks';
import { StyledCalendar } from '../styles';
import CalendarToolbar from '../calendar-toolbar';
import CalendarFilters from '../calendar-filters';
import CalendarFiltersResult from '../calendar-filters-result';

// ----------------------------------------------------------------------

// const defaultFilters = {
//   status: -1,
//   startDate: null,
//   endDate: null,
// };

function useInitial() {
  const dispatch = useDispatch();

  const getEventsCallback = useCallback(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    getEventsCallback();
  }, [getEventsCallback]);

  return null;
}

// ----------------------------------------------------------------------

export default function CalendarView() {
  useInitial();

  const settings = useSettingsContext();

  const smUp = useResponsive('up', 'sm');

  const openFilters = useBoolean();
  const {
    calendarRef,
    //
    filters,
    view,
    date,
    events,
    currentEventId,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onChangeView,
    onClickEvent,
    onInitialView,
    //
    openModal,
    onCloseModal,
    //
    handleFilters,
    handleResetFilters,
    //
    onClickEventInFilters,
    handleChangeYear,
  } = useCalendar();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDisplayedYear = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const views = calendarApi.view;
      if (views) {
        const start = views.activeStart;
        if (start) {
          return start.getFullYear();
        }
      }
    }
    return null;
  };

  // Use useEffect to log the currently displayed year when the component renders
  useEffect(() => {
    const year = getDisplayedYear();
    if (year !== null) {
      // console.log(`Currently displayed year: ${year}`);
      handleChangeYear(year);
    }
  }, [getDisplayedYear, handleChangeYear]);

  // const [filters, setFilters]:any = useState(defaultFilters);

  const dateError = isDateError(filters.startDate, filters.endDate);

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const canReset = !!filters.startDate && !!filters.endDate;
  console.log(filters.status);
  const dataFiltered = applyFilter({
    inputData: events,
    filters,
    dateError,
  });

  const renderResults = (
    <CalendarFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

  //  open={openModal.value}
  //       onClose={onCloseModal}
  //       id={currentEventId}

  // console.log(openModal.value);
  console.log(currentEventId, 'PAYLOADDD');

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography
          variant="h5"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Calendar
        </Typography>

        {canReset && renderResults}

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
              onOpenFilters={openFilters.onTrue}
            />

            <FullCalendar
              weekends
              selectable
              rerenderDelay={10}
              allDayMaintainDuration
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              headerToolbar={false}
              eventClick={onClickEvent}
              height={smUp ? 720 : 'auto'}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      {currentEventId && <AppointmentDetailsView
        refetch={() => {
          console.log('Test');
        }}
        updateRow={() => {
          console.log('Test');
        }}
        refetchToday={() => {
          console.log('Fetching..');
        }}
        open={openModal.value}
        onClose={onCloseModal}
        id={currentEventId}
      />}

      <CalendarFilters
        open={openFilters.value}
        onClose={openFilters.onFalse}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        canReset={canReset}
        onResetFilters={handleResetFilters}
        //
        dateError={dateError}
        //
        events={events}
        onClickEvent={onClickEventInFilters}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  dateError,
}: {
  inputData: EventInput[];
  filters: ICalendarFilters;
  dateError: boolean;
}) {
  if (!inputData) return [];

  return inputData;
}
