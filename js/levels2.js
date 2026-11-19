// RAMAYANA: PATH OF DHARMA - levels 9-14 (message 194, the linear telling after the childhood interleave).
// Levels 15-30 stay listed, not yet playable. Wording is original, after the public-domain Valmiki Ramayana.
(function () {
  'use strict';
  function L(en, hi) { return { en: en, hi: hi }; }
  function D(arr) { return arr.map(function (a) { return { who: a[0], en: a[1], hi: a[2] }; }); }
  function Line(who, en, hi, extra) {
    var o = { who: who, en: en, hi: hi };
    if (extra) { if (extra.pose) o.pose = extra.pose; if (extra.fx) o.fx = extra.fx; if (extra.stat) o.stat = extra.stat; }
    return o;
  }
  var CAST = window.RPD_CAST;
  CAST.brahma = { sh: 'puppet_brahma', fr: 'speak', name: L('Brahma', 'ब्रह्मा') };
  CAST.vish = { sh: 'puppet_vishvamitra', fr: 'stand', name: L('Sage Vishvamitra', 'महर्षि विश्वामित्र') };
  CAST.boon = { sh: 'puppet_dashanan_boon', fr: 'pray', name: L('Dashanan', 'दशानन') };
  CAST.ravan = { sh: 'ravanan', fr: 'idle', name: L('Ravana', 'रावण') };
  CAST.ramaA = { sh: 'rama_adult', fr: 'idle', name: L('Rama', 'राम') };
  CAST.lakA = { sh: 'lak_adult', fr: 'idle', name: L('Lakshmana', 'लक्ष्मण') };
  CAST.ramaStory = { sh: 'puppet_rama_story', fr: 'astra', name: L('Rama', 'राम') };
  CAST.lakStory = { sh: 'puppet_lak_story', fr: 'guard', name: L('Lakshmana', 'लक्ष्मण') };
  CAST.gate = { sh: 'lanka_guards', fr: 'captain0', name: L('Captain of the gate', 'द्वार का सेनापति') };

  var LEVELS = window.RPD_LEVELS;

  // ---------------------------------------------------------------- 9
  LEVELS.push({
    n: 9, plate: 'bg9', title: L("Ravana's Penance Deepens", 'रावण की तपस्या गहराती है'), hero: 'ascetic', theme: 'storm',
    mode: L('Stay-Put / Focus', 'स्थिर / एकाग्रता'), music: { raga: 'malkauns', lead: 'veena' },
    intro: L('The first night was only a beginning. Hold through the storm. Something in the sky is listening.', 'पहली रात केवल आरंभ थी। आँधी में टिके रहो। आकाश में कोई सुन रहा है।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Keep steadiness above 40%', 'स्थिरता 40% से ऊपर रखो'), L('A perfect hold: never break', 'संपूर्ण ध्यान: कभी न टूटे')],
    star2: { stat: 'minSteady', min: 40 }, star3: { stat: 'breaks', max: 0 },
    segs: [
      { type: 'story', theme: 'storm', cast: [{ id: 'ascetic', x: 0.46, face: 1, s: 1.2 }],
        lines: D([
          ['narrator', 'Seasons have crossed the ledge. The fire is ash. Dashanan has not lifted his blade, and he has not asked again.', 'ऋतुएँ इस शिला को पार कर गई हैं। अग्नि राख हो चुकी है। दशानन ने न खड्ग उठाया है, न फिर माँग की है।'],
          ['ascetic', 'I sat until the mountain learned my name. I will sit until the grandfather of the worlds learns it too.', 'मैं तब तक बैठा रहा जब तक पर्वत ने मेरा नाम न सीख लिया। अब तब तक बैठूँगा जब तक लोकों के पितामह भी उसे न सीख लें।'],
          ['narrator', 'Hold. The storm will come closer than the first night, and it will not ask permission.', 'टिके रहो। आँधी पहली रात से और निकट आएगी, और वह अनुमति नहीं माँगेगी।']
        ]) },
      { type: 'meditate', theme: 'storm', duration: 130, hard: true, storm: true, music: 'penance',
        whispers: [
          L('The cold is a crown, if you accept it.', 'ठंड ही मुकुट है, यदि तुम उसे स्वीकार कर लो।'),
          L('No god is awake.', 'कोई देवता जागा नहीं है।'),
          L('Ten heads, and still you kneel.', 'दस सिर, और फिर भी तुम घुटनों पर हो।'),
          L('Rise. The world is burning without you.', 'उठो। संसार तुम्हारे बिना जल रहा है।')
        ],
        tips: [{ t: L('HOLD to remain. TAP a ring only as it closes. The storm is faster than the first night.', 'टिके रहने के लिए दबाए रखो। वलय को केवल तब टैप करो जब वह सिमट रहा हो। यह आँधी पहली रात से तेज़ है।') }] },
      { type: 'story', theme: 'brahma', cast: [{ id: 'boon', x: 0.34, face: 1, s: 1.02 }, { id: 'brahma', x: 0.68, face: -1, s: 1.05, float: 36 }],
        lines: [
          Line('narrator', 'The wind stops, as if the sky itself has drawn a breath. Warmth falls on the ledge where no sun is.', 'हवा रुक जाती है, मानो आकाश ने स्वयं साँस ली हो। जहाँ सूर्य नहीं, उस शिला पर गर्मी उतरती है।'),
          Line('brahma', 'Child of Pulastya\'s line. You have sat longer than the seasons I set in motion. I am here.', 'पुलस्त्य-वंश के बालक। तुम उन ऋतुओं से भी अधिक बैठे रहे जिन्हें मैंने चलाया। मैं यहाँ हूँ।', { pose: { brahma: 'speak', boon: 'pray' } }),
          Line('boon', 'Lord. I did not rise. I did not eat. I asked the mountain to be my witness, and it did not look away.', 'प्रभो। मैं नहीं उठा। मैंने अन्न नहीं लिया। मैंने पर्वत को साक्षी माना, और उसने दृष्टि नहीं हटाई।', { pose: { boon: 'pray', brahma: 'speak' } }),
          Line('brahma', 'Then speak. A penance this deep can open a door. Doors open both ways. Choose your words as a king chooses a war.', 'तो बोलो। इतनी गहरी तपस्या एक द्वार खोल सकती है। द्वार दोनों ओर खुलते हैं। शब्द ऐसे चुनो जैसे राजा युद्ध चुनता है।', { pose: { brahma: 'warn', boon: 'receive' } }),
          Line('narrator', 'Dashanan lifts his face. The boon is not yet spoken. But the one who can give it is no longer absent.', 'दशानन मुख उठाता है। वर अभी कहा नहीं गया। पर जो उसे दे सकता है, वह अब अनुपस्थित नहीं है।', { pose: { brahma: 'bless', boon: 'receive' } })
        ] }
    ]
  });

  // ---------------------------------------------------------------- 10
  LEVELS.push({
    n: 10, plate: 'bg10', title: L('Receiving the Boon', 'वरदान की प्राप्ति'), hero: 'boon', theme: 'brahma',
    mode: L('Story', 'कथा'), music: { raga: 'malkauns', lead: 'veena' },
    intro: L('Brahma waits. Ask for what you think the worlds cannot refuse — and hear what he warns.', 'ब्रह्मा प्रतीक्षा करते हैं। वह माँगो जो तुम्हें लगता है कि लोक मना नहीं कर सकते — और उनकी चेतावनी सुनो।'),
    stars: [L('Finish the audience', 'यह साक्षात्कार पूरा करो'), L('Hear Brahma\'s warning', 'ब्रह्मा की चेतावनी सुनो'), L('See the crowns begin to kindle', 'मुकुटों को जागते देखो')],
    star2: { stat: 'warning', min: 1 }, star3: { stat: 'crowns', min: 1 },
    segs: [
      { type: 'story', theme: 'brahma', music: 'calm',
        cast: [{ id: 'boon', x: 0.33, face: 1, s: 1.0 }, { id: 'brahma', x: 0.7, face: -1, s: 1.06, float: 40 }],
        lines: [
          Line('brahma', 'Speak, Dashanan. The fire on this ledge has gone out. My attention will not stay longer than the vow that called it.', 'बोलो, दशानन। इस शिला की अग्नि बुझ चुकी है। मेरी दृष्टि उस संकल्प से अधिक देर नहीं ठहरेगी जिसने उसे बुलाया।', { pose: { brahma: 'speak', boon: 'pray' } }),
          Line('boon', 'Then hear a clean request. Let no deva slay me. No danava, no yaksha, no gandharva. No rakshasa of my own kind, no naga, no great bird of the sky.', 'तो एक स्पष्ट माँग सुनिए। मुझे कोई देवता न मार सके। न दानव, न यक्ष, न गंधर्व। न मेरी जाति का कोई राक्षस, न नाग, न आकाश का कोई महापक्षी।', { pose: { boon: 'receive', brahma: 'speak' } }),
          Line('brahma', 'You have named every power you respect. You have not named mankind.', 'तुमने हर उस शक्ति का नाम लिया जिसका तुम आदर करते हो। मनुष्य जाति का नाम तुमने नहीं लिया।', { pose: { brahma: 'warn', boon: 'receive' }, stat: 'warning' }),
          Line('boon', 'What is a man to me? A man lives a little while, breaks, and is forgotten. I will not spend this penance on a fear of men.', 'मनुष्य मेरे लिए क्या है? वह थोड़े दिन जीता है, टूटता है, और भुला दिया जाता है। मैं इस तपस्या को मनुष्यों के भय पर नहीं खर्च करूँगा।', { pose: { boon: 'receive', brahma: 'warn' } }),
          Line('brahma', 'So be it. The vow is granted as you spoke it, and not one word more. Remember the shape of the door you refused to close.', 'ऐसा ही हो। वर वैसा ही दिया जाता है जैसा तुमने कहा, और एक शब्द भी अधिक नहीं। जिस द्वार को तुमने बंद करने से मना किया, उसका आकार याद रखना।', { pose: { brahma: 'offerBoon', boon: 'receive' } }),
          Line('narrator', 'Light gathers at his brow. Not armour. Not yet ten crowned heads in their full pride. Only the beginning of them, like lamps lit in a house that is still dark.', 'उसके ललाट पर प्रकाश जमने लगता है। कवच नहीं। अभी दस मुकुटधारी सिर अपने पूरे गर्व में नहीं। केवल उनका आरंभ, जैसे किसी अँधेरे घर में दीप जलाए गए हों।', { pose: { boon: 'crownsForm', brahma: 'bless' }, fx: 'crowns', stat: 'crowns' }),
          Line('boon', 'I feel them. Not as weight. As a future that has agreed to come.', 'मैं उन्हें अनुभव करता हूँ। भार की तरह नहीं। एक ऐसे भविष्य की तरह जो आने को राज़ी हो गया है।', { pose: { boon: 'crowned', brahma: 'bless' } }),
          Line('brahma', 'Go down from my mountain, son of Visrava. Power has answered you. It will also answer whoever one day speaks the name you scorned.', 'मेरे पर्वत से उतरो, विश्रवा के पुत्र। शक्ति ने तुम्हें उत्तर दिया है। जिस दिन कोई उस नाम को पुकारेगा जिसकी तुमने उपेक्षा की, शक्ति उसे भी उत्तर देगी।', { pose: { brahma: 'warn', boon: 'crowned' } }),
          Line('narrator', 'The warmth leaves the ledge. Dashanan remains, crowned in light that is not yet a kingdom. Below him, Lanka is still his brother\'s city.', 'शिला से गर्मी चली जाती है। दशानन रह जाता है, उस प्रकाश के मुकुट में जो अभी राज्य नहीं बना। उसके नीचे लंका अभी भी उसके भाई का नगर है।', { pose: { boon: 'crowned', brahma: 'bless' } })
        ] }
    ]
  });

  // ---------------------------------------------------------------- 11
  LEVELS.push({
    n: 11, plate: 'bg11', title: L('Conquest of Lanka', 'लंका विजय'), hero: 'ravan', theme: 'lanka',
    mode: L('Arena + Runner', 'अखाड़ा + दौड़'), music: { raga: 'bhairav', lead: 'veena' },
    intro: L('Kubera\'s city shines, and it is not yours. Break the gate, then cross the streets to the throne.', 'कुबेर का नगर चमकता है, और वह तुम्हारा नहीं है। द्वार तोड़ो, फिर गलियों से सिंहासन तक पहुँचो।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Land 4 perfect blows', '4 सटीक प्रहार करो'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'perfect', min: 4 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'story', theme: 'lanka', cast: [{ id: 'ravan', x: 0.32, face: 1, s: 1.05 }, { id: 'gate', x: 0.7, face: -1, s: 0.95 }],
        lines: D([
          ['narrator', 'Lanka, city of gold, sits on its rock under Kubera\'s lamps. Ravana comes to the gate with the boon still warm on his brow.', 'स्वर्ण नगरी लंका कुबेर के दीपों के नीचे अपनी चट्टान पर बैठी है। रावण द्वार पर आता है, ललाट पर वर अभी गर्म है।'],
          ['gate', 'Turn back, son of Visrava. This gate answers to your brother, not to your penance.', 'लौट जाओ, विश्रवा के पुत्र। यह द्वार तुम्हारे भाई का है, तुम्हारी तपस्या का नहीं।'],
          ['ravan', 'My brother kept the city while I kept the mountain. The mountain has answered. Open the gate, or I will.', 'जब मैं पर्वत पर था, मेरे भाई ने नगर संभाला। पर्वत ने उत्तर दे दिया है। द्वार खोलो, नहीं तो मैं खोलूँगा।'],
          ['gate', 'Then the yakshas of the wall will answer you. We were set here to refuse even a brother.', 'तो दीवार के यक्ष तुम्हें उत्तर देंगे। हमें यहाँ इसलिए रखा गया है कि हम भाई को भी मना कर दें।'],
          ['ravan', 'Refuse, then. I have learned how to wait. I have not forgotten how to strike.', 'तो मना करो। मैंने प्रतीक्षा करना सीख लिया है। प्रहार करना मैं नहीं भूला।']
        ]) },
      { type: 'arena', hero: 'ravan', theme: 'lanka', music: 'arena',
        lose: L('The gate still stands', 'द्वार अब भी खड़ा है'),
        roster: [
          { id: 'guard', hp: 42, name: L('Yaksha sentinel', 'यक्ष प्रहरी') },
          { id: 'guard', hp: 48, name: L('Yaksha sentinel', 'यक्ष प्रहरी') },
          { id: 'captain', hp: 74, name: L('Captain of the gate', 'द्वार का सेनापति') }
        ],
        tips: [{ t: L('Close, strike, and block when the weapon glows. After a heavy blow their guard opens — that is a perfect hit. Jump the low sweep.', 'पास जाकर वार करो, और शस्त्र चमके तो रोक लो। भारी प्रहार के बाद उनकी रक्षा खुलती है — वही सटीक चोट है। नीचे के वार पर कूदो।') },
          { t: L('Three quick strikes with a full meter: the blade storm.', 'पूरा मीटर हो तो तीन तेज़ वार: खड्ग-तूफ़ान।') }] },
      { type: 'runner', hero: 'ravan', theme: 'streets', len: 11200, speed: 430, speedMax: 470, seed: 11, music: 'play',
        phases: [
          { until: 4200, set: ['gap', 'rock', 'raider', 'boulder'], name: L('The lower streets', 'निचली गलियाँ') },
          { until: 8000, set: ['raider', 'branch', 'gap', 'boulder', 'rock'], name: L('The gold stairs', 'स्वर्ण सीढ़ियाँ') },
          { until: 11000, set: ['raider', 'gap', 'boulder', 'branch'], name: L('The palace road', 'महल का मार्ग') }
        ],
        tips: [{ x: 40, t: L('Jump: tap the left side / Space. Strike: the right side / J. Slide under beams: swipe down / S.', 'कूदो: बायाँ भाग / Space। वार: दायाँ भाग / J। कड़ियों के नीचे फिसलो: नीचे स्वाइप / S।') },
          { x: 1800, t: L('Sentinels and boulders break under a heavy blow. Or jump them.', 'प्रहरी और शिलाएँ भारी वार से टूटती हैं। या उन पर कूद जाओ।') }],
        endText: L('The palace gate', 'महल का द्वार') },
      { type: 'story', theme: 'lanka', cast: [{ id: 'ravan', x: 0.48, face: 1, s: 1.08 }],
        lines: D([
          ['narrator', 'Kubera has gone north, toward Kailasa, and the Pushpaka goes with him for now. The lamps of Lanka stay.', 'कुबेर उत्तर की ओर, कैलास की दिशा में चला गया है, और पुष्पक अभी उसके साथ है। लंका के दीप रह जाते हैं।'],
          ['ravan', 'Let them burn. They burned for my brother. Tonight they burn for the king the mountain made.', 'जलते रहें। वे मेरे भाई के लिए जले। आज रात वे उस राजा के लिए जलेंगे जिसे पर्वत ने गढ़ा।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 12
  LEVELS.push({
    n: 12, plate: 'bg12', title: L('Rama Under Vishvamitra — Tataka', 'विश्वामित्र के संग राम — ताड़का'), hero: 'ramaA', theme: 'tataka',
    mode: L('Arena', 'अखाड़ा'), music: { raga: 'yaman', lead: 'flute' },
    intro: L('The sage leads you into Tataka\'s wood. She is the hunger of this forest. The bout is yours.', 'ऋषि तुम्हें ताड़का के वन में ले चलते हैं। वह इस वन की भूख है। यह मुक़ाबला तुम्हारा है।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Land 4 perfect shots', '4 सटीक बाण लगाओ'), L('Take no hit in the bout', 'मुक़ाबले में कोई चोट नहीं')],
    star2: { stat: 'perfect', min: 4 }, star3: { stat: 'sparHits', max: 0 },
    segs: [
      { type: 'story', theme: 'tataka', cast: [{ id: 'ramaA', x: 0.3, face: 1, s: 1.2 }, { id: 'vish', x: 0.68, face: -1, s: 1.02 }],
        lines: D([
          ['narrator', 'Vishvamitra has taken Rama and Lakshmana from Ayodhya. The wood ahead is Malada and Karusha\'s ruin, and it has a name.', 'विश्वामित्र राम और लक्ष्मण को अयोध्या से ले आए हैं। आगे का वन मलद और करूश का उजड़ा देश है, और उसका एक नाम है।'],
          ['vish', 'Tataka. Yakshini, daughter of Suketu, mother of Maricha. She eats what the sages plant, and she eats the sages after.', 'ताड़का। यक्षिणी, सुकेतु की पुत्री, मारीच की माता। वह वह खाती है जो ऋषि बोते हैं, और फिर ऋषियों को भी।'],
          ['ramaA', 'Gurudev, she is a woman. My hand hesitates on the string.', 'गुरुदेव, वह स्त्री हैं। मेरा हाथ प्रत्यंचा पर रुकता है।'],
          ['vish', 'Hesitate, and then loose. Duty is not cruelty when the forest itself is being eaten. I will be at your shoulder. I will not draw the bow for you.', 'रुको, और फिर छोड़ो। जब वन स्वयं खाया जा रहा हो, तब कर्तव्य क्रूरता नहीं है। मैं तुम्हारे कंधे के पास रहूँगा। धनुष मैं तुम्हारे लिए नहीं खींचूँगा।'],
          ['ramaA', 'Then Lakshmana holds the path behind me, and I hold the front. Let her come.', 'तो लक्ष्मण मेरे पीछे का मार्ग सँभालेंगे, और मैं आगे का। वह आएँ।']
        ]) },
      { type: 'arena', hero: 'ramaA', foe: 'tataka', foeHp: 112, foeName: L('Tataka', 'ताड़का'), theme: 'tataka', music: 'arena',
        lose: L('The wood keeps its hunger', 'वन अपनी भूख रखे रहता है'),
        coach: [
          L('Steady, Rama. Her arms are long. Her pride is longer.', 'स्थिर रहो, राम। उसकी भुजाएँ लंबी हैं। उसका गर्व उनसे भी लंबा है।'),
          L('When her guard opens, the string already knows the moment.', 'जब उसकी रक्षा खुले, प्रत्यंचा उस क्षण को पहले से जानती है।'),
          L('Do not chase her. Make her cross the ground you have chosen.', 'उसके पीछे मत दौड़ो। उसे उस भूमि को पार करने दो जिसे तुमने चुना है।')
        ],
        coachEvery: 15,
        tips: [{ t: L('She fights like the Arms-Mistress, and she does not bow. Block the high strike. Jump the sweep. Shoot when you see OPEN.', 'वह शस्त्र-गुरु की तरह लड़ती है, और झुकती नहीं। ऊँचे वार को रोको। नीचे के वार पर कूदो। OPEN दिखे तब बाण छोड़ो।') },
          { t: L('A charged arrow breaks her guard. Two quick taps.', 'शक्तिशाली बाण उसकी रक्षा तोड़ता है। दो तेज़ टैप।') }] },
      { type: 'story', theme: 'tataka', cast: [{ id: 'ramaStory', x: 0.34, face: 1, s: 1.05, fr: 'triumph' }, { id: 'vish', x: 0.68, face: -1, s: 1.0, fr: 'solemn' }],
        lines: D([
          ['vish', 'It is done. Do not rejoice over a fallen hunger. Rejoice that the wood can be planted again.', 'हो गया। गिरी हुई भूख पर मत फूलो। इस पर फूलो कि वन फिर बोया जा सकता है।'],
          ['ramaStory', 'I will not rejoice, Gurudev. I will remember that my hand hesitated, and that you were right to speak.', 'मैं नहीं फूलूँगा, गुरुदेव। मैं यह याद रखूँगा कि मेरा हाथ रुका था, और आपका बोलना ठीक था।'],
          ['vish', 'Good. Siddhashrama is ahead, and a sacrifice that must not be touched. Maricha, her son, is still in the world. Remember that name.', 'अच्छा। आगे सिद्धाश्रम है, और एक यज्ञ जिसे छूना नहीं है। मारीच, उसका पुत्र, अभी संसार में है। वह नाम याद रखना।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 13
  LEVELS.push({
    n: 13, plate: 'bg13', title: L('Protecting the Sacrifice', 'यज्ञ की रक्षा'), hero: 'ramaA', theme: 'yagna',
    mode: L('Platformer + Arena', 'प्लेटफ़ॉर्मर + अखाड़ा'), music: { raga: 'yaman', lead: 'flute' },
    intro: L('Keep the sacrificial fire clean. The host comes from the trees. Subahu comes last.', 'यज्ञ की अग्नि को शुद्ध रखो। झुंड वृक्षों से आता है। सुबाहु अंत में आता है।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Keep the fire above 55%', 'अग्नि 55% से ऊपर रखो'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'altarMin', min: 55 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'story', theme: 'yagna', cast: [{ id: 'vish', x: 0.2, face: 1, s: 0.98 }, { id: 'ramaA', x: 0.48, face: 1, s: 1.12 }, { id: 'lakStory', x: 0.76, face: -1, s: 1.02, fr: 'guard' }],
        lines: D([
          ['narrator', 'At Siddhashrama the fire is already lit. Vishvamitra\'s sacrifice has been broken before, by blood thrown into the flame.', 'सिद्धाश्रम में अग्नि पहले से जल रही है। विश्वामित्र का यज्ञ पहले भी टूटा है, जब लौ में रक्त फेंका गया।'],
          ['vish', 'Maricha and Subahu come with a host. They do not want the forest. They want the offering spoiled.', 'मारीच और सुबाहु एक झुंड के साथ आते हैं। उन्हें वन नहीं चाहिए। उन्हें यज्ञ अपवित्र चाहिए।'],
          ['lakStory', 'Brother, I will take the left of the fire. Nothing reaches the altar without crossing me.', 'भैया, मैं अग्नि की बाईं ओर रहूँगा। वेदी तक कुछ भी मेरे ऊपर से होकर ही पहुँचेगा।'],
          ['ramaA', 'And I will take the right, and the arrows. Gurudev, keep the mantra. We will keep the ground.', 'और मैं दाईं ओर रहूँगा, और बाणों पर। गुरुदेव, मंत्र आप रखें। भूमि हम रखेंगे।'],
          ['vish', 'If Maricha is thrown far and not slain, do not chase him. The sacrifice is the victory. Not the hunting of every name.', 'यदि मारीच दूर फेंका जाए और मारा न जाए, तो उसके पीछे मत दौड़ना। विजय यज्ञ है। हर नाम का शिकार नहीं।']
        ]) },
      { type: 'platform', hero: 'ramaA', partner: 'lakA', theme: 'yagna', len: 2100, noAttack: true, music: 'calm',
        ground: [[0, 2100]],
        plats: [{ x: 640, y: 340, w: 190, k: 'ledgeRoots' }, { x: 1080, y: 270, w: 170, k: 'ledgeBamboo' }],
        decor: [{ k: 'bamboo', sh: 'scenery_9_30', x: 260, s: 0.72 }, { k: 'mango', sh: 'scenery_9_30', x: 980, s: 0.78 }, { k: 'fern', sh: 'scenery_9_30', x: 1500, s: 0.5 }],
        checkpoints: [60],
        tips: [{ x: 40, t: L('The altar is ahead. Switch brother with Q or ⇄ if you wish. There is no fight on this path.', 'वेदी आगे है। चाहो तो Q या ⇄ से भाई बदलो। इस पथ पर युद्ध नहीं है।') }],
        goal: { x: 1900, k: 'altar', line: D([['ramaA', 'The flame is steady. Hold it so.', 'लौ स्थिर है। इसे ऐसा ही रहने दो।']]) } },
      { type: 'defend', hero: 'ramaA', partner: 'lakA', theme: 'yagna', music: 'arena', altarX: 0.46, gap: 1.3,
        waves: [['raider', 'raider', 'raider'], ['raider', 'brute', 'raider'], ['brute', 'raider', 'brute']],
        plats: [{ x: 560, y: 324, w: 210, k: 'ledgeRoots' }],
        decor: [{ k: 'bamboo', x: 900, s: 0.62 }, { k: 'fern', x: 1040, s: 0.42 }],
        tips: [{ t: L('Shoot the host before they touch the fire. Lakshmana strikes beside you. Jump their lunge. ⇄ switches brother.', 'झुंड के अग्नि को छूने से पहले बाण चलाओ। लक्ष्मण तुम्हारे पास वार करते हैं। उनकी लपक पर कूदो। ⇄ से भाई बदलो।') }] },
      { type: 'arena', hero: 'ramaA', foe: 'subahu', foeHp: 84, foeName: L('Subahu', 'सुबाहु'), theme: 'yagna', music: 'arena', altar: true,
        lose: L('Subahu reaches the flame', 'सुबाहु लौ तक पहुँच जाता है'),
        tips: [{ t: L('Subahu himself. Same lesson: block, jump the sweep, shoot the opening. The fire behind you is what you are keeping.', 'स्वयं सुबाहु। वही पाठ: रोको, नीचे के वार पर कूदो, खुलाव पर बाण छोड़ो। तुम्हारे पीछे की अग्नि ही वह है जिसे तुम बचा रहे हो।') }] },
      { type: 'story', theme: 'yagna', cast: [{ id: 'vish', x: 0.24, face: 1, s: 0.98, fr: 'solemn' }, { id: 'ramaStory', x: 0.5, face: 1, s: 1.02, fr: 'triumph' }, { id: 'lakStory', x: 0.76, face: -1, s: 1.0, fr: 'guard' }],
        lines: D([
          ['narrator', 'Subahu falls. Maricha is flung far, out over the water, alive and ashamed. The mantra does not break.', 'सुबाहु गिरता है। मारीच दूर फेंक दिया जाता है, जल के ऊपर, जीवित और लज्जित। मंत्र नहीं टूटता।'],
          ['lakStory', 'He will come back, brother. Men who are thrown, and not finished, come back.', 'वह लौटेगा, भैया। जिसे फेंका जाए और समाप्त न किया जाए, वह लौटता है।'],
          ['ramaStory', 'Then we will know his shape when he wears another. The fire is whole. That was the task.', 'तो जब वह दूसरा रूप धरे, हम उसका आकार पहचान लेंगे। अग्नि पूरी है। यही कार्य था।'],
          ['vish', 'The sacrifice is complete. Janaka of Mithila keeps a bow that no prince has strung. Walk with me. The road is long, and it is kind.', 'यज्ञ पूर्ण हुआ। मिथिला के जनक के पास एक धनुष है जिसे किसी राजकुमार ने नहीं चढ़ाया। मेरे साथ चलो। मार्ग लंबा है, और वह कोमल है।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 14
  LEVELS.push({
    n: 14, plate: 'bg14', title: L('Journey to Mithila', 'मिथिला की यात्रा'), hero: 'ramaA', theme: 'road',
    mode: L('Runner', 'दौड़'), music: { raga: 'bhupali', lead: 'flute' },
    intro: L('Vishvamitra walks ahead in the story. You run the road: river, wood, and the fields before Janaka\'s gates.', 'कथा में विश्वामित्र आगे चलते हैं। तुम मार्ग दौड़ते हो: नदी, वन, और जनक के द्वार से पहले के खेत।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Clear 10 beasts and stones', '10 पशु और पत्थर हटाओ'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'smash', min: 10 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'story', theme: 'road', cast: [{ id: 'vish', x: 0.28, face: 1, s: 1.0 }, { id: 'ramaA', x: 0.55, face: 1, s: 1.15 }, { id: 'lakA', x: 0.78, face: -1, s: 1.12 }],
        lines: D([
          ['vish', 'Mithila lies east of this forest. King Janaka keeps a sacrifice of his own, and a bow that once belonged to Shiva. They call it the Pinaka.', 'मिथिला इस वन के पूर्व में है। राजा जनक अपना यज्ञ रखते हैं, और एक धनुष जो कभी शिव का था। उसे पिनाक कहते हैं।'],
          ['lakA', 'Will they ask us to lift it?', 'क्या वे हमसे उसे उठवाएँगे?'],
          ['vish', 'They will ask every prince who comes. Most of them look at it, and discover they are smaller than they thought.', 'वे हर आने वाले राजकुमार से कहेंगे। उनमें से अधिकांश उसे देखते हैं, और जान जाते हैं कि वे अपनी धारणा से छोटे हैं।'],
          ['ramaA', 'Then I will look at it when we arrive, Gurudev. Not before. The road is the lesson that is actually under my feet.', 'तो मैं उसे तब देखूँगा जब हम पहुँचेंगे, गुरुदेव। उससे पहले नहीं। जो पाठ सच में मेरे पैरों के नीचे है, वह यह मार्ग है।']
        ]) },
      { type: 'runner', hero: 'ramaA', theme: 'road', len: 28000, speed: 400, speedMax: 460, seed: 14, music: 'play',
        phases: [
          { until: 7000, set: ['gap', 'rock', 'boar', 'branch', 'gap'], name: L('The river wood', 'नदी का वन') },
          { until: 15000, set: ['boar', 'fall', 'wolf', 'gap', 'branch', 'boulder'], name: L('The wild stretch', 'जंगली पट्टी') },
          { until: 22000, set: ['rock', 'boar', 'gap', 'eagle', 'branch', 'fall'], name: L('The open fields', 'खुले खेत') },
          { until: 27500, set: ['gap', 'boar', 'boulder', 'branch', 'wolf'], name: L('The road to the gates', 'द्वार का मार्ग') }
        ],
        tips: [{ x: 50, t: L('Rama runs. Jump on the left, loose arrows on the right. Slide under branches. A heavy shot drops a boar.', 'राम दौड़ते हैं। बाईं ओर कूदो, दाईं ओर बाण छोड़ो। डालियों के नीचे फिसलो। भारी बाण सूअर गिराता है।') },
          { x: 7200, t: L('A mark of "!" is a stone about to fall. Do not stand under it.', '"!" उस पत्थर का चिह्न है जो गिरने वाला है। उसके नीचे मत खड़े रहना।') }],
        endText: L('The gates of Mithila', 'मिथिला के द्वार') },
      { type: 'story', theme: 'road', cast: [{ id: 'ramaStory', x: 0.36, face: 1, s: 1.05, fr: 'triumph' }, { id: 'vish', x: 0.66, face: -1, s: 1.0, fr: 'instruct' }],
        lines: D([
          ['narrator', 'The walls of Mithila take the evening light. Banners move, but not in fear. A city can be glad and still be a test.', 'मिथिला की दीवारें संध्या का प्रकाश लेती हैं। ध्वज हिलते हैं, पर भय से नहीं। एक नगर प्रसन्न भी हो सकता है और परीक्षा भी।'],
          ['vish', 'Inside those gates Janaka will show you a bow. You will not be asked to be loud. You will be asked to be true.', 'उन द्वारों के भीतर जनक तुम्हें एक धनुष दिखाएँगे। तुमसे कोलाहल नहीं माँगा जाएगा। तुमसे सत्य माँगा जाएगा।'],
          ['ramaA', 'Then let the gates open, Gurudev. I have run the road. I can stand still for a bow.', 'तो द्वार खुलने दीजिए, गुरुदेव। मैं मार्ग दौड़ चुका हूँ। एक धनुष के लिए मैं स्थिर भी खड़ा हो सकता हूँ।'],
          ['narrator', 'Here the telling pauses. The bow, the exile, and the vow are still on the road ahead.', 'यहीं यह कथा थोड़ी देर रुकती है। धनुष, वनवास, और प्रतिज्ञा अभी आगे के मार्ग पर हैं।']
        ]) }
    ]
  });

  window.RPD_LATER = [
    [15, L('Swayamvara Approach', 'स्वयंवर की ओर'), L('Platformer + Story', 'प्लेटफ़ॉर्मर + कथा')],
    [16, L('Lifting the Pinaka', 'पिनाक उठाना'), L('Focus', 'एकाग्रता')],
    [17, L('Parashurama Encounter', 'परशुराम से भेंट'), L('Arena + Story', 'अखाड़ा + कथा')],
    [18, L("Court Intrigue: Kaikeyi's Demand", 'दरबार का षड्यंत्र: कैकेयी की माँग'), L('Story', 'कथा')],
    [19, L('Leaving Ayodhya', 'अयोध्या से विदा'), L('Runner + Platformer', 'दौड़ + प्लेटफ़ॉर्मर')],
    [20, L('Early Forest Travel', 'वन-यात्रा का आरंभ'), L('Runner', 'दौड़')],
    [21, L('Establishing the Forest Dwelling', 'वन में कुटिया'), L('Platformer', 'प्लेटफ़ॉर्मर')],
    [22, L('Forest Demon Encounters', 'वन के राक्षस'), L('Arena', 'अखाड़ा')],
    [23, L('Shurpanakha Approaches', 'शूर्पणखा का आगमन'), L('Story + Platformer', 'कथा + प्लेटफ़ॉर्मर')],
    [24, L("Shurpanakha's Attack", 'शूर्पणखा का आक्रमण'), L('Arena', 'अखाड़ा')],
    [25, L('The Golden Deer', 'स्वर्ण मृग'), L('Runner', 'दौड़')],
    [26, L('Lakshmana Drawn Away', 'लक्ष्मण का जाना'), L('Platformer + Story', 'प्लेटफ़ॉर्मर + कथा')],
    [27, L("Ravana's Approach and the Line", 'रावण का आगमन और रेखा'), L('Story + Platformer', 'कथा + प्लेटफ़ॉर्मर')],
    [28, L('The Abduction', 'सीता हरण'), L('Runner + Arena', 'दौड़ + अखाड़ा')],
    [29, L("Jatayu's Air Battle", 'जटायु का आकाश-युद्ध'), L('Air / Flyer', 'आकाश-उड़ान')],
    [30, L('Aftermath and the Vow', 'परिणाम और प्रतिज्ञा'), L('Story', 'कथा')]
  ];
})();
