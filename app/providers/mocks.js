export let MOCKS = 
    {"tickets/counts":
     { new_messages:1,open_all:284,open_as_tech:10,open_as_alttech:2,open_as_user:1001,onhold:3,reminder:0,parts_on_order:0,unconfirmed:45,waiting:2},

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

     "queues" : 
     [{"id":"27","fullname":"Pre-Development","tickets_count":198},{"id":"271","fullname":"Future Consideration","tickets_count":76},{"id":"269","fullname":"Website","tickets_count":2},{"id":"5","fullname":"New Ticket","tickets_count":1},{"id":"272","fullname":"Mobile App","tickets_count":0}],
    
     "tickets" :
     [{"id":370928,"key":"4f5ijv","sla_complete_date":null,"created_time":"2015-09-10T01:08:00.0000000","updated_time":"2015-09-28T16:39:00.0000000","closed_time":null,"number":4384,"is_new_user_post":false,"is_new_tech_post":false,"prefix":"","subject":"Logo and Banner Request for Salesforce","support_group_name":"","next_step":"","resolution_category_id":null,"resolution_category_name":"","support_group_id":null,"initial_post":"Hey Anastasiia!\r\n\r\nWe need a couple of variants of logos and banners for our SalesForce listing.\r\n\r\nHere is what we need.\r\n- High Resolution logo: PNG with a transparent background that is up to 10MB in size\r\n-Banner: a 1200 x 300 pixel PNG that is up to 1MB in size\r\n-Tile Image: a 280x205 pixel PNG file that is up to 300KB in size\r\n\r\nLet me know if you have any questions on this.  Thanks!","user_id":2,"user_firstname":"Patrick","user_lastname":"Clements","user_email":"patrick.clements@bigwebapps.com","tech_id":119130,"technician_firstname":"Anastasiia","technician_lastname":"Chov","technician_email":"nastya_01.88@mail.ru","account_id":-1,"account_name":"SherpaDesk Support","location_id":null,"location_name":"","account_location_id":null,"account_location_name":"","priority_id":1,"priority_name":"General Inquiry","level":3,"level_name":"Active Plate","status":"Open","creation_category_id":null,"creation_category_name":"","days_old_in_minutes":237151,"days_old":"164d 16h 31m","class_id":268,"class_name":"SherpaDesk","total_hours":20.0000},{"id":147987,"key":"sf8c0m","sla_complete_date":null,"created_time":"2014-07-15T18:43:00.0000000","updated_time":"2014-11-25T17:38:00.0000000","closed_time":null,"number":2315,"is_new_user_post":true,"is_new_tech_post":true,"prefix":"","subject":"Email Links to Mobile App","support_group_name":"","next_step":"","resolution_category_id":null,"resolution_category_name":"","support_group_id":null,"initial_post":"This is my current concept to allow us easier access to the mobile app for testing.   I know this is not great but I don't have a better idea right now.\r\n\r\nI do not love the idea of doing redirects on the web to redirect to mobile or the app.<br><br>Following file was  uploaded: Mobile App Use and Test.png.","user_id":1,"user_firstname":"Jon","user_lastname":"Vickers","user_email":"jon.vickers@micajah.com","tech_id":1,"technician_firstname":"Jon","technician_lastname":"Vickers","technician_email":"jon.vickers@micajah.com","account_id":-1,"account_name":"SherpaDesk Support","location_id":2,"location_name":"Atlanta","account_location_id":2,"account_location_name":"Atlanta","priority_id":3,"priority_name":"UI Improvements","level":3,"level_name":"Active Plate","status":"Open","creation_category_id":null,"creation_category_name":"","days_old_in_minutes":843776,"days_old":"585d 22h 56m","class_id":5298,"class_name":"SherpaDesk / Email","total_hours":2.0000}]
    };
