const histories = [
    {
        "token": "eth",
        "status": "pending",
        "amount": "-200",
        "steps": [
            "init", "confirm-main", "confirm-gateway",
            "confirm-eth"
        ]


    }
]

export const historyItem = {
    "token": "eth",
    "status": "pending",
    "amount": "-200",
    "icon": 'https://via.placeholder.com/50',
    "steps": [
        {
            txt: "init",
            complete: 2
        },
        {
            txt: "confirm-main",
            complete: 2
        },

        {
            txt: "confirm-gateway",
            complete: 1
        },

        {
            txt: "confirm-eth",
            complete: 0
        }

    ]
}


export default histories