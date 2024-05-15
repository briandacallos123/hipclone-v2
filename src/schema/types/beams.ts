import  PushNotifications  from '@pusher/push-notifications-server';

const beamsClient = new PushNotifications({
  instanceId: "f81d984d-91e1-4f42-ac9f-23f57be65cd5",
  secretKey:"A61C5775E2E8D3F953FC027B661E83636DAFC57F2F40E334E5683046FB291D2E",
});


export default beamsClient;