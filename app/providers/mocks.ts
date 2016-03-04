export let MOCKS = 
    {"tickets/counts":
     { new_messages:1,open_all:284,open_as_tech:10,open_as_alttech:2,open_as_user:1001,onhold:3,reminder:0,parts_on_order:0,unconfirmed:45,waiting:2},
     
     "login": {
         "api_token": "re36rym3mjqxm8ej2cscfajmxpsew33m"
     },
     
     "organizations": [
         {
             "key": "u0diuk",
             "name": "bigWebApps",
             "is_expired": false,
             "is_trial": false,
             "instances": [
                 {
                     "key": "b95s6o",
                     "name": "Support",
                     "is_expired": false,
                     "is_trial": false
                 }
             ]
         },
         {
             "key": "u0diu1",
             "name": "bigWebApps",
             "is_expired": true,
             "is_trial": false,
             "instances": [
                 {
                     "key": "b95s61",
                     "name": "Support1",
                     "is_expired": false,
                     "is_trial": false
                 }
             ]
         },
         {
             "key": "okriez",
             "name": "!testhow",
             "is_expired": false,
             "is_trial": true,
             "instances": [
                 {
                     "key": "byk81d",
                     "name": "Main",
                     "is_expired": false,
                     "is_trial": false
                 },
                 {
                     "key": "byk811",
                     "name": "Second",
                     "is_expired": false,
                     "is_trial": false
                 }
             ]
         }
     ],
     
     "config": {
         "is_onhold_status": false,
         "is_time_tracking": true,
         "is_freshbooks": false,
         "freshbooks_url": "https://micajah3.freshbooks.com",
         "is_parts_tracking": false,
         "is_project_tracking": true,
         "is_unassigned_queue": true,
         "is_location_tracking": true,
         "is_waiting_on_response": true,
         "is_invoice": true,
         "is_payments": true,
         "is_expenses": true,
         "is_class_tracking": true,
         "is_travel_costs": true,
         "is_priorities_general": true,
         "is_confirmation_tracking": true,
         "is_resolution_tracking": true,
         "is_ticket_levels": true,
         "is_account_manager": true,
         "is_require_ticket_initial_post": true,
         "is_ticket_require_closure_note": true,
         "is_asset_tracking": true,
         "assets": {
             "unique1_caption": "",
             "unique2_caption": "",
             "unique3_caption": "",
             "unique4_caption": "",
             "unique5_caption": "",
             "unique6_caption": "",
             "unique7_caption": ""
         },
         "timezone_offset": 2,
         "timezone_name": "FLE Standard Time",
         "currency": "$",
         "businessday_length": 540,
         "logo": "/mafsf.axd?d=aW5zdGFuY2UtbG9nby9jOTMzMWE1OWNiNzY0YjQyYmM2M2JhZDRhNTAwZTE4My9zaGVycGFkZXNrXzMxMHg5NS5wbmd8MzAwfDQ1fDB8YzkzMzFhNTljYjc2NGI0MmJjNjNiYWQ0YTUwMGUxODNw0",
         "user": {
             "account_name": "bigWebApps Support",
             "login_id": "51b348ac5ef34ecea7d043f0d2688634",
             "user_id": 1325,
             "email": "jtrue@mail.ru",
             "firstname": "Tech/Admin",
             "lastname": "Eugene",
             "is_techoradmin": true,
             "is_admin": true,
             "is_limit_assigned_tkts": false,
             "is_useworkdaystimer": false,
             "account_id": 0,
             "time_format": 1,
             "date_format": 0
         }
     },

     "accounts" : [  
         {  
             "id":-1,
             "name":"SherpaDesk Support",
             "account_statistics":{  
                 "ticket_counts":{  
                     "open":133,
                     "closed":2025,
                     "hours":27132,
                     "total_invoiced_amount":0,
                     "total_non_invoiced_amount":548,
                     "total_billed_amount":36992,
                     "total_unbilled_amount":0,
                     "scheduled":0,
                     "followups":0
                 },
                 "timelogs":0,
                 "invoices":0,
                 "hours":27132,
                 "expenses":22
             }
         },
         {  
             "id":574,
             "name":"ACLU",
             "account_statistics":{  
                 "ticket_counts":{  
                     "open":1,
                     "closed":45,
                     "hours":10,
                     "total_invoiced_amount":0,
                     "total_non_invoiced_amount":0,
                     "total_billed_amount":0,
                     "total_unbilled_amount":0,
                     "scheduled":0,
                     "followups":0
                 },
                 "timelogs":0,
                 "invoices":0,
                 "hours":10,
                 "expenses":0
             }
         },
         {  
             "id":7744,
             "name":"Aiken County Schools",
             "account_statistics":{  
                 "ticket_counts":{  
                     "open":0,
                     "closed":3,
                     "hours":6,
                     "total_invoiced_amount":0,
                     "total_non_invoiced_amount":0,
                     "total_billed_amount":0,
                     "total_unbilled_amount":0,
                     "scheduled":0,
                     "followups":0
                 },
                 "timelogs":0,
                 "invoices":0,
                 "hours":6,
                 "expenses":0
             }
         }
     ],
     
     "accounts/-1": 
     {"id":0,"name":"Beach Park School District #3","note":null,"is_active":true,"is_organization":true,"bwd_number":1026,"client_contract_id":null,"number":null,"ref1":null,"ref2":null,"representative_name":"Clements, Mike","internal_location_name":null,"city":null,"state":null,"zipcode":null,"country":null,"phone1":null,"phone2":null,"address1":null,"address2":null,"email_suffix":"bpd3.org","fb_client_id":0,"qb_customer_id":0,"logo":"","files":null,"locations":[],"users":[{"id":25774,"email":"congena@bpd3.org","fullname":"Charles Ongena","phone":"","type":"user","is_accounting_contact":false}],"projects":[],"assets":null,"account_statistics":{"ticket_counts":{"open":10,"closed":4,"hours":60.0000,"total_invoiced_amount":40.0000,"total_non_invoiced_amount":0.0000,"total_billed_amount":0.0000,"total_unbilled_amount":0.0000,"scheduled":0,"followups":0},"timelogs":5,"invoices":9,"hours":60.0000,"expenses":40},"primary_contact":null,"customfields":[]},

     "queues" : 
     [{"id":"27","fullname":"Pre-Development","tickets_count":198},{"id":"271","fullname":"Future Consideration","tickets_count":76},{"id":"269","fullname":"Website","tickets_count":2},{"id":"5","fullname":"New Ticket","tickets_count":1},{"id":"272","fullname":"Mobile App","tickets_count": null}],
     
     "queues/27" : 
     [{"id":370928,"key":"4f5ijv","sla_complete_date":null,"created_time":"2015-09-10T01:08:00.0000000","updated_time":"2015-09-28T16:39:00.0000000","closed_time":null,"number":4384,"is_new_user_post":false,"is_new_tech_post":false,"prefix":"","subject":"Logo and Banner Request for Salesforce","support_group_name":"","next_step":"","resolution_category_id":null,"resolution_category_name":"","support_group_id":null,"initial_post":"Hey Anastasiia!\r\n\r\nWe need a couple of variants of logos and banners for our SalesForce listing.\r\n\r\nHere is what we need.\r\n- High Resolution logo: PNG with a transparent background that is up to 10MB in size\r\n-Banner: a 1200 x 300 pixel PNG that is up to 1MB in size\r\n-Tile Image: a 280x205 pixel PNG file that is up to 300KB in size\r\n\r\nLet me know if you have any questions on this.  Thanks!","user_id":2,"user_firstname":"Patrick","user_lastname":"Clements","user_email":"patrick.clements@bigwebapps.com","tech_id":119130,"technician_firstname":"Anastasiia","technician_lastname":"Chov","technician_email":"nastya_01.88@mail.ru","account_id":-1,"account_name":"SherpaDesk Support","location_id":null,"location_name":"","account_location_id":null,"account_location_name":"","priority_id":1,"priority_name":"General Inquiry","level":3,"level_name":"Active Plate","status":"Open","creation_category_id":null,"creation_category_name":"","days_old_in_minutes":237151,"days_old":"164d 16h 31m","class_id":268,"class_name":"SherpaDesk","total_hours":20.0000},{"id":147987,"key":"sf8c0m","sla_complete_date":null,"created_time":"2014-07-15T18:43:00.0000000","updated_time":"2014-11-25T17:38:00.0000000","closed_time":null,"number":2315,"is_new_user_post":true,"is_new_tech_post":true,"prefix":"","subject":"Email Links to Mobile App","support_group_name":"","next_step":"","resolution_category_id":null,"resolution_category_name":"","support_group_id":null,"initial_post":"This is my current concept to allow us easier access to the mobile app for testing.   I know this is not great but I don't have a better idea right now.\r\n\r\nI do not love the idea of doing redirects on the web to redirect to mobile or the app.<br><br>Following file was  uploaded: Mobile App Use and Test.png.","user_id":1,"user_firstname":"Jon","user_lastname":"Vickers","user_email":"jon.vickers@micajah.com","tech_id":1,"technician_firstname":"Jon","technician_lastname":"Vickers","technician_email":"jon.vickers@micajah.com","account_id":-1,"account_name":"SherpaDesk Support","location_id":2,"location_name":"Atlanta","account_location_id":2,"account_location_name":"Atlanta","priority_id":3,"priority_name":"UI Improvements","level":3,"level_name":"Active Plate","status":"Open","creation_category_id":null,"creation_category_name":"","days_old_in_minutes":843776,"days_old":"585d 22h 56m","class_id":5298,"class_name":"SherpaDesk / Email","total_hours":2.0000}],
    
     "tickets" :
     [{"id":370928,"key":"4f5ijv","sla_complete_date":null,"created_time":"2015-09-10T01:08:00.0000000","updated_time":"2015-09-28T16:39:00.0000000","closed_time":null,"number":4384,"is_new_user_post":false,"is_new_tech_post":false,"prefix":"","subject":"Logo and Banner Request for Salesforce","support_group_name":"","next_step":"","resolution_category_id":null,"resolution_category_name":"","support_group_id":null,"initial_post":"Hey Anastasiia!\r\n\r\nWe need a couple of variants of logos and banners for our SalesForce listing.\r\n\r\nHere is what we need.\r\n- High Resolution logo: PNG with a transparent background that is up to 10MB in size\r\n-Banner: a 1200 x 300 pixel PNG that is up to 1MB in size\r\n-Tile Image: a 280x205 pixel PNG file that is up to 300KB in size\r\n\r\nLet me know if you have any questions on this.  Thanks!","user_id":2,"user_firstname":"Patrick","user_lastname":"Clements","user_email":"patrick.clements@bigwebapps.com","tech_id":119130,"technician_firstname":"Anastasiia","technician_lastname":"Chov","technician_email":"nastya_01.88@mail.ru","account_id":-1,"account_name":"SherpaDesk Support","location_id":null,"location_name":"","account_location_id":null,"account_location_name":"","priority_id":1,"priority_name":"General Inquiry","level":3,"level_name":"Active Plate","status":"Open","creation_category_id":null,"creation_category_name":"","days_old_in_minutes":237151,"days_old":"164d 16h 31m","class_id":268,"class_name":"SherpaDesk","total_hours":20.0000},{"id":147987,"key":"sf8c0m","sla_complete_date":null,"created_time":"2014-07-15T18:43:00.0000000","updated_time":"2014-11-25T17:38:00.0000000","closed_time":null,"number":2315,"is_new_user_post":true,"is_new_tech_post":true,"prefix":"","subject":"Email Links to Mobile App","support_group_name":"","next_step":"","resolution_category_id":null,"resolution_category_name":"","support_group_id":null,"initial_post":"This is my current concept to allow us easier access to the mobile app for testing.   I know this is not great but I don't have a better idea right now.\r\n\r\nI do not love the idea of doing redirects on the web to redirect to mobile or the app.<br><br>Following file was  uploaded: Mobile App Use and Test.png.","user_id":1,"user_firstname":"Jon","user_lastname":"Vickers","user_email":"jon.vickers@micajah.com","tech_id":1,"technician_firstname":"Jon","technician_lastname":"Vickers","technician_email":"jon.vickers@micajah.com","account_id":-1,"account_name":"SherpaDesk Support","location_id":2,"location_name":"Atlanta","account_location_id":2,"account_location_name":"Atlanta","priority_id":3,"priority_name":"UI Improvements","level":3,"level_name":"Active Plate","status":"Open","creation_category_id":null,"creation_category_name":"","days_old_in_minutes":843776,"days_old":"585d 22h 56m","class_id":5298,"class_name":"SherpaDesk / Email","total_hours":2.0000}],
     
     "tickets/4f5ijv": {"id":409465,"key":"haohbb","created_time":"2015-11-11T15:51:00.0000000","closed_time":"2015-11-12T15:34:00.0000000","request_completion_date":null,"is_waiting_on_response":false,"waiting_date":null,"waiting_minutes":0,"followup_date":null,"sla_complete_date":"2015-11-12T09:57:00.0000000","sla_response_date":"2015-11-12T09:57:00.0000000","confirmed_date":null,"next_step_date":null,"updated_time":"2015-11-13T17:33:00.0000000","organization_key":"2939b13ac393462b9ae8b9e4d99b521d","department_key":1,"is_deleted":false,"user_id":3,"user_title":"","user_firstname":"Mike","user_lastname":"Clements","user_email":"mike.clements@bigwebapps.com","tech_id":1,"tech_firstname":"Jon","tech_lastname":"Vickers","tech_email":"jon.vickers@micajah.com","priority":3,"priority_name":"Bug/Hard Error","priority_id":2,"user_created_id":17927,"user_created_firstname":"Michael","user_created_lastname":"Jasien","user_created_email":"mike.jasien@sealandchem.com","status":"Open","location_id":0,"location_name":"","class_id":1,"class_name":"General Inquiry","project_id":0,"project_name":"","serial_number":"","folder_id":0,"folder_path":"","creation_category_id":0,"creation_category_name":"","subject":"Error Creating New Ticket - Sea-Land Chemical","note":"","number":4633,"prefix":"","customfields_xml":"","parts_cost":0.0000,"labor_cost":0.0000,"total_time_in_minutes":0,"misc_cost":0.0000,"travel_cost":0.0000,"request_completion_note":"","followup_note":"","initial_response":true,"sla_complete_used":523,"sla_response_used":-40522,"level":3,"level_name":"Active Plate","is_via_email_parser":true,"account_id":-1,"account_name":"SherpaDesk Support","account_location_id":0,"account_location_name":"","resolution_category_id":0,"resolution_category_name":"","is_resolved":false,"confirmed_by_name":"","is_confirmed":false,"confirmed_note":"","support_group_id":0,"support_group_name":"","is_handle_by_callcentre":false,"submission_category":"Automated Email Parser","is_user_inactive":false,"next_step":"","total_hours":0,"remaining_hours":0.0000,"estimated_time":0,"percentage_complete":0,"workpad":"","scheduled_ticket_id":0,"kb":false,"kb_type":0,"kb_publish_level":0,"kb_search_desc":"","kb_alternate_id":"","kb_helpful_count":0,"kb_portal_alias":"Getting Started","initial_post":"Hi <mike.jasien@sealandchem.com>\r\n\r\nThis ticket was created via the email parser.","is_sent_notification_email":true,"email_cc":"","related_tickets_count":0,"days_old_in_minutes":152309,"days_old":"105d 18h 29m","tech_type":"Administrator","resolution_categories":[{"name":"Duplicate Issue","id":15,"is_resolved":false,"is_active":true},{"name":"End User Submission","id":16,"is_resolved":false,"is_active":true},{"name":"No Longer Valid","id":17,"is_resolved":false,"is_active":true},{"name":"No Response","id":18,"is_resolved":false,"is_active":true},{"name":"Unable to Replicate","id":19,"is_resolved":false,"is_active":true},{"name":"Unable to Resolve","id":20,"is_resolved":false,"is_active":true}],"users":[{"user_id":3,"user_fullname":"Mike Clements","is_primary":true,"start_date":"2015-11-12T18:39:54.3900000","stop_date":null}],"technicians":[{"user_id":1,"user_fullname":"Jon Vickers","is_primary":true,"start_date":"2015-11-13T10:47:13.3300000","stop_date":null},{"user_id":2,"user_fullname":"Patrick Clements","is_primary":false,"start_date":"2015-11-13T17:31:29.9330000","stop_date":null}],"ticketlogs":[{"id":1388373,"ticket_key":"haohbb","user_id":3,"user_email":"mike.clements@bigwebapps.com","user_firstname":"Mike","user_lastname":"Clements","record_date":"2015-11-16T02:41:00.0000000","log_type":"Response","note":"Okay, think about a good long term solution because this will affect everyone that has multiple instances setup.\r\n\r\nThanks,\r\n\r\nMike Clements\r\nPhone: 866.996.1200 x 703\r\nmike.clements@bigwebapps.com\r\nbigWebApps","ticket_time_id":0,"sent_to":"Jon Vickers, Patrick Clements","is_waiting":null,"sla_used":0},{"id":1388250,"ticket_key":"haohbb","user_id":1,"user_email":"jon.vickers@micajah.com","user_firstname":"Jon","user_lastname":"Vickers","record_date":"2015-11-15T20:45:00.0000000","log_type":"Response","note":"Yes, I was asking Vladimir for clarification. I know we have a problem but I am trying to understand the best way to fix it.\r\n\r\nSome features like LDAP etc are org level features, I can’t decide if we should do the billing entirely at the ORG or  INSTANCE level","ticket_time_id":0,"sent_to":"Mike Clements, Patrick Clements","is_waiting":null,"sla_used":0},{"id":1388033,"ticket_key":"haohbb","user_id":3,"user_email":"mike.clements@bigwebapps.com","user_firstname":"Mike","user_lastname":"Clements","record_date":"2015-11-14T21:44:00.0000000","log_type":"Response","note":"Did you read this ticket?  There’s a problem with billing at the Org level.  Once instance had a CC associated to it and the other one didn’t.  So when the instance expired it locked up the active one.\r\n\r\nThanks,\r\n\r\nMike Clements\r\nPhone: 866.996.1200 x 703\r\nmike.clements@bigwebapps.com\r\nbigWebApps","ticket_time_id":0,"sent_to":"Jon Vickers, Patrick Clements","is_waiting":null,"sla_used":0},{"id":1379430,"ticket_key":"haohbb","user_id":3,"user_email":"mike.clements@bigwebapps.com","user_firstname":"Mike","user_lastname":"Clements","record_date":"2015-11-11T15:54:00.0000000","log_type":"Response","note":"Michael,\r\n\r\nIt looks like your service has expired.  Have you guys updated your credit card in the billing section lately?\r\n\r\nThank you,\r\n\r\nMike Clements\r\nPhone: 866.996.1200 x 703\r\nmike.clements@bigwebapps.com\r\nbigWebApps","ticket_time_id":0,"sent_to":"Michael Jasien, New Ticket Queue","is_waiting":null,"sla_used":3},{"id":1379416,"ticket_key":"haohbb","user_id":17927,"user_email":"mike.jasien@sealandchem.com","user_firstname":"Michael","user_lastname":"Jasien","record_date":"2015-11-11T15:51:00.0000000","log_type":"Initial Post","note":"Hi , any insight on why our helpdesk emails are bouncing?\r\n\r\nThanks,\r\nMike\r\n\r\n-----Original email parser.","ticket_time_id":0,"sent_to":"","is_waiting":null,"sla_used":0}],"assets":[],"attachments":[{"id":"tickets-tickets-files/409465/01D11C6FD2513520image001png.png","name":"01D11C6FD2513520image001png.png","url":"https://sherpadeskfiles.blob.core.windows.net/fe7f5617f00947e082232b1b2409b4e1p/tickets-tickets-files/409465/01D11C6FD2513520image001png.png","date":"2015-11-11T15:58:18.0000000","size":32555},{"id":"tickets-tickets-files/409465/C7C3A4E0E2754D80AFD25F8C117998D5.png","name":"C7C3A4E0E2754D80AFD25F8C117998D5.png","url":"https://sherpadeskfiles.blob.core.windows.net/fe7f5617f00947e082232b1b2409b4e1p/tickets-tickets-files/409465/C7C3A4E0E2754D80AFD25F8C117998D5.png","date":"2015-11-11T16:00:18.0000000","size":217029}],"classes":[{"name":"General Inquiry","id":1,"parent_id":0,"hierarchy_level":0,"sub":null,"is_lastchild":false,"is_restrict_to_techs":false,"is_active":true,"priority_id":16,"level_override":1}],"BillRate":0,"WaitingUsedBeforeReopen":0},
     
    };
