'use client';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// utils
import { fDate } from 'src/utils/format-time';
//
import Scrollbar from 'src/components/scrollbar';
import { useResponsive } from 'src/hooks/use-responsive';
import VitalChart from '../vital-chart';

// ----------------------------------------------------------------------

type Props = {
  items: any;
  loading?: boolean;
  isDashboard?: any;
  addedCategory?: any;
  items2: any;
  refetch?: any;
  openSingle?: any;
  refetchP2?: any;
};

export default function VitalView({
  refetchP2,
  refetch,
  openSingle,
  items2,
  items,
  loading,
  isDashboard,
  addedCategory,
}: Props) {
  const upMd = useResponsive('up', 'md');

  //  ---------------------------------------------

  let weightData = items
    ?.filter((item: any) => item?.wt !== '0' && item?.wt)
    ?.map((item) => {
      return {
        data: item?.wt,
        id: item?.id,
      };
    });

  const weightDataDateNoFormat = items
    ?.filter((item: any) => item?.wt !== '0' && item?.wt)
    ?.map((item) => item?.date);

  const weightDataDate = items
    ?.filter((item: any) => item?.wt !== '0' && item?.wt)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  if (weightData?.length === 1) {
    weightData.unshift({
      data: '0',
      id: 0,
    });
    weightDataDate.unshift(weightDataDate[0]);
  }

  //  ---------------------------------------------

  const weightArray = items
    ?.filter((item: any) => item?.wt !== '0' && item?.wt)
    ?.map((item) => item?.wt);

  const emptyWeight = weightArray.length <= 0;


  // --------------------------------

  const HeightData = items
    ?.filter((item: any) => item?.ht !== '0' && item?.ht)
    ?.map((item) => {
      return {
        data: item?.ht,
        id: item?.id,
      };
    });

  const HeightDataDate = items
    ?.filter((item: any) => item?.ht !== '0' && item?.ht)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  const HeightDataDateNoFormat = items
    ?.filter((item: any) => item?.ht !== '0' && item?.ht)
    ?.map((item) => item?.date);


  const heightArray = items
    ?.filter((item: any) => item?.ht !== '0' && item?.ht)
    ?.map((item) => item?.ht);

  if (HeightData?.length === 1) {
    HeightData.unshift({
      data: '0',
      id: 0,
    });
    HeightDataDate.unshift(HeightDataDate[0]);
  }


  const emptyHeight = heightArray.length <= 0;


  // --------------------------------

  const BMIData = items
    ?.filter((item: any) => item?.bmi !== '0.00' && item?.bmi !== '0' && item?.bmi)
    ?.map((item) => {
      return {
        data: item?.bmi,
        id: item?.id,
      };
    });

  const BMIArray = items
    ?.filter((item: any) => item?.bmi !== '0.00' && item?.bmi !== '0' && item?.bmi)
    ?.map((item) => item?.bmi);

  const emptyBMI = BMIArray.length <= 0;

  const BMIDataDate = items
    ?.filter((item: any) => item?.bmi !== '0.00' && item?.bmi !== '0' && item?.bmi)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  const BMIDataDateNoFormat = items
    ?.filter((item: any) => item?.bmi !== '0.00' && item?.bmi !== '0' && item?.bmi)
    ?.map((item) => item?.date);


  if (BMIData?.length === 1) {
    BMIData.unshift({
      data: '0',
      id: 0,
    });
    BMIDataDate.unshift(BMIDataDate[0]);
  }

  // --------------------------------


  const BP1Data = items
    ?.filter((item: any) => item?.bp1 !== '0' && item?.bp1)
    ?.map((item) => {
      return {
        data: item?.bp1,
        id: item?.id,
      };
    });

  const BP1Array = items
    ?.filter((item: any) => item?.bp1 !== '0' && item?.bp1)
    ?.map((item) => item?.bp1);

  const emptyBP1 = BP1Array.length <= 0;

  const BP1DataDate = items
    ?.filter((item: any) => item?.bp1 !== '0' && item?.bp1)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  const BP1DataDateNoFormat = items
    ?.filter((item: any) => item?.bp1 !== '0' && item?.bp1)
    ?.map((item) => item?.date);

  if (BP1Data?.length === 1) {
    BP1Data.unshift({
      data: '0',
      id: 0,
    });
    BP1DataDate.unshift(BP1DataDate[0]);
  }

  // --------------------------------


  const BP2Data = items
    ?.filter((item: any) => item?.bp2 !== '0' && item?.b2 !== '0.00' && item?.bp2)
    ?.map((item) => {
      return {
        data: item?.bp2,
        id: item?.id,
      };
    });

  const BP2Array = items
    ?.filter((item: any) => item?.bp2 !== '0' && item?.b2 !== '0.00' && item?.bp2)
    ?.map((item) => item?.bp2);

  const emptyBP2 = BP2Array.length <= 0;

  const BP2DataDate = items
    ?.filter((item: any) => item?.bp2 !== '0' && item?.bp2)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  const BP2DataDateNoFormat = items
    ?.filter((item: any) => item?.bp2 !== '0' && item?.bp2)
    ?.map((item) => item?.date);


  // --------------------------------
  const OxygenData = items
    ?.filter((item: any) => item?.spo2 !== '0' && item?.spo2)
    ?.map((item) => {
      return {
        data: item?.spo2,
        id: item?.id,
      };
    });


  const OxygenArray = items
    ?.filter((item: any) => item?.spo2 !== '0' && item?.spo2)
    ?.map((item) => item?.spo2);

  const emptyOxygen = OxygenArray.length <= 0;

  const OxygenDataDate = items
    ?.filter((item: any) => item?.spo2 !== '0' && item?.spo2)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  const OxygenDataDateNoFormat = items
    ?.filter((item: any) => item?.spo2 !== '0' && item?.spo2)
    ?.map((item) => item?.date);

  if (OxygenData?.length === 1) {
    OxygenData.unshift({
      data: '0',
      id: 0,
    });
    OxygenDataDate.unshift(OxygenDataDate[0]);
  }

  // --------------------------------

  const HeartRateData = items
    ?.filter((item: any) => item?.hr !== '0' && item?.hr)
    ?.map((item) => {
      return {
        data: item?.hr,
        id: item?.id,
      };
    });

  const HeartRateArray = items
    ?.filter((item: any) => item?.hr !== '0' && item?.hr)
    ?.map((item) => item?.hr);

  const emptyHeartRate = HeartRateArray.length <= 0;

  const HeartRateDataDate = items
    ?.filter((item: any) => item?.hr !== '0' && item?.hr)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  const HeartRateDataDateNoFormat = items
    ?.filter((item: any) => item?.hr !== '0' && item?.hr)
    ?.map((item) => item?.date);

  if (HeartRateData?.length === 1) {
    HeartRateData.unshift({
      data: '0',
      id: 0,
    });
    HeartRateDataDate.unshift(HeartRateDataDate[0]);
  }


  // --------------------------------


  const RespData = items
    ?.filter((item: any) => item?.rr !== '0' && item?.rr)
    ?.map((item) => {
      return {
        data: item?.rr,
        id: item?.id,
      };
    });

  const RespArray = items
    ?.filter((item: any) => item?.rr !== '0' && item?.rr)
    ?.map((item) => item?.rr);

  const emptyResp = RespArray.length <= 0;

  const RespDataDate = items
    ?.filter((item: any) => item?.rr !== '0' && item?.rr)
    ?.map((item) => fDate(item?.date, 'MMM dd'));
  const RespDataDateNoFormat = items
    ?.filter((item: any) => item?.rr !== '0' && item?.rr)
    ?.map((item) => item?.date);

  if (RespData?.length === 1) {
    RespData.unshift({
      data: '0',
      id: 0,
    });
    RespDataDate.unshift(RespDataDate[0]);
  }

  // --------------------------------

  const TempData = items
    ?.filter((item: any) => item?.bt !== '0' && item?.bt)
    ?.map((item) => {
      return {
        data: item?.bt,
        id: item?.id,
      };
    });

  const TempArray = items
    ?.filter((item: any) => item?.bt !== '0' && item?.bt)
    ?.map((item) => item?.bt);

  const emptyTemp = TempArray.length <= 0;

  const TempDataDate = items
    ?.filter((item: any) => item?.bt !== '0' && item?.bt)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  const TempDataDateNoFormat = items
    ?.filter((item: any) => item?.bt !== '0' && item?.bt)
    ?.map((item) => item?.date);

  if (TempData?.length === 1) {
    TempData.unshift({
      data: '0',
      id: 0,
    });
    TempDataDate.unshift(TempDataDate[0]);
  }


  // --------------------------------

  const SugarMonitoringData = items
    ?.filter((item: any) => item?.bsm !== '0' && item?.bsm)
    ?.map((item) => {
      return {
        data: item?.bsm,
        id: item?.id,
      };
    });

  const SugarMonitoringArray = items
    ?.filter((item: any) => item?.bsm !== '0' && item?.bsm)
    ?.map((item) => item?.bsm);

  const emptySugarMonitoring = SugarMonitoringArray.length <= 0;

  const SugarMonitoringDataDate = items
    ?.filter((item: any) => item?.bsm !== '0' && item?.bsm)
    ?.map((item) => fDate(item?.date, 'MMM dd'));

  const SugarMonitoringDataDateNoFormat = items
    ?.filter((item: any) => item?.bsm !== '0' && item?.bsm)
    ?.map((item) => item?.date);

    if (SugarMonitoringData?.length === 1) {
      SugarMonitoringData.unshift({
        data: '0',
        id: 0,
      });
      SugarMonitoringDataDate.unshift(SugarMonitoringDataDate[0]);
    }
  

  // --------------------------------


  const dataDate = items?.map((item: any) => item?.date || new Date());
  const categories = dataDate?.filter((_: any) => `${fDate(_, 'MMM dd')}`);

  let newData: any = [];

  console.log('items????', items);

  items2?.forEach((val: any) => {
    if (newData.length === 0) {
      const vitalDataArr = [];
      const vitalDateArr = [];
      const vitalDateArrNoFormat = [];

      vitalDataArr.push(val.value);
      vitalDateArr.push(fDate(val.createdAt));
      vitalDateArrNoFormat.push(val.createdAt);

      const payload = {
        title: val?.vital_category?.title,
        measuring_unit: val?.vital_category?.measuring_unit,
        measuring_id: val?.categoryId,
        dateCreated: val?.createdAt,
        id: val?.id,
        date: vitalDateArr,
        data: vitalDataArr,
        dateNoFormat: vitalDateArrNoFormat,
      };

      newData.push(payload);
    } else {
      const allTitles = newData?.map((item) => item.title);

      if (allTitles.includes(val?.vital_category?.title)) {
        const index = newData.findIndex((item) => item.title === val?.vital_category?.title);
        if (index !== -1) {
          newData[index].data.push(val.value);
          newData[index].date.push(fDate(val.createdAt));
          newData[index].dateNoFormat.push(val.createdAt);
        }
      } else {
        const vitalDataArr = [];
        const vitalDateArr = [];
        const vitalDateArrNoFormat = [];

        vitalDataArr.push(val.value);
        vitalDateArr.push(fDate(val.createdAt));
        vitalDateArrNoFormat.push(val.createdAt);

        const payload = {
          title: val?.vital_category?.title,
          data: vitalDataArr,
          id: val?.id,
          dateCreated: val?.createdAt,
          measuring_unit: val?.vital_category?.measuring_unit,
          measuring_id: val?.categoryId,
          date: vitalDateArr,
          dateNoFormat: vitalDateArrNoFormat,
        };
        newData.push(payload);
      }
    }
  });

  // console.log(newData, 'newdaataaa');

  // newData = newData?.map((item)=>{
  //   const newDate = item?.date?.map((item)=>{
  //     const data = item?.split(" ");
  //     const month = data[1];
  //     const day = data[0];
  //     return `${month} ${day}`
  //   });
  //   console.log(newDate)
  //   return {...item, date:newDate}
  // })
  // console.log(categories,'dataDatedataDatedataDatedataDate_______________________________________________')

  // console.log(newData,'AHEHEHEHEEEEEEEEEE_______________________________________________')

  // [2]?.forEach((item)=>{

  // })

  // const vitalsDynamicData = items2?.map((item)=>{
  //   const payload = {
  //     title:"",
  //     data:[]
  //   }

  // })

  // console.log(newData,'WAWAWIIIIIIIII@@@@@@@@@@@@@@@@@@@@@@@@@@______________')

  // console.log('itemsTemp++++++++++++++++', emptyWeight);
  // console.log('itemsTemp++++++++++++++++', emptyTemp);


  return (
    <>
      {!isDashboard ? (
        <Box
          sx={{
            display: 'grid',
            columnGap: { md: 2, xs: 1 },
            rowGap: { md: 3, xs: 1 },
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
          }}
        >
          <VitalChart
            title="Weight"
            emptyCondition={emptyWeight}
            refetch={refetch}
            subheader="by kilogram"
            chart={{
              categories: [...weightDataDate],
              data: [{ name: 'kg', data: weightData?.map((item) => item?.data) }],
            }}
            list={[...Array(weightDataDate?.length)].map((_, index) => ({
              value: `${weightData[index]?.data
                } kg`,
              date: weightDataDate[index],
              id: weightData[index]?.id,
              category: 'wt',
              dataDate: weightDataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'weight',
                type: 'number',
                label: 'Weight',
                placeholder: '0',
                adornment: 'kg',
              });
            }}
          />

          <VitalChart
            title="Height"
            subheader="by centimeter"
            emptyCondition={emptyHeight}
            refetch={refetch}
            chart={{
              categories: [...HeightDataDate],
              data: [{ name: 'cm', data: HeightData?.map((item) => item?.data) }],
            }}
            list={[...Array(HeightDataDate?.length)].map((_, index) => ({
              value: `${HeightData[index]?.data} cm`,
              date: HeightDataDate[index],
              id: HeightData[index]?.id,
              category: 'ht',
              dataDate: HeightDataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'height',
                type: 'number',
                label: 'Height',
                placeholder: '0',
                adornment: 'cm',
              });
            }}
          />

          <VitalChart
            title="Body Mass Index"
            subheader="by kg/m2"
            emptyCondition={emptyBMI}
            refetch={refetch}
            chart={{
              categories: [...BMIDataDate],
              data: [{ name: 'bmi', data: BMIData?.map((item) => item?.data) }],
            }}
            list={[...Array(BMIDataDate?.length)].map((_, index) => ({
              value: `${BMIData[index]?.data} bmi`,
              date: BMIDataDate[index],
              id: BMIData[index]?.id,
              category: 'bmi',
              dataDate: BMIDataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'bmi',
                type: 'number',
                label: 'Body Mass Index',
                placeholder: '0.00',
                adornment: 'kg/m2',
              });
            }}
          />

          <VitalChart
            title="Blood Pressure"
            subheader="by mm/Hg"
            refetch={refetch}
            emptyCondition={emptyBP1 || emptyBP2}
            chart={{
              categories: [...BP1DataDate],
              data: [
                { name: 'mm', data: BP1Data?.map((item) => item?.data) },
                { name: 'Hg', data: BP2Data?.map((item) => item?.data) },
              ],
            }}
            list={[...Array(BP1Data?.length)].map((_, index) => ({
              value: `${BP1Data[index]?.data}mm / ${BP2Data[index]?.data}Hg`,
              date: BP1DataDate[index],
              id: BP1Data[index]?.id,
              category: 'bp',
              dataDate: BP1DataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'bloodPresMM',
                type: 'number',
                label: 'Blood Pressure (mm)',
                placeholder: '0',
                adornment: 'mm/Hg',
              });
            }}
          />

          <VitalChart
            title="Oxygen Saturation"
            refetch={refetch}
            emptyCondition={emptyOxygen}
            subheader="by percentage"
            chart={{
              categories: [...OxygenDataDate],
              data: [{ name: 'percentage', data: OxygenData?.map((item) => item?.data) }],
            }}
            list={[...Array(OxygenData?.length)].map((_, index) => ({
              value: `${OxygenData[index]?.data}%`,
              date: OxygenDataDate[index],
              id: OxygenData[index]?.id,
              category: 'spo2',
              dataDate: OxygenDataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'oxygen',
                type: 'number',
                label: 'Oxygen Saturation',
                placeholder: '0',
                adornment: '%',
              });
            }}
          />

          <VitalChart
            title="Respiratory Rate"
            emptyCondition={emptyResp}
            refetch={refetch}
            subheader="by breathes per minutes "
            chart={{
              categories: [...RespDataDate],
              data: [{ name: 'bpm', data: RespData?.map((item: any) => item?.data) }],
            }}
            list={[...Array(RespDataDate?.length)].map((_, index) => ({
              value: `${RespData[index]?.data} bpm`,
              date: RespDataDate[index],
              id: RespData[index]?.id,
              category: 'rr',
              dataDate: RespDataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'respRate',
                type: 'number',
                label: 'Respiratory Rate',
                placeholder: '0',
                adornment: 'breathes/min',
              });
            }}
          />

          <VitalChart
            title="Heart Rate"
            emptyCondition={emptyHeartRate}
            subheader="by beats per minutes"
            refetch={refetch}
            chart={{
              categories: [...HeartRateDataDate],
              data: [{ name: 'bpm', data: HeartRateData?.map((item) => item?.data) }],
            }}
            list={[...Array(HeartRateDataDate?.length)].map((_, index) => ({
              value: `${HeartRateData[index]?.data} bpm`,
              date: HeartRateDataDate[index],
              id: HeartRateData[index]?.id,
              category: 'hr',
              dataDate: HeartRateDataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'heartRate',
                type: 'number',
                label: 'Heart Rate',
                placeholder: '0',
                adornment: 'bpm',
              });
            }}
          />

          <VitalChart
            title="Body Temperature"
            emptyCondition={emptyTemp}
            refetch={refetch}
            subheader="by Celcius"
            chart={{
              categories: [...TempDataDate],
              data: [{ name: 'Celcius', data: TempData?.map((item) => item?.data) }],
            }}
            list={[...Array(TempData?.length)].map((_, index) => ({
              value: `${TempData[index]?.data} °C`,
              date: TempDataDate[index],
              id: TempData[index]?.id,
              category: 'bt',
              dataDate: TempDataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'bodyTemp',
                type: 'number',
                label: 'Body Temperature',
                placeholder: '0',
                adornment: 'bpm',
              });
            }}
          />

          <VitalChart
            emptyCondition={emptySugarMonitoring}
            title="Blood Sugar Monitoring"
            subheader="by Percentage"
            refetch={refetch}
            chart={{
              categories: [...SugarMonitoringDataDate],
              data: [{ name: 'Percentage', data: SugarMonitoringData?.map((item) => item?.data) }],
            }}
            list={[...Array(SugarMonitoringDataDate?.length)].map((_, index) => ({
              value: `${SugarMonitoringData[index]?.data} %`,
              date: SugarMonitoringDataDate[index],
              id: SugarMonitoringData[index]?.id,
              category: 'bsm',
              dataDate: SugarMonitoringDataDateNoFormat[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
            createNew={() => {
              openSingle({
                name: 'bsm',
                type: 'number',
                label: 'Blood Sugar Monitoring',
                placeholder: '0',
                adornment: '%',
              });
            }}
          />

          {newData?.map((item: any) => (
            <VitalChart
              title={item?.title}
              refetch={refetchP2}
              subheader={`by ${item?.measuring_unit}`}
              chart={{
                categories: item?.date?.map((item: any) => fDate(item, 'MMM dd')),
                data: [{ name: 'Celcius', data: item?.data }],
              }}
              list={[...Array(item?.dateNoFormat?.length)].map((_, index) => ({
                value: `${item?.data[index]} ${item?.measuring_unit}`,
                date: item?.dateNoFormat[index],
                id: item?.id,
                category: item?.measuring_id,
                dataDate: item?.dateCreated,
              }))}
              loading={loading}
              isDashboard={isDashboard}
              createNew={() => {
                openSingle({
                  name: item?.title,
                  type: 'number',
                  label: item?.title,
                  placeholder: '0',
                  adornment: item?.measuring_unit,
                  new: true,
                });
              }}
            />
          ))}
        </Box>
      ) : (
        // for dashboard --------------------------------------------------------------------------------------------------------------------
        <Stack sx={{ height: 'auto', width: '100%' }}>
          <Scrollbar>
            <Box
              sx={{
                display: 'grid',
                columnGap: { md: 1, xs: 1 },
                rowGap: { md: 1, xs: 1 },
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
              }}
            >
              <VitalChart
                title="Weight"
                emptyCondition={emptyWeight}
                subheader="by kilogram"
                chart={{
                  categories: [...weightDataDate],
                  data: [{ name: 'kg', data: weightData?.map((item) => item?.data) }],
                }}
                list={[...Array(weightDataDate?.length)].map((_, index) => ({
                  value: `${weightData[index]?.data} kg`,
                  date: weightDataDate[index],
                  id: weightData[index]?.id,
                  category: 'wt',
                  dataDate: weightDataDateNoFormat[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
                createNew={() => {
                  openSingle({
                    name: 'weight',
                    type: 'number',
                    label: 'Weight',
                    placeholder: '0',
                    adornment: 'kg',
                  });
                }}
              />

              <VitalChart
                title="Height"
                emptyCondition={emptyHeight}
                subheader="by centimeter"
                chart={{
                  categories: [...HeightDataDate],
                  data: [{ name: 'cm', data: HeightData }],
                }}
                list={[...Array(HeightData?.length)].map((_, index) => ({
                  value: `${HeightData[index]} cm`,
                  date: HeightDataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
                createNew={() => {
                  openSingle({
                    name: 'height',
                    type: 'number',
                    label: 'Height',
                    placeholder: '0',
                    adornment: 'cm',
                  });
                }}
              />

              <VitalChart
                title="Body Mass Index"
                emptyCondition={emptyBMI}
                subheader="by kg/m2"
                chart={{
                  categories: [...BMIDataDate],
                  data: [{ name: 'bmi', data: BMIData }],
                }}
                list={[...Array(BMIData?.length)].map((_, index) => ({
                  value: `${BMIData[index]} bmi`,
                  date: BMIDataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
                createNew={() => {
                  openSingle({
                    name: 'bmi',
                    type: 'number',
                    label: 'Body Mass Index',
                    placeholder: '0.00',
                    adornment: 'kg/m2',
                  });
                }}
              />

              <VitalChart
                emptyCondition={emptyBP1 || emptyBP2}
                title="Blood Pressure"
                subheader="by mm/Hg"
                chart={{
                  categories: [...BP1DataDate],
                  data: [
                    { name: 'mm', data: BP1Data },
                    { name: 'Hg', data: BP2Data },
                  ],
                }}
                list={[...Array(BP1Data?.length)].map((_, index) => ({
                  value: `${BP1Data[index]}mm / ${BP2Data[index]}Hg`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
                createNew={() => {
                  openSingle({
                    name: 'bloodPresMM',
                    type: 'number',
                    label: 'Blood Pressure (mm)',
                    placeholder: '0',
                    adornment: 'mm/Hg',
                  });
                }}
              />

              <VitalChart
                title="Oxygen Saturation"
                subheader="by percentage"
                emptyCondition={emptyOxygen}
                chart={{
                  categories: [...OxygenDataDate],
                  data: [{ name: 'percentage', data: OxygenData }],
                }}
                list={[...Array(OxygenData?.length)].map((_, index) => ({
                  value: `${OxygenData[index]}%`,
                  date: OxygenDataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
                createNew={() => {
                  openSingle({
                    name: 'oxygen',
                    type: 'number',
                    label: 'Oxygen Saturation',
                    placeholder: '0',
                    adornment: '%',
                  });
                }}
              />

              <VitalChart
                title="Respiratory Rate"
                subheader="by breathes per minutes "
                emptyCondition={emptyResp}
                chart={{
                  categories: [...RespDataDate],
                  data: [{ name: 'bpm', data: RespData }],
                }}
                list={[...Array(RespData?.length)].map((_, index) => ({
                  value: `${RespData[index]} bpm`,
                  date: RespDataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
                createNew={() => {
                  openSingle({
                    name: 'respRate',
                    type: 'number',
                    label: 'Respiratory Rate',
                    placeholder: '0',
                    adornment: 'breathes/min',
                  });
                }}
              />

              <VitalChart
                title="Heart Rate"
                subheader="by beats per minutes"
                emptyCondition={emptyHeartRate}
                chart={{
                  categories: [...HeartRateDataDate],
                  data: [{ name: 'bpm', data: HeartRateData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${HeartRateData[index]} bpm`,
                  date: HeartRateDataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
                createNew={() => {
                  openSingle({
                    name: 'heartRate',
                    type: 'number',
                    label: 'Heart Rate',
                    placeholder: '0',
                    adornment: 'bpm',
                  });
                }}
              />

              <VitalChart
                title="Body Temperature"
                subheader="by Celcius"
                emptyCondition={emptyTemp}
                chart={{
                  categories: [...TempDataDate],
                  data: [{ name: 'Celcius', data: TempData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${TempData[index]} °C`,
                  date: TempDataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
                createNew={() => {
                  openSingle({
                    name: 'bodyTemp',
                    type: 'number',
                    label: 'Body Temperature',
                    placeholder: '0',
                    adornment: 'bpm',
                  });
                }}
              />
            </Box>
          </Scrollbar>
        </Stack>
      )}
    </>
  );
}
