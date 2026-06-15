// RoutineDatabase.js — 성별·고민·피부타입별 상세 루틴 스텝
// 키 형식: "성별-고민타입-피부타입"  F/M · A(Acne)/P(Hyperpigmentation) · O/D/N/C
// 현재 결과 렌더링 미사용. 향후 gender 파라미터 연동 시 ResultService에서 import.

export const ROUTINE_DATABASE = {
    "F-A-O": {
        title: "Female · Acne · Oily Skin",
        morning: [
            { name: "Mild gel cleanser (pH 5.5)", desc: "Cleanse with lukewarm water for 30 sec, no harsh scrubbing" },
            { name: "Salicylic acid 2% toner", desc: "Wipe entire face with cotton pad (max 5x/week)" },
            { name: "Niacinamide 10% serum", desc: "Apply thin layer across entire face" },
            { name: "Oil-free water-gel moisturizer", desc: "Pat gently until fully absorbed" },
            { name: "SPF50+ PA++++ sunscreen (oil-free)", desc: "Apply coin-sized amount 30 min before going out" }
        ],
        out: [{ name: "SPF50+ sun stick", desc: "Reapply every 2-3 hours" }],
        home: [
            { name: "Micellar water", desc: "Remove pollutants gently with cotton pad" },
            { name: "Calming toner mist", desc: "Spritz lightly across face" }
        ],
        evening: [
            { name: "Gel cleanser", desc: "Cleanse with lukewarm water" },
            { name: "Salicylic acid 2% toner", desc: "Focus on T-zone" },
            { name: "Niacinamide + Azelaic acid serum", desc: "Apply to entire face (intensive night treatment)" },
            { name: "Oil-free night gel", desc: "Finish with thin layer" }
        ]
    },
    "F-A-D": {
        title: "Female · Acne · Dry Skin",
        morning: [
            { name: "Hydrating mild foam cleanser", desc: "Gentle circular motions for 5-10 sec" },
            { name: "Hydrating toner", desc: "Hyaluronic Acid - Press gently into skin" },
            { name: "Niacinamide 5% serum", desc: "Apply to entire face (low concentration)" },
            { name: "Ceramide cream", desc: "Deep moisture" },
            { name: "SPF50+ hydrating sunscreen", desc: "Apply 30 min before going out" }
        ],
        out: [{ name: "Hydrating sun stick SPF50+", desc: "Reapply as needed" }],
        home: [{ name: "Mild cleansing water then sheet mask", desc: "Leave on 10-15 min" }],
        evening: [
            { name: "Cleansing balm then foam", desc: "Double cleanse" },
            { name: "Hydrating toner", desc: "Layer 2-3 times" },
            { name: "Benzoyl peroxide 2.5%", desc: "Spot treatment only on breakouts" },
            { name: "Ceramide + Peptide cream", desc: "Apply generously" }
        ]
    },
    "F-A-N": {
        title: "Female · Acne · Normal Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "30 sec gentle massage" },
            { name: "BHA toner", desc: "Apply all over (3-4x/week)" },
            { name: "Niacinamide serum", desc: "All over" },
            { name: "Light lotion moisturizer", desc: "Pat until absorbed" },
            { name: "SPF50+ sunscreen", desc: "Apply 30 min before" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply every 2-3 hours" }],
        home: [{ name: "Micellar water", desc: "Light cleanse" }],
        evening: [
            { name: "Foam cleanser", desc: "Second cleanse" },
            { name: "Salicylic acid serum", desc: "Alternate with Retinol 0.025%" },
            { name: "Lotion moisturizer", desc: "Finish" }
        ]
    },
    "F-A-C": {
        title: "Female · Acne · Combination Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse with lukewarm water" },
            { name: "BHA toner", desc: "Focus on T-zone" },
            { name: "Niacinamide serum", desc: "Balancing effect" },
            { name: "Gel-cream moisturizer", desc: "Zone-specific application" },
            { name: "SPF50+ sunscreen", desc: "Apply all over" }
        ],
        out: [{ name: "SPF50+ powder", desc: "Reapply on T-zone" }],
        home: [{ name: "Toning mist", desc: "Spritz and pat" }],
        evening: [
            { name: "Cleansing oil then foam", desc: "Double cleanse" },
            { name: "Niacinamide + Azelaic acid", desc: "All over" },
            { name: "Gel-cream", desc: "Finish" }
        ]
    },
    "F-P-O": {
        title: "Female · Hyperpigmentation · Oily Skin",
        morning: [
            { name: "Mild gel cleanser", desc: "Cleanse with lukewarm water" },
            { name: "Vitamin C serum (L-Ascorbic Acid 15%)", desc: "Apply thin layer (morning only)" },
            { name: "Niacinamide toner", desc: "Apply all over" },
            { name: "Oil-free water-gel moisturizer", desc: "Light application" },
            { name: "SPF50+ PA++++ sunscreen", desc: "Sun protection is #1 brightening step" }
        ],
        out: [{ name: "SPF50+", desc: "Reapply every 2-3 hours" }],
        home: [{ name: "Micellar water then mist", desc: "Remove pollutants + calm" }],
        evening: [
            { name: "Gel cleanser", desc: "Cleanse" },
            { name: "Alpha Arbutin + Niacinamide", desc: "Focus on pigmented areas" },
            { name: "Retinol 0.05%", desc: "Focus on dark spots (start 3x/week)" },
            { name: "Oil-free night gel", desc: "Finish" }
        ]
    },
    "F-P-D": {
        title: "Female · Hyperpigmentation · Dry Skin",
        morning: [
            { name: "Hydrating foam cleanser", desc: "Gentle cleanse" },
            { name: "Vitamin C serum 10%", desc: "All over (low concentration)" },
            { name: "Hyaluronic acid essence", desc: "Layer for moisture" },
            { name: "Ceramide cream", desc: "Apply generously" },
            { name: "SPF50+ hydrating sunscreen", desc: "Apply 30 min before" }
        ],
        out: [{ name: "Hydrating sun stick", desc: "Reapply" }],
        home: [{ name: "Cleansing water then sheet mask", desc: "Calm + hydrate" }],
        evening: [
            { name: "Cleansing balm then foam", desc: "Double cleanse" },
            { name: "Alpha Arbutin + Niacinamide", desc: "All over" },
            { name: "Retinol 0.025%", desc: "Low concentration" },
            { name: "Rich night cream", desc: "Apply generously" }
        ]
    },
    "F-P-N": {
        title: "Female · Hyperpigmentation · Normal Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "Vitamin C serum 15-20%", desc: "All over" },
            { name: "Lotion moisturizer", desc: "All over" },
            { name: "SPF50+ PA++++ sunscreen", desc: "Apply generously" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Micellar water", desc: "Light cleanse" }],
        evening: [
            { name: "Foam cleanser", desc: "Cleanse" },
            { name: "AHA toner", desc: "3x/week, exfoliate + improve pigmentation" },
            { name: "Retinol 0.05%", desc: "Every other night" },
            { name: "Lotion moisturizer", desc: "Finish" }
        ]
    },
    "F-P-C": {
        title: "Female · Hyperpigmentation · Combination Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "Vitamin C serum", desc: "All over" },
            { name: "Gel-cream", desc: "Thin on T-zone, thicker on cheeks" },
            { name: "SPF50+ PA++++", desc: "Apply generously" }
        ],
        out: [{ name: "SPF50+ powder", desc: "Reapply on T-zone" }],
        home: [{ name: "Micellar water then mist", desc: "Calm + clean" }],
        evening: [
            { name: "Cleansing oil then foam", desc: "Double cleanse" },
            { name: "Alpha Arbutin serum", desc: "Focus on pigmented areas" },
            { name: "Retinol", desc: "Focus on cheeks" },
            { name: "Gel-cream", desc: "Finish" }
        ]
    },
    "M-A-O": {
        title: "Male · Acne · Oily Skin",
        morning: [
            { name: "Deep cleansing gel (Salicylic Acid)", desc: "Massage 30sec-1min" },
            { name: "Salicylic acid 2% toner", desc: "Wipe entire face" },
            { name: "Oil-free matte lotion", desc: "Light application" },
            { name: "SPF50+ oil-control sunscreen", desc: "Apply before going out" }
        ],
        out: [{ name: "Oil-control powder", desc: "Focus reapplication on T-zone" }],
        home: [{ name: "Micellar water", desc: "Remove pollutants" }],
        evening: [
            { name: "Salicylic acid foam", desc: "Thorough cleanse" },
            { name: "Niacinamide + Azelaic acid", desc: "All over" },
            { name: "Oil-free night gel", desc: "Finish" }
        ]
    },
    "M-A-D": {
        title: "Male · Acne · Dry Skin",
        morning: [
            { name: "Hydrating foam cleanser", desc: "Gentle cleanse" },
            { name: "Hydrating toner", desc: "All over" },
            { name: "Ceramide lotion", desc: "Apply for moisture" },
            { name: "SPF50+ hydrating sunscreen", desc: "Apply before going out" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Cleansing water", desc: "Gentle cleanse" }],
        evening: [
            { name: "Cleansing balm then foam", desc: "Double cleanse" },
            { name: "Benzoyl peroxide 2.5%", desc: "Spot treatment" },
            { name: "Ceramide cream", desc: "Apply generously" }
        ]
    },
    "M-A-N": {
        title: "Male · Acne · Normal Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "BHA toner", desc: "All over (3-4x/week)" },
            { name: "Lotion moisturizer", desc: "Pat until absorbed" },
            { name: "SPF50+ sunscreen", desc: "Apply before going out" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Micellar water", desc: "Light cleanse" }],
        evening: [
            { name: "Foam cleanser", desc: "Cleanse" },
            { name: "Retinol 0.025% or Salicylic acid", desc: "Alternate (2-3x/week)" },
            { name: "Lotion", desc: "Finish" }
        ]
    },
    "M-A-C": {
        title: "Male · Acne · Combination Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "BHA toner", desc: "Focus on T-zone" },
            { name: "Gel moisturizer", desc: "Thin on T-zone, thicker on cheeks" },
            { name: "SPF50+", desc: "All over" }
        ],
        out: [{ name: "SPF50+ powder", desc: "Reapply" }],
        home: [{ name: "Toning mist", desc: "Calm skin" }],
        evening: [
            { name: "Cleansing oil then foam", desc: "Double cleanse" },
            { name: "Azelaic acid serum", desc: "All over" },
            { name: "Gel-cream", desc: "Finish" }
        ]
    },
    "M-P-O": {
        title: "Male · Hyperpigmentation · Oily Skin",
        morning: [
            { name: "Deep cleansing gel", desc: "Cleanse" },
            { name: "Vitamin C serum 15%", desc: "All over (morning only)" },
            { name: "Oil-free matte lotion", desc: "Light application" },
            { name: "SPF50+ oil-control sunscreen", desc: "Apply generously" }
        ],
        out: [{ name: "Oil-control sun stick", desc: "Reapply" }],
        home: [{ name: "Micellar water", desc: "Remove pollutants" }],
        evening: [
            { name: "Gel cleanser", desc: "Cleanse" },
            { name: "Niacinamide + Alpha Arbutin", desc: "Focus application" },
            { name: "Retinol 0.05%", desc: "Focus on dark spots" },
            { name: "Oil-free night gel", desc: "Finish" }
        ]
    },
    "M-P-D": {
        title: "Male · Hyperpigmentation · Dry Skin",
        morning: [
            { name: "Hydrating foam cleanser", desc: "Gentle cleanse" },
            { name: "Vitamin C 10% serum", desc: "All over" },
            { name: "Ceramide cream", desc: "Apply generously" },
            { name: "SPF50+ hydrating sunscreen", desc: "Apply before" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Sheet mask", desc: "Calm for 10-15 min" }],
        evening: [
            { name: "Cleansing balm then foam", desc: "Double cleanse" },
            { name: "Alpha Arbutin serum", desc: "All over" },
            { name: "Retinol 0.025%", desc: "Small amount" },
            { name: "Rich night cream", desc: "Apply generously" }
        ]
    },
    "M-P-N": {
        title: "Male · Hyperpigmentation · Normal Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "Vitamin C serum 15-20%", desc: "All over" },
            { name: "SPF50+ PA++++", desc: "Apply generously" }
        ],
        out: [{ name: "Sun stick", desc: "Reapply" }],
        home: [{ name: "Micellar water", desc: "Light cleanse" }],
        evening: [
            { name: "Foam cleanser", desc: "Cleanse" },
            { name: "AHA toner", desc: "3x/week, improve pigmentation" },
            { name: "Retinol 0.05%", desc: "Every other night" },
            { name: "Lotion", desc: "Finish" }
        ]
    },
    "M-P-C": {
        title: "Male · Hyperpigmentation · Combination Skin",
        morning: [
            { name: "Mild foam cleanser", desc: "Cleanse" },
            { name: "Vitamin C serum", desc: "All over" },
            { name: "SPF50+ PA++++", desc: "Apply generously" }
        ],
        out: [{ name: "SPF50+ powder", desc: "Reapply" }],
        home: [{ name: "Micellar water then mist", desc: "Cleanse + calm" }],
        evening: [
            { name: "Cleansing oil then foam", desc: "Double cleanse" },
            { name: "Alpha Arbutin + Vitamin C", desc: "Focus on pigmented areas" },
            { name: "Retinol", desc: "Focus on cheeks" },
            { name: "Gel-cream", desc: "Finish" }
        ]
    }
};
