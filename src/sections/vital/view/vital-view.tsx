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
  items2: any
};

export default function VitalView({ items2, items, loading, isDashboard, addedCategory }: Props) {
  const upMd = useResponsive('up', 'md');
  const weightData = items?.map((item: any) => item?.wt || 0);
  const HeightData = items?.map((item: any) => item?.ht || 0);
  const BMIData = items?.map((item: any) => item?.bmi || 0);
  const BP1Data = items?.map((item: any) => item?.bp1 || 0);
  const BP2Data = items?.map((item: any) => item?.bp2 || 0);
  const OxygenData = items?.map((item: any) => item?.spo2 || 0);
  const HeartRateData = items?.map((item: any) => item?.hr || 0);
  const RespData = items?.map((item: any) => item?.rr || 0);
  const TempData = items?.map((item: any) => item?.bt || 0);
  const dataDate = items?.map((item: any) => item?.date || new Date());
  const categories = dataDate?.map((_: any) => `${fDate(_, 'MMM dd')}`);



  let newData: any = [];

  items2?.forEach((val: any) => {
    if (newData.length === 0) {
      const vitalDataArr = [];
      const vitalDateArr = [];
      const vitalDateArrNoFormat = [];

      vitalDataArr.push(val.value)
      vitalDateArr.push(fDate(val.createdAt))
      vitalDateArrNoFormat.push(val.createdAt)

      const payload = {
        title: val?.vital_category?.title,
        measuring_unit:val?.vital_category?.measuring_unit,
        date:vitalDateArr,
        data: vitalDataArr,
        dateNoFormat:vitalDateArrNoFormat
      
      }

      newData.push(payload)
    } else {
      const allTitles = newData?.map((item) => item.title);

      if (allTitles.includes(val?.vital_category?.title)) {
        const index = newData.findIndex((item) => item.title === val?.vital_category?.title);
        if (index !== -1) {
          newData[index].data.push(val.value)
          newData[index].date.push(fDate(val.createdAt))
          newData[index].dateNoFormat.push(val.createdAt)
        }
      } else {
        const vitalDataArr = [];
        const vitalDateArr = [];
        const vitalDateArrNoFormat = [];

        vitalDataArr.push(val.value)
        vitalDateArr.push(fDate(val.createdAt))
        vitalDateArrNoFormat.push(val.createdAt)

        const payload = {
          title: val?.vital_category?.title,
          data: vitalDataArr,
          measuring_unit:val?.vital_category?.measuring_unit,
          date:vitalDateArr,
          dateNoFormat:vitalDateArrNoFormat
        }
        newData.push(payload)
      }

    }
  })

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
            subheader="by kilogram"
            chart={{
              categories,
              data: [{ name: 'kg', data: weightData }],
            }}
            list={[...Array(categories?.length)].map((_, index) => ({
              value: `${weightData[index]} kg`,
              date: dataDate[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
          />

          <VitalChart
            title="Height"
            subheader="by centimeter"
            chart={{
              categories,
              data: [{ name: 'cm', data: HeightData }],
            }}
            list={[...Array(categories?.length)].map((_, index) => ({
              value: `${HeightData[index]} cm`,
              date: dataDate[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
          />

          <VitalChart
            title="Body Mass Index"
            subheader="by kg/m2"
            chart={{
              categories,
              data: [{ name: 'bmi', data: BMIData }],
            }}
            list={[...Array(categories?.length)].map((_, index) => ({
              value: `${BMIData[index]} bmi`,
              date: dataDate[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
          />

          <VitalChart
            title="Blood Pressure"
            subheader="by mm/Hg"
            chart={{
              categories,
              data: [
                { name: 'mm', data: BP1Data },
                { name: 'Hg', data: BP2Data },
              ],
            }}
            list={[...Array(categories?.length)].map((_, index) => ({
              value: `${BP1Data[index]}mm / ${BP2Data[index]}Hg`,
              date: dataDate[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
          />

          <VitalChart
            title="Oxygen Saturation"
            subheader="by percentage"
            chart={{
              categories,
              data: [{ name: 'percentage', data: OxygenData }],
            }}
            list={[...Array(categories?.length)].map((_, index) => ({
              value: `${OxygenData[index]}%`,
              date: dataDate[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
          />

          <VitalChart
            title="Respiratory Rate"
            subheader="by breathes per minutes "
            chart={{
              categories,
              data: [{ name: 'bpm', data: RespData }],
            }}
            list={[...Array(categories?.length)].map((_, index) => ({
              value: `${RespData[index]} bpm`,
              date: dataDate[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
          />

          <VitalChart
            title="Heart Rate"
            subheader="by beats per minutes"
            chart={{
              categories,
              data: [{ name: 'bpm', data: HeartRateData }],
            }}
            list={[...Array(categories?.length)].map((_, index) => ({
              value: `${HeartRateData[index]} bpm`,
              date: dataDate[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
          />

          <VitalChart
            title="Body Temperature"
            subheader="by Celcius"
            chart={{
              categories,
              data: [{ name: 'Celcius', data: TempData }],
            }}
            list={[...Array(categories?.length)].map((_, index) => ({
              value: `${TempData[index]} °C`,
              date: dataDate[index],
            }))}
            loading={loading}
            isDashboard={isDashboard}
          />


          {newData?.map((item: any) => (
            <VitalChart
              title={item?.title}
              subheader={`by ${item?.measuring_unit}`}
              chart={{
                categories:item?.date?.map((item:any)=>fDate(item, 'MMM dd')),
                data: [{ name: 'Celcius', data: item?.data }],
              }}
              list={[...Array(item?.dateNoFormat?.length)].map((_, index) => ({
                value: `${item?.data[index]} ${item?.measuring_unit}`,
                date: item?.dateNoFormat[index],
              }))}
              loading={loading}
              isDashboard={isDashboard}
            />
          ))} 
        </Box>
      ) : (
        // for dashboard --------------------------------------------------------------------------------------------------------------------
        <Stack sx={{ height: '120px', width: '730px' }}>
          <Scrollbar>
            <Box
              sx={{
                display: 'grid',
                columnGap: { md: 1, xs: 1 },
                rowGap: { md: 1, xs: 1 },
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <VitalChart
                title="Weight"
                subheader="by kilogram"
                chart={{
                  categories,
                  data: [{ name: 'kg', data: weightData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${weightData[index]} kg`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
              />

              <VitalChart
                title="Height"
                subheader="by centimeter"
                chart={{
                  categories,
                  data: [{ name: 'cm', data: HeightData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${HeightData[index]} cm`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
              />

              <VitalChart
                title="Body Mass Index"
                subheader="by kg/m2"
                chart={{
                  categories,
                  data: [{ name: 'bmi', data: BMIData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${BMIData[index]} bmi`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
              />

              <VitalChart
                title="Blood Pressure"
                subheader="by mm/Hg"
                chart={{
                  categories,
                  data: [
                    { name: 'mm', data: BP1Data },
                    { name: 'Hg', data: BP2Data },
                  ],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${BP1Data[index]}mm / ${BP2Data[index]}Hg`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
              />

              <VitalChart
                title="Oxygen Saturation"
                subheader="by percentage"
                chart={{
                  categories,
                  data: [{ name: 'percentage', data: OxygenData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${OxygenData[index]}%`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
              />

              <VitalChart
                title="Respiratory Rate"
                subheader="by breathes per minutes "
                chart={{
                  categories,
                  data: [{ name: 'bpm', data: RespData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${RespData[index]} bpm`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
              />

              <VitalChart
                title="Heart Rate"
                subheader="by beats per minutes"
                chart={{
                  categories,
                  data: [{ name: 'bpm', data: HeartRateData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${HeartRateData[index]} bpm`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
              />

              <VitalChart
                title="Body Temperature"
                subheader="by Celcius"
                chart={{
                  categories,
                  data: [{ name: 'Celcius', data: TempData }],
                }}
                list={[...Array(categories?.length)].map((_, index) => ({
                  value: `${TempData[index]} °C`,
                  date: dataDate[index],
                }))}
                loading={loading}
                isDashboard={isDashboard}
              />
            </Box>
          </Scrollbar>
        </Stack>
      )}
    </>
  );
}
