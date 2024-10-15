import { GraphQLError } from "graphql/error/GraphQLError";
//import { PrismaClient } from "@prisma/client";
import client from "../../../prisma/prismaClient";
import { extendType, inputObjectType, objectType } from "nexus";
import { cancelServerQueryRequest } from "../../utils/cancel-pending-query";
import { unserialize } from "php-serialize";
import bcrypt from 'bcryptjs';



// NEW BASED ON DOCTOR ID
export const sub_account_doctor = objectType({
  name: "sub_account_doctor",
  definition(t) {
    t.nullable.int("id");
    t.nullable.int("secretaryID");
    t.nullable.int("doctorID");
    t.nullable.string("idno");
    t.nullable.string("docidno");
    t.nullable.int("status");
    t.nullable.int("appt_all");
    t.nullable.int("appt_approve");
    t.nullable.int("appt_cancel");
    t.nullable.int("appt_done");
    t.nullable.int("appt_type");
    t.nullable.int("appt_pay");
    t.nullable.int("lab_result");
    t.nullable.int("hmo_claim");
    t.nullable.int("pres_view");
    t.nullable.field("subAccountInfo", {
      type: subAccountInfo,
    });
    t.nullable.field("doctorInfo", {
      type: doctorInfo,
    //   async resolve(root, _arg, _ctx) {
    //     const result: any = await client.employees.findFirst({ // client.employees model name galing schema prisma
    //         where: {
    //           EMP_ID: Number(root?.doctorID),
    //         }
    //     })

    //     return result;
    // }
    });
  }
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const doctorInfo = objectType({
  name: "doctorInfo",
  definition(t) {
    t.id("EMP_ID");
    t.nullable.string("EMP_FULLNAME");
    t.nullable.string("EMP_FNAME");
    t.nullable.string("EMP_MNAME");
    t.nullable.string("EMP_LNAME");
    t.nullable.string("EMP_SUFFIX");
    t.nullable.string("CONTACT_NO");
    t.nullable.string("EMP_EMAIL");
    t.nullable.string("EMP_TITLE");
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
export const subAccountInfo = objectType({
  name: "subAccountInfo",
  definition(t) {
    t.int("id");
    t.nullable.int("userType");
    t.nullable.string("email");
    t.nullable.string("idno");
    t.nullable.string("fname");
    t.nullable.string("mname");
    t.nullable.string("lname");
    t.nullable.string("suffix");
    t.nullable.string("gender");
    t.nullable.string("mobile_no");
    t.nullable.string("bday");
    t.nullable.string("occupation");
    t.nullable.list.field("logActionInfo", {
      type: logActionInfo,
    });
    t.nullable.field("userInfo", {
      type: userInfo,
    });
    
  }
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
const userInfo = objectType({
  name: "userInfo",
  definition(t) {
    t.nullable.int("id");
    t.nullable.string("username");
    t.nullable.string("uname");
    t.nullable.string("mobile_number");
    t.nullable.string("email");
    t.nullable.string("password");
    t.nullable.int("userType");
    t.nullable.date("register_date");
    t.nullable.date("last_login");
    t.nullable.string("last_activity");
    t.nullable.string("notes");
    t.nullable.string("code");
    t.nullable.int("userTries");
    t.nullable.int("isFirstLogin");
    t.nullable.string("userSkin");
    t.nullable.int("isOnline");
    t.nullable.int("isActivated");
    t.nullable.int("isDeleted");
    t.nullable.list.field("display_picture", {
      type: Sub_display_picture,
    });
  },
});
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
const Sub_display_picture = objectType({
  name: "Sub_display_picture",
  definition(t) {
    t.nullable.int("id");
    t.nullable.int("userID");
    t.nullable.string("idno");
    t.nullable.string("filename");
  },
});
///////////////////////////////////////////////////////


/////////////////////////////////////////////////////
const logActionInfo = objectType({
  name: "logActionInfo",
  definition(t) {
    t.nullable.int("id");
    t.nullable.int("secretaryID");
    t.nullable.int("patientID");
    t.nullable.int("idno");
    t.nullable.string("request");
    t.nullable.string("patient");
    t.nullable.string("log_type");
    t.nullable.string("log_type_name", {
      resolve(parent, _args, _ctx) {
        switch (parent.log_type) {
          case "1":
            return "Appointment Status";
          case "2":
            return "Appointment Type";
          case "3":
            return "Payment Status";
          case "4":
            return "Lab and Imaging Result";
          case "5":
            return "HMO Claims";
          default:
            return null; // You can return null for other cases if it"s nullable
        }
      }
    });
    t.nullable.date("date");
    t.nullable.int("type");
    t.nullable.field("patientInfo", {
      type: Sub_patient_info,
    });
    
  },
});
/////////////////////////////////////////////////////


///////////////////////////////////////////////////////
const Sub_patient_info = objectType({
  name: "Sub_patient_info",
  definition(t) {
    t.nullable.int("S_ID");
    t.nullable.int("IDNO");
    t.nullable.string("FNAME");
    t.nullable.string("LNAME");
    t.nullable.string("MNAME");
    t.nullable.int("SEX");
    t.nullable.field("userInfo", {
      type: patient_Info,
    });
  },
});
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
const patient_Info = objectType({
  name: "patient_Info",
  definition(t) {
    t.nullable.int("id");
    t.nullable.list.field("display_picture", {
      type: Sub_patient_display_picture,
    });
  },
});
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
const Sub_patient_display_picture = objectType({
  name: "Sub_patient_display_picture",
  definition(t) {
    t.nullable.int("id");
    t.nullable.int("userID");
    t.nullable.string("idno");
    t.nullable.string("filename");
  },
});
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
//REQUEST PAYLOADS
export const sub_account_requests = inputObjectType({
  name: "sub_account_requests",
  definition(t) {
    t.nullable.int("status");
    t.nullable.int("take");
    t.nullable.int("skip");
    t.nullable.string("orderBy");
    t.nullable.string("orderDir");
    t.nullable.string("searchKeyword");
  },
});
//REQUEST PAYLOADS
///////////////////////////////////////////////////////

/////////////////////////////////////
//FILTERS
const filters = (args: any) => {
  let whereConSearch: any = {};
  let multicondition: any = {};

  if (args?.data!.searchKeyword) {
    whereConSearch = {
      OR: [
        {
          subAccountInfo: 
          {
              OR: [
                      {
                        fname: { // email = coloumn name
                          contains: args?.data?.searchKeyword,
                        },
                      },
                      {
                        mname: { // email = coloumn name
                          contains: args?.data?.searchKeyword,
                        },
                      },
                      {
                        lname: { // email = coloumn name
                          contains: args?.data?.searchKeyword,
                        },
                      },
                      {
                        email: { // email = coloumn name
                          contains: args?.data?.searchKeyword,
                        },
                      },
                      {
                        mobile_no: { // mobile_no = coloumn name
                          contains: args?.data?.searchKeyword,
                        },
                      },
                      {
                        occupation: { // mobile_no = coloumn name
                          contains: args?.data?.searchKeyword,
                        },
                      },
                  ],
          },
        },
      ],

    };
  }


  multicondition = {
    ...multicondition,
    ...{
      ...whereConSearch,
    },
  };
  return multicondition;
};
//FILTERS
//////////////////////////////////////////////////////////////////////////  


/////////////////////////////////////////////////////////////////////////
//SUMMARY TOTAL
const Sub_Account_Total_Summary = objectType({
  name: "Sub_Account_Total_Summary",
  definition(summary_total) {
    summary_total.nullable.int("total");
    summary_total.nullable.int("active");
    summary_total.nullable.int("inactive");
  },
});
//SUMMARY TOTAL
//////////////////////////////////////////////////////

/////////////////////////////////////////////////////
export const _sub_account = objectType({
  name: "_sub_account",
  definition(t) {
    t.nullable.list.field("sub_account_doctor_all_data", {
      type: sub_account_doctor,
    });
    t.int("total_records");
    t.field("summary_total", {
      type: Sub_Account_Total_Summary,
    });
  },
});
///////////////////////////////////////////////////

export const sub_account_doctor_data = extendType({
  type: 'Query',
  definition(t) {
      t.nullable.field('sub_account_doctor_data', {
          type: _sub_account,
          args: { data: sub_account_requests! },
          async resolve(_root, args, ctx) {
            const { take, skip, orderBy, orderDir }: any = args.data;
            const {session} = ctx;

            const doctorD = await client.employees.findFirst({
              where:{
                EMP_EMAIL:session.user.email
              }
            })
            // ORDER BY
            let order: any;
            switch (args?.data?.orderBy) {
              case "lname":
                {
                order = [ { subAccountInfo:{lname: args?.data?.orderDir} }];
                }
                break;
              case "email":
                {
                  order = [{ subAccountInfo:{email: args?.data?.orderDir} }];
                }
                break;
              case "mobile_no":
                {
                  order = [{ subAccountInfo:{mobile_no: args?.data?.orderDir} }];
                }
                break;
              default:
                  {
                    order = [
                      {
                        id: 'desc',
                      },
                    ];
                  }
            }

            const orderConditions = {
              orderBy: order,
            };
            // ORDER BY   
            const whereconditions = filters(args);
            const status = (() => {
              if (args?.data?.status === -1) return {};
              return {
                // subAccountDoctorInfo: {
                //   every: {
                    status: args?.data?.status,
                  // },
                // },
              };
            })();
            await cancelServerQueryRequest(client, session?.user?.id, "`sub_account_doctor`", "sub_account_doctor_data");   
            try {
              // const [sub_account_doctor, _count, count,active_count,inactive_count]: any = await client.$transaction([
                const [sub_account_doctor, count,total_count, active_count, inactive_count]: any = await client.$transaction([
                  ////////////////////////////////////////////////
                  client.sub_account_doctor.findMany({
                    take,
                    skip,
                    where: {
                      doctorID: doctorD?.EMP_ID,
                      ...status,
                      ...whereconditions,
                    },
                    include: {
                      subAccountInfo: {
                        include: {
                          logActionInfo: {
                            include:{
                              patientInfo:{
                                include:{
                                  userInfo:{
                                    include:{
                                      display_picture:{
                                        orderBy:{
                                          id:'desc'
                                        },
                                      },
                                    }
                                  }
                                }
                              }
                            }
                          },
                          userInfo: {
                            include:{
                              display_picture:{
                                orderBy:{
                                  id:'desc'
                                },
                              },
                            }
                          },
                        },
                      },
                      doctorInfo: true,
                    },
                    ...orderConditions,
                  }),
                  client.sub_account_doctor.aggregate({
                    where: {
                      doctorID:doctorD?.EMP_ID,
                      ...status,
                      ...whereconditions,
                    },
                    _count: {
                      id: true,
                    },
                  }), 
                  client.sub_account_doctor.count({
                    where: {
                      doctorID: doctorD?.EMP_ID,
                      ...whereconditions,
                    },
                  }),
                  // Conditionally count active records based on whereconditions
                  whereconditions
                    ? client.sub_account_doctor.count({
                        where: {
                          status: 1,
                          doctorID: doctorD?.EMP_ID,
                          ...whereconditions,
                        },
                      })
                    : client.sub_account_doctor.count({ // Use Prisma Client promise here
                        where: {
                          status: 1,
                          doctorID: doctorD?.EMP_ID,
                          ...whereconditions,
                        },
                      }),
                      
                  client.sub_account_doctor.count({
                    where: {
                      status: 0,
                      doctorID: doctorD?.EMP_ID,
                      ...whereconditions,
                    },
                  }),
                ]);
                  
                  ////////////////////////////////////////////////
        
                  ////////////////////////////////////////////////
                  
                  const data = {
                    // sub_account_doctor,
                    total:total_count,
                    active:active_count,
                    inactive:inactive_count
                  }

                  // console.log(data,"woooow@@")



                  const _result: any = sub_account_doctor;
                  const _total: any = count;
                  // const _total_summary: any = _count;
                  


                  // let total = 0;
                  // _total_summary.map((v: any) => (total += v?._count?.status))
                  // const total_summary = {
                  //   total,
                  //   active: _total_summary.find((v: any) => v?.status === 1)?._count?.status,
                  //   inactive: _total_summary.find((v: any) => v?.status === 0)?._count?.status,
                  // };

                  const response: any = {
                    sub_account_doctor_all_data: _result,
                    total_records: Number(_total?._count?.id),
                    summary_total: data,
                    // total_active, 
                    // total_inactive
                  }

                  

                  return response;
                  
        
                } catch (error) {
                  console.log(error)
                }
              
          }
      });
  }
});
// NEW BASED ON DOCTOR ID

















///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////















/////////////////////////////////////
//REQUEST PAYLOADS
export const sub_account_requests_by_id = inputObjectType({
  name: "sub_account_requests_by_id",
  definition(t) {
    t.nullable.int("id");
    // t.nullable.int("secretaryId");
    t.nullable.int("take");
    t.nullable.int("skip");
    t.nullable.string("searchKeyword");
    t.nullable.date("startDate");
    t.nullable.date("endDate");
  },
});
//REQUEST PAYLOADS
/////////////////////////////////////
/////////////////////////////////////
//FILTERS2
const filters2 = (args: any) => {
  let where: any = {};
  let where_date: any = {};
  let multicondition: any = {};

  if (args?.data!.searchKeyword) {
    where = {
      OR: [
        {
          request: {
            contains: args?.data?.searchKeyword as string,
          },
        },
        {
          log_type: {
            contains: args?.data?.searchKeyword as string,
          },
        },
      ],
    };
  }

  if (args?.data?.startDate && args?.data?.endDate) 
    {
      where_date = {
          date: { 
              gte: args?.data?.startDate,
              lte: args?.data?.endDate
          }
      }
    }
  multicondition = {
    ...multicondition,
    ...where,
    ...where_date,
  };
  return multicondition;
};
//FILTERS2
////////////////////////////////////////////////////////////////////////// 

///////////////////////////////////////////////////
export const _sub_account_by_id = objectType({
  name: "_sub_account_by_id",
  definition(t) {
    t.nullable.field("sub_account_data_by_ids", {
      type: sub_account_doctor,
    });
    t.int("total_records");
  },
});
///////////////////////////////////////////////////

  export const sub_account_data_by_id = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('sub_account_data_by_id', {
            type: _sub_account_by_id,
            args: { data: sub_account_requests_by_id! },
            async resolve(_root, args, ctx) {
              const {id,  take, skip, orderBy, orderDir }: any = args.data;
   
              const whereconditionsss = filters2(args);
              const { session } = ctx;
              await cancelServerQueryRequest(client, session?.user?.id, "`sub_account_doctor`", "sub_account_data_by_id");   
              try {
                      const [sub_account_doctor, count]: any = await client.$transaction([
                            ////////////////////////////////////////////////
                            client.sub_account_doctor.findFirst({
                              where: {
                                secretaryID: id || undefined,
                              },
                              include: {
                                subAccountInfo:{
                                  include: {
                                    logActionInfo: {
                                      where: {
                                        ...whereconditionsss,
                                      },
                                      orderBy:{
                                        id:'desc'
                                      },
                                      skip,
                                      take,
                                      include:{
                                        patientInfo:{
                                          include:{
                                            userInfo:{
                                              include:{
                                                display_picture:{
                                                  orderBy:{
                                                    id:'desc'
                                                  },
                                                },
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    userInfo: {
                                      include:{
                                        display_picture:{
                                          orderBy:{
                                            id:'desc'
                                          },
                                        },
                                      }
                                    },
                                  },
                                },
                                doctorInfo:true,
                              },
                            }),client.log_action.aggregate({
                              where: {
                                secretaryID: id || undefined,
                                ...whereconditionsss,
                              },
                              _count: {
                                id: true,
                              },
                            }),
                          ]);
                          ////////////////////////////////////////////////
                
                          ////////////////////////////////////////////////

                          const _result: any = sub_account_doctor;
                          const _total: any = count;

                          const response: any = {
                            sub_account_data_by_ids: _result,
                            total_records: Number(_total?._count?.id),
                          }
  
                         return response;
                          
                
                        } catch (error) {
                          console.log(error)
                        }
                
            }
        });
    }
  });














/////////////////////////////////////////////////////
/////////////////////////////////////////////////////


/////////////////////////CREATE SUB ACOUNT////////////////////////////
///////////////////////////////////////////////////////
export const sub_account_object = objectType({
  name: "sub_account_object",
  definition(t) {
    t.int("id");
    t.nullable.int("userType");
    t.nullable.string("email");
    t.nullable.string("idno");
    t.nullable.string("fname");
    t.nullable.string("mname");
    t.nullable.string("lname");
    t.nullable.string("suffix");
    t.nullable.string("gender");
    t.nullable.string("mobile_no");
    t.nullable.string("bday");
    t.nullable.string("occupation");
  }
});
///////////////////////////////////////////////////////



// export const UserUpdatePhoneProfileUpsertType = inputObjectType({
  export const user_sub_account_input_request = inputObjectType({
    name: "user_sub_account_input_request",
    definition(t) {
      t.nonNull.string("email");
      t.nonNull.string("fname");
      t.nonNull.string("mname");  
      t.nonNull.string("lname");
      t.nonNull.string("gender");
      t.nonNull.string("mobile_no");
      t.nonNull.string("password");
      t.nonNull.string("confirmpasword");
    },
  });
  
  ///////////////////////////////////////
//   export const user_update_phone_transactions = objectType({
  export const user_sub_account_transactions = objectType({
    name: "user_sub_account_transactions",
    definition(t) {
      t.nullable.field('status', {
        type: 'String',
      });
      t.nullable.field('message', {
        type: 'String',
      });
      t.nullable.field('create_sub_account_data', {
        type: sub_account_object,
      });
    },
  });
  ///////////////////////////////////////
  
 //   export const mutationUpdatePhone = extendType({
    export const mutation_create_sub_account = extendType({
        type: "Mutation",
        definition(t) {
          t.nonNull.field("mutation_create_sub_account", {
            type: user_sub_account_transactions, // Assuming medication_transactions is the return type
            args: {
              data: user_sub_account_input_request!, // Assuming medication_input_request is the input type
            },
            async resolve(_, args, ctx) {
              const { email,fname,mname,lname,gender,mobile_no,password,confirmpasword,}: any = args.data;
              const { session } = ctx;
              await cancelServerQueryRequest(client, session?.user?.id, '`mutation_create_sub_account`', 'user_sub_account_input_request');
      
              let res: any = {};
              try {
                //VALIDATING PHONE 
                const mobile_number = mobile_no;
                const existingUserWithMobile = await client.user.findFirst({
                  where: {
                    mobile_number,
                  },
                });
      
                if (existingUserWithMobile) {
                  res = {
                    status: "Failed",
                    message: "Phone Number Already Taken",
                  };
                  return res;
                }
                //VALIDATING PHONE
                
                
                //VALIDATING EMAIL 
                const existingUserEmail = await client.user.findFirst({
                  where: {
                    email,
                  },
                });

                const doctorD = await client.employees.findFirst({
                  where:{
                    EMP_EMAIL:session?.user?.email
                  }
                })
      
                if (existingUserEmail) {
                  res = {
                    status: "Failed",
                    message: "Email Already Taken",
                  };
                  return res;
                }
                //VALIDATING EMAIL 

                //VALIDATING EMAIL 
                const existingSubAccountEmail = await client.sub_account.findFirst({
                  where: {
                    email,
                  },
                });
      
                if (existingSubAccountEmail) {
                  res = {
                    status: "Failed",
                    message: "Email Already Taken",
                  };
                  return res;
                }
                //VALIDATING EMAIL 


                //VALIDATING EMAIL 
                const emr_existingUserEmail = await client.emr_patient.findFirst({
                  where: {
                    email,
                  },
                });

                if (emr_existingUserEmail) {
                  res = {
                    status: "Failed",
                    message: "Email Already Taken",
                  };
                  return res;
                }
                //VALIDATING EMAIL


                // USER ACCOUNT
                const userType = 1;
                const userProvidedNewPassword = password;
                const userProvidedConfirmPassword = confirmpasword;
                
                if (userProvidedNewPassword === userProvidedConfirmPassword) {
                  const hashpassword = await bcrypt.hash(userProvidedNewPassword, 8);
                  const currentDate = new Date();
                  const formattedDate = currentDate.toISOString();
                  const create_user = await client.user.create({
                    data: {
                      userType,
                      email,
                      mobile_number,
                      register_date: currentDate,
                      last_login: formattedDate,
                      password: hashpassword,
                    },
                  });
                }else {
                  res = {
                    status: "Failed",
                    message: "Input Passwords do not match.",
                  };
                }
                // USER ACCOUNT

                // SUB ACCOUNT
                const occupation = "secretary";
                const create_sub_account = await client.sub_account.create({
                  data: {
                    userType,
                    email,
                    fname,
                    mname,
                    lname,
                    gender,
                    mobile_no,
                    occupation,
                  },
                });
                // SUB ACCOUNT



                

                //DOCTOR SUB ACCOUNT
                const secretaryID = create_sub_account.id;
                const doctorID = Number(doctorD?.EMP_ID);  
                const status = 1; 
                const appt_all = 0;
                const appt_approve = 0;
                const appt_cancel = 0;
                const appt_done = 0;
                const appt_pay = 0;
                const lab_result = 0;
                const hmo_claim = 0;
                const create_sub_account_doctor = await client.sub_account_doctor.create({
                  data: {
                    secretaryID,
                    doctorID,
                    status,
                    appt_all,
                    appt_approve,
                    appt_cancel,
                    appt_done,
                    appt_pay,
                    lab_result,
                    hmo_claim,
                  },
                });
                //DOCTOR SUB ACCOUNT




      
                if (create_sub_account) {
                  res = {
                    status: "Success",
                    message: "Create Sub Account Successfully",
                    create_sub_account_data: create_sub_account, // Include the created entry
                  };
                }
              } catch (error) {
                console.log(error)
                res = {
                  status: "Failed",
                  message: "An error occurred.",
                };
              }
              return res;
            },
          });
        },
      });
/////////////////////////CREATE SUB ACOUNT////////////////////////////      




















///////////////////////////////////////////////////////
export const secretary_permission_request_type = inputObjectType({
  name: "secretary_permission_request_type",
  definition(t) {
    t.nullable.int("id");
    t.nullable.int("status");
    t.nullable.int("appt_all");
    t.nullable.int("appt_approve");
    t.nullable.int("appt_cancel");
    t.nullable.int("appt_done");
    t.nullable.int("appt_type");
    t.nullable.int("appt_pay");
    t.nullable.int("lab_result");
    t.nullable.int("hmo_claim");
    t.nullable.int("pres_view");
  },
});
///////////////////////////////////////////////////////



///////////////////////////////////////
export const secretary_permission_update_transactions = objectType({
  name: "secretary_permission_update_transactions",
  definition(t) {
    t.nullable.field('status', {
      type: 'String',
    });
    t.nullable.field('message', {
      type: 'String',
    });
    t.nullable.field('update_secretary_permission_data', {
      type: sub_account_doctor,
    });
  },
});
///////////////////////////////////////

export const mutation_secretary_permission = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("mutation_secretary_permission", {
      type: secretary_permission_update_transactions,
      args: {
        data: secretary_permission_request_type!,
      },
      async resolve(_, args, ctx) {
        const {
          id,
          status,
          appt_all,
          appt_approve,
          appt_cancel,
          appt_done,
          appt_type,
          appt_pay,
          lab_result,
          hmo_claim,
          pres_view, }: any = args.data;
        const { session } = ctx;

        await cancelServerQueryRequest(client, session?.user?.id, '`mutation_secretary_permission`', 'secretary_permission_request_type');

        let res: any = {};
        try {
          
          const secid = id;
          const update = await client.sub_account_doctor.update({
            where: {
              id: secid
            },
            data: {
              status,
              appt_all,
              appt_approve,
              appt_cancel,
              appt_done,
              appt_type,
              appt_pay,
              lab_result,
              hmo_claim,
              pres_view,
            },
          });

          if (update) {
            res = {
              status: "Success",
              message: "Update Sub Account Successfully",
              update_secretary_permission_data: update,
            };
          }

        } catch (error) {
          console.log(error)
          res = {
            status: "Failed",
            message: "An error occurred.",
          };
        }
        return res;
      },
    });
  },
});

/////////////////////////UPDATE PERMISSION SUB ACOUNT//////////////////////////// 
































/////////////////////////VALIDATE SUB ACCOUNT EMAIL////////////////////////////   
///////////////////////////////////////////////////////
export const sub_account_email = objectType({
  name: "sub_account_email",
  definition(t) {
    t.nullable.string("email");
  }
});
///////////////////////////////////////////////////////  


///////////////////////////////////////////////////////   
  export const sub_account_input_email_request = inputObjectType({
    name: "sub_account_input_email_request",
    definition(t) {
      t.nullable.string("email");
    },
  });
///////////////////////////////////////


///////////////////////////////////////
  export const sub_account_email_transactions = objectType({
    name: "sub_account_email_transactions",
    definition(t) {
      t.nullable.field('status', {
        type: 'String',
      });
      t.nullable.field('message', {
        type: 'String',
      });
      t.nullable.field('email_data', {
        type: sub_account_email,
      });
    },
  });
///////////////////////////////////////

// export const mutation_secretary_permission = extendType({
export const email_validation = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("email_validation", {
      type: sub_account_email_transactions,
      args: {
        data: sub_account_input_email_request!,
      },
      async resolve(_, args, ctx) {
        const { email }: any = args.data;
        const { session } = ctx;

        await cancelServerQueryRequest(client, session?.user?.id, '`email_validation`', 'sub_account_input_email_request');

        let res: any = {};
        try {
          const emailvalidation = email;
          const validate_user_email = await client.user.findFirst({
            where: {
              email: emailvalidation
            }
          });
          const validate_employees_email = await client.employees.findFirst({
            where: {
              EMP_EMAIL: emailvalidation
            }
          });
          const validate_patient_email = await client.patient.findFirst({
            where: {
              EMAIL: emailvalidation
            }
          });
          const validate_sub_account_email = await client.sub_account.findFirst({
            where: {
              email: emailvalidation
            }
          });
          
          if (validate_sub_account_email || validate_user_email || validate_patient_email || validate_employees_email) {
            res = {
              status: "Failed",
              message: "Email already taken",
              email_data: validate_sub_account_email || validate_user_email || validate_patient_email || validate_employees_email,
            };
          }else{
            res = {
              status: "Success",  
              message: "Email is valid",
              email_data: validate_sub_account_email || validate_user_email || validate_patient_email || validate_employees_email,
            }; 
          }

        } catch (error) {
          console.log(error)
          res = {
            status: "Failed",
            message: "An error occurred.",
          };
        }
        return res;
      },
    });
  },
});
/////////////////////////VALIDATE SUB ACCOUNT EMAIL////////////////////////////      






































/////////////////////////VALIDATE SUB ACCOUNT PHONE////////////////////////////   
///////////////////////////////////////////////////////
export const sub_account_mobile_no = objectType({
  name: "sub_account_mobile_no",
  definition(t) {
    t.nullable.string("mobile_no");
  }
});
///////////////////////////////////////////////////////  


///////////////////////////////////////////////////////   
  export const sub_account_input_mobile_no_request = inputObjectType({
    name: "sub_account_input_mobile_no_request",
    definition(t) {
      t.nullable.string("mobile_no");
    },
  });
///////////////////////////////////////


///////////////////////////////////////
  export const sub_account_mobile_no_transactions = objectType({
    name: "sub_account_mobile_no_transactions",
    definition(t) {
      t.nullable.field('status', {
        type: 'String',
      });
      t.nullable.field('message', {
        type: 'String',
      });
      t.nullable.field('mobile_no_data', {
        type: sub_account_mobile_no,
      });
    },
  });
///////////////////////////////////////

// export const mutation_secretary_permission = extendType({
export const mobile_no_validation = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("mobile_no_validation", {
      type: sub_account_mobile_no_transactions,
      args: {
        data: sub_account_input_mobile_no_request!,
      },
      async resolve(_, args, ctx) {
        const { mobile_no }: any = args.data;
        const { session } = ctx;

        await cancelServerQueryRequest(client, session?.user?.id, '`mobile_no_validation`', 'sub_account_input_mobile_no_request');

        let res: any = {};
        try {
          const mobile_no_validation = mobile_no;
          const validate_user_mobile_no = await client.user.findFirst({
            where: {
              mobile_number: mobile_no_validation
            }
          });
          const validate_employees_mobile_no = await client.employees.findFirst({
            where: {
              CONTACT_NO: mobile_no_validation
            }
          });
          const validate_patient_mobile_no = await client.patient.findFirst({
            where: {
              CONTACT_NO: mobile_no_validation
            }
          });
          const validate_sub_account_mobile_no = await client.sub_account.findFirst({
            where: {
              mobile_no: mobile_no_validation
            }
          });
          if (validate_sub_account_mobile_no || validate_user_mobile_no || validate_patient_mobile_no || validate_employees_mobile_no) {
            res = {
              status: "Failed",
              message: "Mobile number already taken",
              mobile_no_data: validate_sub_account_mobile_no || validate_user_mobile_no || validate_patient_mobile_no || validate_employees_mobile_no,
            };
          }else{
            res = {
              status: "Success",  
              message: "Mobile number is valid",
              mobile_no_data: validate_sub_account_mobile_no || validate_user_mobile_no || validate_patient_mobile_no || validate_employees_mobile_no,
            }; 
          }

        } catch (error) {
          console.log(error)
          res = {
            status: "Failed",
            message: "An error occurred.",
          };
        }
        return res;
      },
    });
  },
});
/////////////////////////VALIDATE SUB ACCOUNT PHONE////////////////////////////      

