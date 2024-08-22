// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  QUEUE:'/queue',
  ADMIN:'/workforce',
  MERCHANT:'/merchant'
};

// ----------------------------------------------------------------------

export const paths: any = {
  home: '/',
  find: '/find-doctor',
  subs: '/subcription',
  book: (id: string) => `/find-doctor/${id}`,
  page403: '/403',
  page404: '/404',
  page500: '/500',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',

  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    verify: `${ROOTS.AUTH}/verify`,
    newPassword: `${ROOTS.AUTH}/new-password`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
  },
  queue:{
    // root:ROOTS.QUEUE, 
    root: (id: string) => `${ROOTS.QUEUE}/${id}`,
  },
  admin:{
    login:`${ROOTS.ADMIN}/login`,
    dashboard:`${ROOTS.ADMIN}/dashboard`,
    merchant:{
      root:`${ROOTS.ADMIN}/dashboard/merchant`,
    },
    
  },
  merchant:{
    dashboard:`${ROOTS.MERCHANT}/dashboard`,
    login:`${ROOTS.MERCHANT}/login`,
    medicine:`${ROOTS.MERCHANT}/dashboard/medicines`,
    orders:`${ROOTS.MERCHANT}/dashboard/orders`,
    store:`${ROOTS.MERCHANT}/dashboard/store`,
    manage:(id: number) => `${ROOTS.MERCHANT}/dashboard/store/${id}`,
    user:{
      account:`${ROOTS.MERCHANT}/dashboard/user/account`,
      profile:`${ROOTS.MERCHANT}/dashboard/user/profile`,
      login: `${ROOTS.MERCHANT}/dashboard/user/login`,
    },
    history:`${ROOTS.MERCHANT}/dashboard/history`,
    logs:`${ROOTS.MERCHANT}/dashboard/logs`,

  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    general: `${ROOTS.DASHBOARD}/general`,
    overview: {
      root: `${ROOTS.DASHBOARD}/overview`,
      request: `${ROOTS.DASHBOARD}/overview/request`,
      today: `${ROOTS.DASHBOARD}/overview/today`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      login: `${ROOTS.DASHBOARD}/user/login`,
      clinic: `${ROOTS.DASHBOARD}/user/clinic`,
      service: `${ROOTS.DASHBOARD}/user/service`,
      subaccount: `${ROOTS.DASHBOARD}/user/subaccount`,
    },
    medecine:{
      root:`${ROOTS.DASHBOARD}/medecine`,

      view: (id: string) => `${ROOTS.DASHBOARD}/medecine/${id}`,
    },
    myDoctors:{
        root: `${ROOTS.DASHBOARD}/my-doctors`,
    },
    orders:{
      root: `${ROOTS.DASHBOARD}/orders`,
    },
    queuePatient:{
      root: `${ROOTS.DASHBOARD}/queue-patient`
    },
    feeds: `${ROOTS.DASHBOARD}/feeds`,
    notification: `${ROOTS.DASHBOARD}/notification`,
    // queuePatient: {
    //   root: `${ROOTS.DASHBOARD}/patient-queue`
    // },
    appointment: {
      root: `${ROOTS.DASHBOARD}/appointment`,
      find: `${ROOTS.DASHBOARD}/appointment/find-doctor`,
      book: (id: string) => `${ROOTS.DASHBOARD}/appointment/find-doctor/${id}/book`,
    },
    queue: (id: string) => `${ROOTS.DASHBOARD}/queue/${id}`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    patient: {
      root: `${ROOTS.DASHBOARD}/patient`,
      view: (id: string) => `${ROOTS.DASHBOARD}/patient/${id}`,
    },
    hmo: `${ROOTS.DASHBOARD}/hmo-claim`,
    emr: {
      root: `${ROOTS.DASHBOARD}/my-emr`,
      view: (id: string) => `${ROOTS.DASHBOARD}/my-emr/${id}`,
    },
    prescription: `${ROOTS.DASHBOARD}/prescription`,
    doc: {
      root: `${ROOTS.DASHBOARD}/doc`,
      prescription: (id: string) => `${ROOTS.DASHBOARD}/doc/prescription/${id}`,
      imaging: (id: string) => `${ROOTS.DASHBOARD}/doc/imaging/${id}`,
    },
  },
};
