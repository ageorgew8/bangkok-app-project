// js/data/tasks.js

export const tasks = [
    {
        id: 0,
        title: "Task 1: Chula -> Siriraj Hospital",
        description: "Constraints: Under 100 THB, Fastest. (Avoid Traffic)",
        origin: { lat: 13.7384, lng: 100.5315, name: "Chulalongkorn Univ." },
        dest:   { lat: 13.7593, lng: 100.4854, name: "Siriraj Hospital" },
        
        // --- App Data ---
        
        // Google Maps: 3 patterns (RH, MRT+Bus, Bus+Boat)
        google: {
            routes: [
                {
                    type: "car",
                    time: "40 min",
                    cost: "250 THB",
                    summary: "Taxi / Grab",
                    details: "Fastest but expensive",
                    tag: "Fastest"
                },
                {
                    type: "transit",
                    time: "55 min",
                    cost: "40 THB",
                    summary: "Bus + Boat",
                    details: "Bus 47 -> Chao Phraya Express",
                    tag: "Recommended"
                },
                {
                    type: "transit",
                    time: "75 min",
                    cost: "50 THB",
                    summary: "MRT + Bus",
                    details: "MRT Sam Yan -> Itsaraphap -> Bus 57"
                }
            ]
        },

        // Moovit: Focus on Transit details
        moovit: {
            routes: [
                {
                    time: "55 min",
                    summary: "Bus 47 + Orange Flag Boat",
                    details: "Walk to Sam Yan -> Bus 47 -> Tha Chang Pier -> Boat",
                    tag: "Best Value"
                },
                {
                    time: "75 min",
                    summary: "MRT Blue Line + Bus",
                    details: "Sam Yan Stn -> Itsaraphap Stn -> Bus 57",
                    tag: ""
                },
                {
                    time: "65 min",
                    summary: "Bus Only (No. 47)",
                    details: "Direct but heavy traffic area",
                    tag: "Cheapest"
                }
            ]
        },

        // ViaBus: Bus 47 approaching info
        viabus: {
            busLine: "47",
            dest: "Tha Chang",
            wait: "5 min", // Good connection
            status: "Approaching Sam Yan"
        },

        // RH Apps: Expensive option
        grab: { price: "250 THB", bike: "120 THB", wait: "4 min", time: "40 min" },
        bolt: { standard: "230 THB", eco: "210 THB", wait: "8 min", time: "40 min" }
    },

    {
        id: 1,
        title: "Task 2: Chula -> Yaowarat (Chinatown)",
        description: "Constraints: In 30 mins, Cheapest.",
        origin: { lat: 13.7384, lng: 100.5315, name: "Chulalongkorn Univ." },
        dest:   { lat: 13.7410, lng: 100.5085, name: "Yaowarat Road" },

        // Google Maps: RH is best here
        google: {
            routes: [
                {
                    type: "car",
                    time: "20 min",
                    cost: "90 THB",
                    summary: "Ride Hailing",
                    details: "Low traffic currently",
                    tag: "Fastest & Cheap"
                },
                {
                    type: "transit",
                    time: "40 min", // Delayed from 25min
                    cost: "15 THB",
                    summary: "Bus No. 21",
                    details: "Delayed due to congestion",
                    tag: "Delayed"
                },
                {
                    type: "transit",
                    time: "35 min",
                    cost: "20 THB",
                    summary: "MRT Blue Line",
                    details: "Sam Yan -> Wat Mangkon + Walk 5min"
                }
            ]
        },

        // Moovit
        moovit: {
            routes: [
                {
                    time: "35 min",
                    summary: "MRT Blue Line",
                    details: "Sam Yan -> Wat Mangkon",
                    tag: "Reliable"
                },
                {
                    time: "40 min",
                    summary: "Bus 21",
                    details: "Wait 15 min + Travel 25 min",
                    tag: "Warning: Delay"
                },
                {
                    time: "20 min",
                    summary: "Grab / Taxi",
                    details: "Direct drive",
                    tag: "Fastest"
                }
            ]
        },

        // ViaBus: Shows delay context
        viabus: {
            busLine: "21",
            dest: "Wongwian Yai",
            wait: "15 min", // Delayed
            status: "Heavy Traffic at Rama 4"
        },

        // RH Apps: Cheap and Fast (Winner)
        grab: { price: "90 THB", bike: "50 THB", wait: "3 min", time: "20 min" },
        bolt: { standard: "75 THB", eco: "70 THB", wait: "6 min", time: "20 min" }
    },

    {
        id: 2,
        title: "Task 3: Chula -> Chatuchak Market",
        description: "Constraints: Rush Hour, Fastest. (Traffic Jam!)",
        origin: { lat: 13.7384, lng: 100.5315, name: "Chulalongkorn Univ." },
        dest:   { lat: 13.8016, lng: 100.5524, name: "Chatuchak Market" },

        // Google Maps: Traffic makes RH slow
        google: {
            routes: [
                {
                    type: "transit",
                    time: "40 min",
                    cost: "44 THB",
                    summary: "BTS Sukhumvit Line",
                    details: "Siam -> Mo Chit",
                    tag: "Fastest / No Traffic"
                },
                {
                    type: "car",
                    time: "60 min", // Traffic!
                    cost: "300 THB",
                    summary: "Taxi / Car",
                    details: "Heavy traffic on Phaya Thai Rd",
                    tag: "Slow"
                },
                {
                    type: "transit",
                    time: "45 min",
                    cost: "42 THB",
                    summary: "MRT Blue Line",
                    details: "Sam Yan -> Chatuchak Park"
                }
            ]
        },

        // Moovit
        moovit: {
            routes: [
                {
                    time: "40 min",
                    summary: "BTS Skytrain",
                    details: "Walk to Siam -> BTS Mo Chit",
                    tag: "Recommended"
                },
                {
                    time: "45 min",
                    summary: "MRT Subway",
                    details: "Sam Yan -> Chatuchak Park",
                    tag: "Good Alternative"
                },
                {
                    time: "70 min",
                    summary: "Bus 29 / 34",
                    details: "Very crowded / Traffic jam",
                    tag: "Avoid"
                }
            ]
        },

        // ViaBus
        viabus: {
            busLine: "29",
            dest: "Rangsit",
            wait: "20 min",
            status: "Stuck in Traffic"
        },

        // RH Apps: Surge Pricing & Slow (Loser)
        grab: { price: "320 THB", bike: "150 THB", wait: "10 min", time: "60 min" },
        bolt: { standard: "280 THB", eco: "260 THB", wait: "15 min", time: "60 min" }
    }
];