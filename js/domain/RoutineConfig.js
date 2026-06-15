// RoutineConfig.js — 결과 화면 에셋·카피·추천 설정·상품 데이터
// ROUTINE_DATABASE(상세 루틴 스텝)는 RoutineDatabase.js에서 관리. 이 파일은 import하지 않음.

export const RESULT_ASSETS = {
    userFallbackFemale: '../assets/image/Woman_model_YUNN.png',
    userFallbackMale:   '../assets/image/Man_model_YUNN.png',
    cleanser:           '../assets/image/Facewash_YUNN.png',
    serum:              '../assets/image/Serum_YUNN.png',
    sunscreen:          '../assets/image/Sunscreen_YUNN.png',
    moisturiser:        '../assets/image/Moisturiser_YUNN.png',
    cleanserCard:       '../assets/image/Facewash_top_selling.png',
    serumCard:          '../assets/image/Serum_top_selling.png',
    sunscreenCard:      '../assets/image/Sunscreen_YUNN.png',
    creamCard:          '../assets/image/Moisturiser_top_selling.png'
};

export const RESULT_COPY_VARIANTS = {
    Acne: {
        focus: 'calmer pores and breakout control',
        typeSuffix: 'Clear Balance type',
        concernKeyword: 'Breakouts',
        summary: 'Your skin is asking for calm, consistent care. Delhi heat, pollution, and daily stress may be triggering congestion, so barrier-friendly acne care matters most right now.',
        serumName: 'Brightening Serum',
        serumTag: 'Treat',
        serumDesc: 'Helps improve uneven skin tone and prevents pigmentation.',
        serumWhy: 'Niacinamide and botanical extracts help support a more even-looking complexion while keeping the skin hydrated.'
    },
    Marks: {
        focus: 'post-acne marks and tone recovery',
        typeSuffix: 'Post-Acne Glow type',
        concernKeyword: 'Acne Marks',
        summary: 'Your skin may be healing from previous breakouts. The priority is to protect your barrier while supporting a more even, brighter-looking tone.',
        serumName: 'Tone Repair Serum',
        serumTag: 'Repair',
        serumDesc: 'Targets visible marks while supporting hydrated, resilient skin.',
        serumWhy: 'Niacinamide and brightening botanicals help reduce the look of post-breakout marks over time.'
    },
    Pigmentation: {
        focus: 'dark spots and UV defense',
        typeSuffix: 'Bright Shield type',
        concernKeyword: 'Dark Spots',
        summary: 'Your skin needs steady brightening support and stronger daily UV protection. Pollution and sun exposure can make spots look more visible without consistent care.',
        serumName: 'Brightening Serum',
        serumTag: 'Brighten',
        serumDesc: 'Helps improve dark spots and supports a clearer-looking complexion.',
        serumWhy: 'Brightening actives and antioxidants help support tone correction while sunscreen protects progress.'
    },
    Tone: {
        focus: 'dullness and uneven tone',
        typeSuffix: 'Even Glow type',
        concernKeyword: 'Uneven Tone',
        summary: 'Your skin tone looks like it needs balance and radiance support. Gentle exfoliation, hydration, and daily protection can help your complexion look more even.',
        serumName: 'Even Tone Essence',
        serumTag: 'Glow',
        serumDesc: 'Supports radiance and helps improve the look of patchy, uneven tone.',
        serumWhy: 'Hydrating and tone-supporting ingredients help skin look smoother and more balanced.'
    }
};

export const RESULT_SKIN_VARIANTS = {
    Oily: {
        typePrefix: 'Oil-Control',
        keyword: 'Oily',
        balanceAdjust: { hydration: -5, barrier: -4, oil: -12, calmness: -3 },
        cleanserDesc: 'Removes excess oil and impurities without stripping your skin barrier.',
        cleanserWhy: 'Helps keep pores clear and oil balanced, which may support a calmer complexion for oily and sensitive skin.',
        moisturiserName: 'Light Gel Moisturiser'
    },
    Dry: {
        typePrefix: 'Hydration',
        keyword: 'Dry',
        balanceAdjust: { hydration: -16, barrier: -10, oil: 8, calmness: -4 },
        cleanserDesc: 'Cleanses gently while helping your skin avoid that tight after-wash feeling.',
        cleanserWhy: 'A mild cleanser helps preserve moisture so dry skin can recover without extra irritation.',
        moisturiserName: 'Ceramide Moisture Cream'
    },
    Combination: {
        typePrefix: 'Dual-Zone',
        keyword: 'Combination',
        balanceAdjust: { hydration: -8, barrier: -5, oil: -7, calmness: -2 },
        cleanserDesc: 'Balances oil-prone areas while staying gentle on drier cheeks.',
        cleanserWhy: 'A balanced cleanser helps manage the T-zone without over-cleansing the rest of your face.',
        moisturiserName: 'Balancing Gel Cream'
    },
    Normal: {
        typePrefix: 'Sensitive Glow',
        keyword: 'Balanced',
        balanceAdjust: { hydration: 2, barrier: 4, oil: 2, calmness: 2 },
        cleanserDesc: 'Keeps your skin clean and comfortable without disrupting your natural balance.',
        cleanserWhy: 'A gentle cleanser supports consistency while keeping already balanced skin steady.',
        moisturiserName: 'Daily Balance Lotion'
    }
};

export const RESULT_RECOMMENDATION_CONFIG = {};
Object.keys(RESULT_SKIN_VARIANTS).forEach((skinType) => {
    Object.keys(RESULT_COPY_VARIANTS).forEach((concernType) => {
        const skin = RESULT_SKIN_VARIANTS[skinType];
        const concern = RESULT_COPY_VARIANTS[concernType];
        RESULT_RECOMMENDATION_CONFIG[`${skinType}|${concernType}`] = {
            skinTypeName: `${skin.typePrefix} ${concern.typeSuffix}`,
            keywords: [skin.keyword, concern.concernKeyword, skinType === 'Normal' ? 'Glow' : 'Barrier Stress'],
            summary: concern.summary,
            focus: concern.focus,
            balanceAdjust: skin.balanceAdjust,
            routines: {
                morning: [
                    {
                        name: 'Gentle Cleanser',
                        tag: 'Cleanse',
                        image: RESULT_ASSETS.cleanser,
                        description: skin.cleanserDesc,
                        why: skin.cleanserWhy,
                        how: 'Lather a pea-sized amount with water. Massage gently for 30-40 seconds, then rinse thoroughly with lukewarm water.',
                        tip: 'Over-cleansing can weaken your barrier. Once in the morning is enough.'
                    },
                    {
                        name: concern.serumName,
                        tag: concern.serumTag,
                        image: RESULT_ASSETS.serum,
                        description: concern.serumDesc,
                        why: concern.serumWhy,
                        how: 'Apply 2-3 drops on your face and gently pat until fully absorbed.',
                        tip: concernType === 'Pigmentation' ? 'Use consistently with sunscreen to protect brightening progress.' : 'Focus on areas that need the most support.'
                    },
                    {
                        name: 'Daily Sunscreen',
                        tag: 'Protect',
                        image: RESULT_ASSETS.sunscreen,
                        description: 'Protect against UV rays and prevents dark spots and early aging.',
                        why: 'Daily UV protection helps prevent pigmentation from getting darker and supports overall skin health.',
                        how: 'Apply generously as the last step of your skincare routine. Reapply every 2-3 hours when outdoors.',
                        tip: 'Sunscreen is your best anti-aging and brightening step.'
                    }
                ],
                evening: [
                    {
                        name: 'Gentle Cleanser',
                        tag: 'Cleanse',
                        image: RESULT_ASSETS.cleanser,
                        description: skin.cleanserDesc,
                        why: 'Evening cleansing removes sunscreen, sweat, and pollution so your treatment products can work better.',
                        how: 'Massage gently with lukewarm water for 40-60 seconds, then rinse without scrubbing.',
                        tip: 'If you wore heavy sunscreen, cleanse twice with the same gentle pressure.'
                    },
                    {
                        name: concern.serumName,
                        tag: 'Repair',
                        image: RESULT_ASSETS.serum,
                        description: concern.serumDesc,
                        why: concern.serumWhy,
                        how: 'Apply a thin layer after cleansing. Start slowly if your skin feels sensitive.',
                        tip: 'Night care is where repair compounds quietly. Keep it consistent.'
                    },
                    {
                        name: skin.moisturiserName,
                        tag: 'Seal',
                        image: RESULT_ASSETS.moisturiser,
                        description: 'Locks in hydration and supports your skin barrier overnight.',
                        why: 'Moisturising helps reduce irritation and keeps your routine sustainable.',
                        how: 'Apply a comfortable layer as the final evening step.',
                        tip: 'A steady barrier often improves how your skin responds to active ingredients.'
                    }
                ]
            }
        };
    });
});

const RESULT_TYPE_PROFILES = {
    'Oily|Acne': {
        skinTypeName: 'Oil Clear',
        keywords: ['Oily', 'Acne-prone', 'Sebum Control'],
        focus: 'consistent oil control',
        summary: "Your skin tends to produce more oil than it needs — and in India's heat and humidity, that builds up fast. Lightweight hydration and consistent oil control can help keep your skin clear, calm, and balanced through the day."
    },
    'Oily|Marks': {
        skinTypeName: 'Glow Restore',
        keywords: ['Oily', 'Post-acne', 'Repair'],
        focus: 'gentle brightening care',
        summary: 'Your skin is still recovering from past breakouts — and UV exposure can make those marks linger longer than expected. With steady barrier support and gentle brightening care, your skin tone can gradually become clearer and more even.'
    },
    'Oily|Pigmentation': {
        skinTypeName: 'Radiance Shield',
        keywords: ['Oily', 'Pigmentation', 'UV Defense'],
        focus: 'Consistent sunscreen and brightening care',
        summary: 'Your skin may be more reactive to pigmentation triggers — and daily UV exposure makes that harder to manage without the right protection. Consistent sunscreen and brightening care can help prevent dark spots from deepening and keep your natural radiance visible.'
    },
    'Oily|Tone': {
        skinTypeName: 'Glow Balance',
        keywords: ['Oily', 'Uneven Tone', 'Glow'],
        focus: 'Lightweight hydration and tone-balancing care',
        summary: 'Your skin is producing more oil than it needs, and that imbalance is showing up as shine and uneven tone. Lightweight hydration and tone-balancing care can help your skin find its natural rhythm — and bring back its glow.'
    },
    'Dry|Acne': {
        skinTypeName: 'Calm Repair',
        keywords: ['Dry', 'Breakout', 'Barrier'],
        focus: 'Calming hydration and barrier-focused care',
        summary: 'Your skin is dealing with dryness and breakouts at the same time — which happens when the skin barrier becomes weakened and more reactive. Calming hydration and barrier-focused care can help reduce irritation and bring your skin back to a more comfortable balance.'
    },
    'Dry|Marks': {
        skinTypeName: 'Barrier Glow',
        keywords: ['Dry', 'Repair', 'Barrier Stress'],
        focus: 'Rebuilding your skin barrier',
        summary: 'Your skin is in recovery mode — and without enough moisture, post-acne marks tend to stay more visible and healing feels slower. Rebuilding your skin barrier with gentle, nourishing care can help speed up recovery and bring back a healthy glow over time.'
    },
    'Dry|Pigmentation': {
        skinTypeName: 'Soft Glow',
        keywords: ['Dry', 'Pigmentation', 'Dehydrated'],
        focus: 'Deep hydration and consistent brightening care',
        summary: 'Your skin is low on moisture — and when hydration drops, dark spots and uneven areas tend to look more visible than they actually are. Deep hydration and consistent brightening care can help even out your tone and bring your natural glow back to the surface.'
    },
    'Dry|Tone': {
        skinTypeName: 'Soft Bright',
        keywords: ['Dry', 'Hydration', 'Even Tone'],
        focus: 'moisture levels are well maintained',
        summary: 'Your skin has natural glow — it just needs more hydration to show it. When moisture levels are well maintained, skin looks noticeably smoother, more even, and more radiant.'
    },
    'Combination|Acne': {
        skinTypeName: 'Clear Harmony',
        keywords: ['Combination', 'Acne-prone', 'Oil Balance'],
        focus: 'Balanced oil control and lightweight hydration',
        summary: 'Your skin runs oily in some areas and feels tight or irritated in others — making breakouts harder to predict and manage. Balanced oil control and lightweight hydration working together can help your skin feel more settled and consistently clearer.'
    },
    'Combination|Marks': {
        skinTypeName: 'Clear Harmony',
        keywords: ['Combination', 'Acne-prone', 'Oil Balance'],
        focus: 'Balanced oil control and lightweight hydration',
        summary: 'Your skin runs oily in some areas and feels tight or irritated in others — making breakouts harder to predict and manage. Balanced oil control and lightweight hydration working together can help your skin feel more settled and consistently clearer.'
    },
    'Combination|Pigmentation': {
        skinTypeName: 'Glow Harmony',
        keywords: ['Combination', 'Uneven Tone', 'Radiance'],
        focus: 'Tone-balancing care, lightweight hydration, and daily sun protection',
        summary: "Your skin is dealing with both oil imbalance and uneven tone — and UV exposure makes it harder for your skin to stay bright and balanced. Tone-balancing care, lightweight hydration, and daily sun protection can work together to bring your skin's radiance back into harmony."
    },
    'Combination|Tone': {
        skinTypeName: 'Glow Harmony',
        keywords: ['Combination', 'Uneven Tone', 'Radiance'],
        focus: 'Tone-balancing care, lightweight hydration, and daily sun protection',
        summary: "Your skin is dealing with both oil imbalance and uneven tone — and UV exposure makes it harder for your skin to stay bright and balanced. Tone-balancing care, lightweight hydration, and daily sun protection can work together to bring your skin's radiance back into harmony."
    },
    'Normal|Acne': {
        skinTypeName: 'Pure Radiance',
        keywords: ['Normal', 'Natural Glow', 'Balanced'],
        focus: 'hydration and sun protection',
        summary: 'Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care. Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.'
    },
    'Normal|Marks': {
        skinTypeName: 'Pure Radiance',
        keywords: ['Normal', 'Natural Glow', 'Balanced'],
        focus: 'hydration and sun protection',
        summary: 'Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care. Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.'
    },
    'Normal|Pigmentation': {
        skinTypeName: 'Pure Radiance',
        keywords: ['Normal', 'Natural Glow', 'Balanced'],
        focus: 'hydration and sun protection',
        summary: 'Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care. Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.'
    },
    'Normal|Tone': {
        skinTypeName: 'Pure Radiance',
        keywords: ['Normal', 'Natural Glow', 'Balanced'],
        focus: 'hydration and sun protection',
        summary: 'Your skin is in a genuinely good place — balanced, resilient, and responding well to daily care. Keeping up with hydration and sun protection is what helps your natural radiance stay exactly where it is.'
    }
};

Object.entries(RESULT_TYPE_PROFILES).forEach(([profileKey, profile]) => {
    if (RESULT_RECOMMENDATION_CONFIG[profileKey]) {
        Object.assign(RESULT_RECOMMENDATION_CONFIG[profileKey], profile);
    }
});

export const RESULT_PRODUCTS = [
    {
        id: 'cleanser-foam',
        name: 'Anua Heartleaf Pore Deep Cleansing Foam',
        image: RESULT_ASSETS.cleanserCard,
        discount: '15%',
        price: '₹1,500',
        original: '₹2,000',
        rating: '4.3',
        reviews: '1,000'
    },
    {
        id: 'niacin-essence',
        name: 'Nacific Phyto Niacin Whitening Essence',
        image: RESULT_ASSETS.serumCard,
        discount: '20%',
        price: '₹1,350',
        original: '₹2,000',
        rating: '4.5',
        reviews: '978'
    },
    {
        id: 'relief-sun',
        name: 'Beauty of Joseon Relief sun SPF50+ PA++++',
        image: RESULT_ASSETS.sunscreenCard,
        discount: '15%',
        price: '₹1,500',
        original: '₹2,000',
        rating: '4.8',
        reviews: '975'
    },
    {
        id: 'ceramide-cream',
        name: 'ILLIYOON Ceramide Ato Concentrate Cream',
        image: RESULT_ASSETS.creamCard,
        discount: '15%',
        price: '₹1,500',
        original: '₹2,000',
        rating: '4.5',
        reviews: '1,002'
    }
];

