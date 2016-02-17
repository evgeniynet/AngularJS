export let MOCK_COUNTS ={new_messages:1,open_all:284,open_as_tech:10,open_as_alttech:2,open_as_user:1001,onhold:3,reminder:0,parts_on_order:0,unconfirmed:45,waiting:2};

export let MOCK_ACCOUNTS = [  
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
];

export let MOCK_QUEUES = [{"id":"27","fullname":"Pre-Development","tickets_count":98},{"id":"271","fullname":"Future Consideration","tickets_count":76},{"id":"269","fullname":"Website","tickets_count":2},{"id":"5","fullname":"New Ticket","tickets_count":1},{"id":"272","fullname":"Mobile App","tickets_count":0}];
