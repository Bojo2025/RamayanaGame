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
  CAST.sitaA = { sh: 'sita_adult', fr: 'idle', name: L('Sita', 'सीता') };
  CAST.sitaStory = { sh: 'puppet_sita_story', fr: 'folded', name: L('Sita', 'सीता') };
  CAST.janaka = { sh: 'puppet_janaka', fr: 'stand', name: L('King Janaka', 'राजा जनक') };
  CAST.king = { sh: 'puppet_dasharatha', fr: 'stand', name: L('King Dasharatha', 'महाराज दशरथ') };
  CAST.kaikeyi = { sh: 'puppet_kaikeyi', fr: 'stand', name: L('Kaikeyi', 'कैकेयी') };
  CAST.manthara = { sh: 'puppet_manthara', fr: 'stand', name: L('Manthara', 'मंथरा') };
  CAST.para = { sh: 'parashurama', fr: 'ready', name: L('Parashurama', 'परशुराम') };
  CAST.shurpa = { sh: 'shurpanakha_story', fr: 'composed', name: L('Shurpanakha', 'शूर्पणखा') };
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
      { type: 'defend', hero: 'ramaA', partner: 'lakA', theme: 'yagna', music: 'arena', altarX: 0.2, gap: 1.3,
        waves: [['raider', 'raider', 'raider'], ['raider', 'brute', 'raider'], ['brute', 'raider', 'brute']],
        plats: [{ x: 560, y: 324, w: 210, k: 'ledgeRoots' }],
        decor: [{ k: 'bamboo', x: 900, s: 0.62 }, { k: 'fern', x: 1040, s: 0.42 }],
        tips: [{ t: L('The ringed flame on the left is yours to keep. The great fire in the painting is only the hall behind you. Shoot before they touch the ring.', 'बाईं ओर वलय वाली लौ तुम्हारी रक्षा में है। चित्र की बड़ी अग्नि केवल पीछे का यज्ञ है। वलय छूने से पहले बाण चलाओ।') }] },
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
          ['narrator', 'The gates of Mithila stand open. Inside them, a bow is waiting.', 'मिथिला के द्वार खुले हैं। उनके भीतर एक धनुष प्रतीक्षा कर रहा है।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 15
  LEVELS.push({
    n: 15, plate: 'bg15', title: L('Swayamvara Approach', 'स्वयंवर की ओर'), hero: 'ramaA', theme: 'hall',
    mode: L('Platformer + Story', 'प्लेटफ़ॉर्मर + कथा'), music: { raga: 'yaman', lead: 'flute' },
    intro: L('Enter Janaka\'s hall. Speak with the king and with Sita, then come to the bow.', 'जनक के सभागृह में प्रवेश करो। राजा से और सीता से बात करो, फिर धनुष तक आओ।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Find the hidden lotus', 'छिपा कमल खोजो'), L('Cross the hall without a fall', 'बिना गिरे सभागृह पार करो')],
    star2: { stat: 'lotus', min: 1 }, star3: { stat: 'falls', max: 0 },
    segs: [
      { type: 'story', theme: 'hall', cast: [{ id: 'ramaA', x: 0.28, face: 1, s: 1.12 }, { id: 'janaka', x: 0.55, face: -1, s: 1.0 }, { id: 'sitaStory', x: 0.78, face: -1, s: 1.02, fr: 'folded' }],
        lines: D([
          ['narrator', 'The hall of Mithila is full of princes, and of silence. A bow stands where a guest would stand, and nobody has moved it.', 'मिथिला का सभागृह राजकुमारों से भरा है, और मौन से भी। एक धनुष वहाँ खड़ा है जहाँ अतिथि खड़ा होता, और किसी ने उसे हिलाया नहीं।'],
          ['janaka', 'Rama, son of Dasharatha. You are welcome in this house. The bow was Shiva\'s. I keep it. I do not command it.', 'राम, दशरथ के पुत्र। इस घर में तुम्हारा स्वागत है। यह धनुष शिव का था। मैं इसे रखता हूँ। मैं इसे आदेश नहीं देता।'],
          ['sitaStory', 'I have watched men look at it and become smaller. I am not here to be won like a wager.', 'मैंने पुरुषों को इसे देखते और छोटे होते देखा है। मैं यहाँ दाँव की तरह जीती जाने नहीं आई।'],
          ['ramaA', 'Then I will not look at you as a prize, princess. I will look at the bow when the king asks, and not before.', 'तो मैं आपको पुरस्कार की तरह नहीं देखूँगा, राजकुमारी। जब राजा कहेंगे, तब मैं धनुष को देखूँगा, उससे पहले नहीं।']
        ]) },
      { type: 'platform', hero: 'ramaA', theme: 'hall', len: 3400, noAttack: true, music: 'calm',
        bgPar: 0, bgY: -420, bgZoom: 2.05, noMid: true, hazeA: 0.06,
        ground: [[0, 1280], [1500, 3400]],
        plats: [{ x: 1880, y: 378, w: 150, k: 'daisSteps' }],
        items: [{ t: 'lotus', x: 1955, y: 378, hidden: true }],
        npcs: [
          { id: 'janaka', x: 1860, face: -1, key: 'janaka', lines: D([
            ['janaka', 'The other princes have looked, and they have sat down again. I will not shame them by naming the weight.', 'दूसरे राजकुमार देख चुके हैं, और फिर बैठ गए हैं। मैं उस भार का नाम लेकर उन्हें लज्जित नहीं करूँगा।'],
            ['ramaA', 'A bow is only heavy to the hand that is arguing with it.', 'धनुष केवल उस हाथ के लिए भारी है जो उससे झगड़ा कर रहा हो।'],
            ['janaka', 'Then walk on. My daughter stands by the dais. The bow is beyond her, and it is not hidden.', 'तो आगे बढ़ो। मेरी पुत्री वेदिका के पास खड़ी है। धनुष उसके आगे है, और वह छिपा नहीं है।']
          ]) },
          { id: 'sitaStory', x: 2680, face: -1, key: 'sita', lines: D([
            ['sitaStory', 'You walked the length of the hall without announcing yourself. That is rarer than a strong arm.', 'तुमने सभागृह की लंबाई बिना अपना परिचय दिए पार की। यह बलवान भुजा से दुर्लभ है।'],
            ['ramaA', 'My name was already said at the door. The rest of me can arrive quietly.', 'मेरा नाम द्वार पर कहा जा चुका है। शेष मैं चुपचाप आ सकता हूँ।'],
            ['sitaStory', 'The bow is there. I will not tell you what to do with it. I will watch.', 'धनुष वहाँ है। मैं तुम्हें नहीं बताऊँगी कि उसके साथ क्या करना है। मैं देखूँगी।']
          ]) }
        ],
        decor: [{ k: 'pillarLotus', sh: 'terrain_9_30', x: 420, s: 0.7 }, { k: 'vessels', sh: 'props_9_30', x: 700, s: 0.45 }, { k: 'goldLotus', sh: 'props_9_30', x: 2100, s: 0.4 }],
        checkpoints: [60, 1300, 2300],
        tips: [{ x: 40, t: L('The bow stays on its dais. Walk the floor in front of it. Speak with Janaka, then with Sita.', 'धनुष अपनी वेदिका पर रहता है। उसके आगे की भूमि पर चलो। पहले जनक से, फिर सीता से बात करो।') },
          { x: 1100, t: L('The gap is in the floor, not on the bow. One jump, or two if you hesitate. A lotus sits on the low step.', 'खाई भूमि में है, धनुष पर नहीं। एक छलांग, या हिचकिचाओ तो दो। नीची सीढ़ी पर एक कमल है।') }],
        goal: { x: 3180, k: 'mark', need: ['janaka', 'sita'],
          blocked: L('Speak with Janaka and with Sita first.', 'पहले जनक से और सीता से बात करो।'),
          line: D([['ramaA', 'So this is the Pinaka. It does not look like a test. It looks like a thing that has been waiting.', 'तो यह पिनाक है। यह परीक्षा जैसा नहीं लगता। यह किसी प्रतीक्षा करती वस्तु जैसा लगता है।']]) } }
    ]
  });

  // ---------------------------------------------------------------- 16
  LEVELS.push({
    n: 16, plate: 'bg15', title: L('Lifting the Pinaka', 'पिनाक उठाना'), hero: 'ramaA', theme: 'hall',
    mode: L('Focus + timing', 'एकाग्रता + ताल'), music: { raga: 'yaman', lead: 'flute' },
    intro: L('Four phrases: plant, lift, string, draw. Release on the beat. A miss only asks you to begin that phrase again.', 'चार चरण: जमाओ, उठाओ, चढ़ाओ, खींचो। थाप पर छोड़ो। चूक केवल उसी चरण को फिर माँगती है।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Miss no more than once', 'एक से अधिक बार न चूको'), L('No mistimed phrase', 'कोई चरण ताल से न चूके')],
    star2: { stat: 'phaseMisses', max: 1 }, star3: { stat: 'phaseMisses', max: 0 },
    segs: [
      { type: 'story', theme: 'hall', cast: [{ id: 'janaka', x: 0.3, face: 1, s: 1.0, fr: 'announce' }, { id: 'ramaA', x: 0.62, face: -1, s: 1.12 }],
        lines: D([
          ['janaka', 'If any prince here can lift this bow, and string it, let him do it before this assembly.', 'यदि यहाँ कोई राजकुमार इस धनुष को उठा सके, और प्रत्यंचा चढ़ा सके, तो वह इस सभा के सामने करे।'],
          ['ramaA', 'Gurudev said the string leaves on the out-breath. I will not hurry the bow, and I will not fight it.', 'गुरुदेव ने कहा था कि प्रत्यंचा बाहर जाती साँस पर छूटती है। मैं धनुष को जल्दी नहीं करूँगा, और न उससे लड़ूँगा।'],
          ['narrator', 'Hold until the draw is full. Release when the rings meet. The hall will forgive a mistimed hand. The bow will simply wait.', 'खींचना पूरा होने तक दबाए रखो। जब वलय मिलें, छोड़ो। सभागृह एक चूकी हुई थाप क्षमा कर देगा। धनुष केवल प्रतीक्षा करेगा।']
        ]) },
      { type: 'pinaka', theme: 'hall', music: 'calm',
        phases: [
          { name: L('Plant your feet', 'पैर जमाओ'), period: 1.25 },
          { name: L('Lift', 'उठाओ'), period: 1.15 },
          { name: L('String the bow', 'प्रत्यंचा चढ़ाओ'), period: 1.08 },
          { name: L('Draw', 'खींचो'), period: 1.05 }
        ],
        tips: [{ t: L('HOLD to build the draw. RELEASE on the drum, when the ring closes on the bow. A miss retries only that phrase.', 'खींचने के लिए दबाए रखो। ढोल की थाप पर छोड़ो, जब वलय धनुष पर सिमटे। चूक केवल उसी चरण को दोहराती है।') }] },
      { type: 'story', theme: 'hall', cast: [{ id: 'ramaStory', x: 0.34, face: 1, s: 1.02, fr: 'triumph' }, { id: 'sitaStory', x: 0.68, face: -1, s: 1.02, fr: 'folded' }],
        lines: D([
          ['narrator', 'The bow breaks. Not as a failure. As a sound the hall had never been allowed to hear. Gold light stays in the air a moment longer than the wood.', 'धनुष टूटता है। असफलता की तरह नहीं। एक ऐसी ध्वनि की तरह जिसे सभागृह को सुनने की अनुमति कभी नहीं थी। स्वर्ण प्रकाश लकड़ी से एक क्षण अधिक हवा में रहता है।'],
          ['sitaStory', 'I watched your hands, not the bow. They were not trying to win me. That is why I am still standing here.', 'मैंने धनुष को नहीं, तुम्हारे हाथों को देखा। वे मुझे जीतने की चेष्टा नहीं कर रहे थे। इसीलिए मैं अभी भी यहाँ खड़ी हूँ।'],
          ['ramaA', 'I did not come to break a god\'s bow. I came because a sage asked me to see a king. The rest happened in my hands.', 'मैं किसी देवता का धनुष तोड़ने नहीं आया था। मैं इसलिए आया कि एक ऋषि ने मुझसे एक राजा को देखने को कहा। शेष मेरे हाथों में हो गया।'],
          ['sitaStory', 'Then let the garland wait until the hall can breathe again. I have already chosen where my eyes go.', 'तो माला तब तक रुके जब तक सभागृह फिर साँस ले सके। मैं चुन चुकी हूँ कि मेरी आँखें किधर जाएँ।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 17
  LEVELS.push({
    n: 17, plate: 'bg17', title: L('Parashurama Encounter', 'परशुराम से भेंट'), hero: 'ramaA', theme: 'clearing',
    mode: L('Arena + Story', 'अखाड़ा + कथा'), music: { raga: 'bhairav', lead: 'flute' },
    intro: L('A warrior-sage bars the road home. Meet his axe. The bout ends when he recognises you — not when he falls.', 'एक योद्धा-ऋषि घर के मार्ग पर खड़ा है। उसकी कुल्हाड़ी का सामना करो। मुक़ाबला तब रुकता है जब वह तुम्हें पहचान ले — जब वह गिरे, तब नहीं।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Land 2 perfect shots', '2 सटीक बाण लगाओ'), L('Take no hit in the clash', 'टक्कर में कोई चोट नहीं')],
    star2: { stat: 'perfect', min: 2 }, star3: { stat: 'sparHits', max: 0 },
    segs: [
      { type: 'story', theme: 'clearing', cast: [{ id: 'para', x: 0.3, face: 1, s: 0.95 }, { id: 'ramaA', x: 0.58, face: -1, s: 1.1 }, { id: 'vish', x: 0.8, face: -1, s: 0.92, fr: 'warn' }],
        lines: D([
          ['narrator', 'On the road back toward Ayodhya, a man with an axe is waiting. The broken Pinaka has already told him who passed through Mithila.', 'अयोध्या की ओर लौटते मार्ग पर एक पुरुष कुल्हाड़ी के साथ प्रतीक्षा कर रहा है। टूटा हुआ पिनाक उसे बता चुका है कि मिथिला से कौन गुज़रा।'],
          ['para', 'I am Rama, son of Jamadagni. The bow of Shiva does not break for a boy\'s curiosity. Show me the hand that did it.', 'मैं जमदग्नि का पुत्र राम हूँ। शिव का धनुष किसी बालक की उत्सुकता से नहीं टूटता। वह हाथ मुझे दिखाओ जिसने यह किया।'],
          ['vish', 'Answer him, prince. Do not try to finish him. This is not a battle you are meant to win by a body on the ground.', 'उसे उत्तर दो, राजकुमार। उसे समाप्त करने की चेष्टा मत करना। यह वह युद्ध नहीं है जिसे तुम ज़मीन पर पड़े शरीर से जीतो।'],
          ['ramaA', 'Then I will meet the axe, and I will stop when the man asks me to stop.', 'तो मैं कुल्हाड़ी का सामना करूँगा, और जब वह पुरुष रुकने को कहे, मैं रुकूँगा।']
        ]) },
      { type: 'arena', hero: 'ramaA', foe: 'parashurama', foeHp: 70, foeName: L('Parashurama', 'परशुराम'), theme: 'clearing', music: 'arena', yieldAt: 0.46,
        yieldLine: L('He stays his hand', 'वह हाथ रोकता है'),
        lose: L('The axe is not yours to break', 'कुल्हाड़ी तुम्हारे तोड़ने की नहीं'),
        tips: [{ t: L('A short clash. Block, jump the sweep, shoot the opening. He will stop the bout himself.', 'एक छोटी टक्कर। रोको, नीचे के वार पर कूदो, खुलाव पर बाण छोड़ो। वह स्वयं मुक़ाबला रोकेगा।') }] },
      { type: 'story', theme: 'clearing', cast: [{ id: 'para', x: 0.32, face: 1, s: 0.95, fr: 'recognise' }, { id: 'ramaA', x: 0.64, face: -1, s: 1.1 }],
        lines: D([
          ['para', 'Enough. I did not come to lay a prince in the dust. I came to see whether the bow broke for pride or for a hand that could carry it.', 'बस। मैं किसी राजकुमार को धूल में लिटाने नहीं आया। मैं यह देखने आया कि धनुष गर्व से टूटा, या ऐसे हाथ से जो उसे सँभाल सके।'],
          ['ramaA', 'I did not seek your anger, Bhargava. The bow broke in my hands. I am sorry for the noise, not for the deed.', 'मैं आपका क्रोध नहीं चाहता था, भार्गव। धनुष मेरे हाथों में टूटा। मुझे ध्वनि का खेद है, कर्म का नहीं।'],
          ['para', 'Then take what is left of my penance. I have carried it long enough. The axe goes with me, and the wrath stays here, spent.', 'तो मेरी तपस्या का जो शेष है, वह ले लो। मैं उसे बहुत देर तक ढो चुका हूँ। कुल्हाड़ी मेरे साथ जाती है, और क्रोध यहीं रहता है, समाप्त।'],
          ['narrator', 'He does not kneel, and he does not fall. He turns toward the forest and is simply gone, like a storm that has said its one sentence.', 'वह न झुकता है, न गिरता है। वह वन की ओर मुड़ता है और बस चला जाता है, जैसे कोई आँधी अपना एक वाक्य कह चुकी हो।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 18
  LEVELS.push({
    n: 18, plate: 'bg18a', title: L("Kaikeyi's Demand", 'कैकेयी की माँग'), hero: 'ramaA', theme: 'chamber',
    mode: L('Story', 'कथा'), music: { raga: 'bhairav', lead: 'veena' },
    intro: L('Two rooms. First a whisper. Then a court. Rama hears the two boons, and he accepts them.', 'दो कक्ष। पहले एक फुसफुसाहट। फिर दरबार। राम दो वर सुनते हैं, और उन्हें स्वीकार करते हैं।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Hear both boons', 'दोनों वर सुनो'), L('Hear Rama accept', 'राम की स्वीकृति सुनो')],
    star2: { stat: 'boons', min: 2 }, star3: { stat: 'accept', min: 1 },
    segs: [
      { type: 'story', theme: 'chamber', cast: [{ id: 'manthara', x: 0.32, face: 1, s: 1.0 }, { id: 'kaikeyi', x: 0.66, face: -1, s: 1.02 }],
        lines: [
          Line('narrator', 'In Kaikeyi\'s chamber the lamps are low. Manthara has been counting crowns all evening, and she has found one too many.', 'कैकेयी के कक्ष में दीप मंद हैं। मंथरा सारी संध्या मुकुट गिनती रही है, और उसे एक मुकुट अधिक मिला है।'),
          Line('manthara', 'Bharata is in his uncle\'s house, and Ayodhya is already sewing Rama\'s festival. When a city chooses a son, it forgets the other.', 'भरत अपने मामा के घर हैं, और अयोध्या पहले से राम का उत्सव सिल रही है। जब नगर एक पुत्र चुन लेता है, वह दूसरे को भूल जाता है।', { pose: { manthara: 'whisper', kaikeyi: 'stand' } }),
          Line('kaikeyi', 'Dasharatha loves me. He promised me two boons on a day when I kept him alive. Love does not cancel a promise.', 'दशरथ मुझसे प्रेम करते हैं। जिस दिन मैंने उन्हें जीवित रखा, उन्होंने मुझे दो वर दिए। प्रेम वचन को काटता नहीं।', { pose: { kaikeyi: 'argue', manthara: 'point' } }),
          Line('manthara', 'Then ask them now, while the festival is still cloth and not a coronation. Bharata to be yuvaraja. Rama to the forest for fourteen years.', 'तो अभी माँगो, जब उत्सव अभी वस्त्र है, राज्याभिषेक नहीं। भरत युवराज बनें। राम चौदह वर्ष वन को जाएँ।', { pose: { manthara: 'point', kaikeyi: 'defiant' }, stat: 'boons' }),
          Line('kaikeyi', 'Fourteen years. Long enough for a city to learn another name, and short enough that I can say I was not cruel.', 'चौदह वर्ष। इतने लंबे कि नगर दूसरा नाम सीख ले, और इतने छोटे कि मैं कह सकूँ कि मैं क्रूर नहीं थी।', { pose: { kaikeyi: 'turnAway', manthara: 'slinkAway' }, stat: 'boons' })
        ] },
      { type: 'story', theme: 'court', cast: [{ id: 'kaikeyi', x: 0.22, face: 1, s: 1.0, fr: 'defiant' }, { id: 'king', x: 0.48, face: -1, s: 0.98, fr: 'plead' }, { id: 'ramaA', x: 0.76, face: -1, s: 1.08 }],
        lines: [
          Line('narrator', 'The court is no longer a festival. Dasharatha has heard the two boons spoken aloud, and the words will not go back into the room they came from.', 'दरबार अब उत्सव नहीं रहा। दशरथ दो वरों को ऊँची आवाज़ में सुन चुके हैं, और शब्द उस कक्ष में वापस नहीं जाएँगे जहाँ से आए।'),
          Line('king', 'Ask me for my life, Kaikeyi. Do not ask me for my word against my son. I am an old king. I am not a good liar.', 'मुझसे मेरा जीवन माँगो, कैकेयी। मुझसे मेरे पुत्र के विरुद्ध मेरा वचन मत माँगो। मैं बूढ़ा राजा हूँ। मैं अच्छा झूठा नहीं हूँ।', { pose: { king: 'plead', kaikeyi: 'defiant', ramaA: 'idle' } }),
          Line('kaikeyi', 'I am not asking for a lie. I am asking for the promise you made when the wheel of your chariot was at your throat. Bharata will be yuvaraja. Rama will go.', 'मैं झूठ नहीं माँग रही। मैं वह वचन माँग रही हूँ जो तुमने तब दिया था जब रथ का चक्र तुम्हारे गले पर था। भरत युवराज होंगे। राम जाएँगे।', { pose: { kaikeyi: 'defiant', king: 'grief' } }),
          Line('ramaA', 'Father. I heard it. The kingdom was never a thing I had held yet. Fourteen years of forest is a hard promise, and it is still a promise.', 'पिताजी। मैंने सुना। राज्य अभी ऐसी वस्तु नहीं था जिसे मैं थाम चुका होता। चौदह वर्ष का वन एक कठिन वचन है, और फिर भी वह वचन है।', { pose: { ramaA: 'idle', king: 'grief', kaikeyi: 'stand' }, stat: 'accept' }),
          Line('king', 'Do not be noble at me, my son. If you go, I will not know how to remain a king.', 'मुझ पर इतने श्रेष्ठ मत बनो, मेरे पुत्र। यदि तुम गए, तो मैं नहीं जानूँगा कि राजा कैसे बना रहूँ।', { pose: { king: 'grief', ramaA: 'idle' } }),
          Line('ramaA', 'Then be a father tonight, and a king in the morning. I will go. Sita and Lakshmana may choose for themselves. I will not choose for them.', 'तो आज रात पिता रहिए, और सुबह राजा। मैं जाऊँगा। सीता और लक्ष्मण अपने लिए स्वयं चुन सकते हैं। मैं उनके लिए नहीं चुनूँगा।', { pose: { ramaA: 'idle', king: 'stand', kaikeyi: 'turnAway' } })
        ] }
    ]
  });

  // ---------------------------------------------------------------- 19
  LEVELS.push({
    n: 19, plate: 'bg19', title: L('Leaving Ayodhya', 'अयोध्या से विदा'), hero: 'ramaA', theme: 'depart',
    mode: L('Platformer + Runner', 'प्लेटफ़ॉर्मर + दौड़'), music: { raga: 'bhupali', lead: 'flute' },
    intro: L('The city follows you to the gate. Speak with Sita and Lakshmana. Then the road opens, and you do not look back for long.', 'नगर तुम्हें द्वार तक आता है। सीता और लक्ष्मण से बात करो। फिर मार्ग खुलता है, और तुम देर तक पीछे नहीं देखते।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Clear 3 stones on the road', 'मार्ग की 3 शिलाएँ हटाओ'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'smash', min: 3 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'story', theme: 'court', cast: [{ id: 'king', x: 0.24, face: 1, s: 0.96, fr: 'grief' }, { id: 'ramaA', x: 0.48, face: -1, s: 1.08 }, { id: 'sitaA', x: 0.68, face: -1, s: 1.05 }, { id: 'lakA', x: 0.84, face: -1, s: 1.05 }],
        lines: D([
          ['narrator', 'Morning in Ayodhya, and the festival cloth is being taken down. Rama has accepted the forest. The city has not.', 'अयोध्या में सुबह है, और उत्सव के वस्त्र उतारे जा रहे हैं। राम वन स्वीकार कर चुके हैं। नगर ने नहीं किया।'],
          ['king', 'I cannot bless this road. My mouth will not make the words. Go, if you must go, before I ask you to break what I promised.', 'मैं इस मार्ग को आशीर्वाद नहीं दे सकता। मेरा मुँह ये शब्द नहीं बनाएगा। जाओ, यदि जाना ही है, इससे पहले कि मैं तुमसे अपना वचन तुड़वाने लगूँ।'],
          ['sitaA', 'I married a man, not a palace. If the road is fourteen years long, I will learn its length with my own feet.', 'मैंने एक पुरुष से विवाह किया था, महल से नहीं। यदि मार्ग चौदह वर्ष का है, तो मैं उसकी लंबाई अपने पैरों से सीखूँगी।'],
          ['lakA', 'And I am not asking. Where you sleep, I watch. That was the promise on the practice field. It did not expire at a gate.', 'और मैं पूछ नहीं रहा। आप जहाँ सोएँगे, मैं जागूँगा। यह वचन अभ्यास-मैदान पर दिया गया था। वह किसी द्वार पर समाप्त नहीं हुआ।'],
          ['ramaA', 'Then we three go. Father, look at us once, and then let the gate do the rest.', 'तो हम तीन चलेंगे। पिताजी, हमें एक बार देख लीजिए, फिर शेष द्वार करने दीजिए।']
        ]) },
      { type: 'platform', hero: 'ramaA', partner: 'lakA', theme: 'depart', len: 3000, noAttack: true, music: 'calm',
        ground: [[0, 3000]],
        plats: [{ x: 700, y: 340, w: 180, k: 'ledgeBamboo' }, { x: 1500, y: 310, w: 200, k: 'daisSteps' }],
        npcs: [{ id: 'sitaA', x: 2100, face: -1, key: 'sita', lines: D([
          ['sitaA', 'They are walking behind us with flowers still in their hands. Do not hurry them, and do not wave as if this were a wedding.', 'वे अब भी हाथों में फूल लिए हमारे पीछे चल रहे हैं। उन्हें जल्दी मत करो, और ऐसे हाथ मत हिलाओ जैसे यह विवाह हो।'],
          ['ramaA', 'I will not wave. I will walk slowly enough that the city can turn back when it is ready.', 'मैं हाथ नहीं हिलाऊँगा। मैं इतनी धीमी चाल चलूँगा कि नगर जब तैयार हो, लौट सके।'],
          ['lakA', 'The gate is ahead, brother. After the gate, the road belongs to us.', 'द्वार आगे है, भैया। द्वार के बाद मार्ग हमारा है।']
        ]) }],
        decor: [{ k: 'mango', sh: 'scenery_9_30', x: 360, s: 0.7 }, { k: 'goldenTree', sh: 'scenery_9_30', x: 1200, s: 0.65 }, { k: 'vessels', sh: 'props_9_30', x: 1700, s: 0.4 }],
        checkpoints: [60, 1400],
        tips: [{ x: 40, t: L('The people follow. Walk to Sita and speak. There is no enemy in the street.', 'लोग पीछे आ रहे हैं। सीता के पास जाकर बात करो। गली में कोई शत्रु नहीं।') }],
        goal: { x: 2780, k: 'gate', need: ['sita'],
          blocked: L('Speak with Sita before the gate.', 'द्वार से पहले सीता से बात करो।'),
          line: D([['ramaA', 'One look. Then the road.', 'एक दृष्टि। फिर मार्ग।']]) } },
      { type: 'runner', hero: 'ramaA', theme: 'depart', len: 9000, speed: 340, speedMax: 380, seed: 19, music: 'play',
        phases: [
          { until: 4200, set: ['rock', 'gap', 'boulder', 'branch'], name: L('Beyond the gate', 'द्वार के पार') },
          { until: 8600, set: ['gap', 'boulder', 'branch', 'rock'], name: L('The first miles', 'पहले मील') }
        ],
        tips: [{ x: 40, t: L('A gentle road. Jump the gaps. Slide the low branches. The forest can wait until you arrive.', 'एक कोमल मार्ग। खाई पर कूदो। नीची डालियों के नीचे फिसलो। वन तुम्हारे पहुँचने तक रुक सकता है।') }],
        endText: L('The road opens', 'मार्ग खुलता है') },
      { type: 'story', theme: 'depart', cast: [{ id: 'ramaA', x: 0.3, face: 1, s: 1.08 }, { id: 'sitaA', x: 0.52, face: 1, s: 1.02 }, { id: 'lakA', x: 0.74, face: -1, s: 1.05, fr: 'guard' }],
        lines: D([
          ['narrator', 'Ayodhya is a pale line now, and then not even that. The three of them stand where the fields give up their fences.', 'अयोध्या अब एक फीकी रेखा है, और फिर वह भी नहीं। वे तीनों वहाँ खड़े हैं जहाँ खेत अपनी बाड़ छोड़ देते हैं।'],
          ['lakA', 'Do we look back again?', 'क्या हम फिर पीछे देखते हैं?'],
          ['sitaA', 'Once was the true look. Another would only hurt the king who is still standing at the gate in his mind.', 'एक बार की दृष्टि सच्ची थी। दूसरी केवल उस राजा को दुख देगी जो अपने मन में अब भी द्वार पर खड़ा है।'],
          ['ramaA', 'Then the road opens here. Fourteen years. We will learn them one morning at a time.', 'तो मार्ग यहीं खुलता है। चौदह वर्ष। हम उन्हें एक-एक सुबह सीखेंगे।'],
          ['narrator', 'The city is behind them. The forest has not yet spoken.', 'नगर उनके पीछे है। वन ने अभी कुछ नहीं कहा।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 20
  LEVELS.push({
    n: 20, plate: 'bg20', title: L('Early Forest Travel', 'वन-यात्रा का आरंभ'), hero: 'ramaA', theme: 'deepforest',
    mode: L('Runner', 'दौड़'), music: { raga: 'bhairav', lead: 'flute' },
    intro: L('The forest does not know your name yet. Run the path. Clear what hunts. Reach the clearing.', 'वन अभी तुम्हारा नाम नहीं जानता। पथ दौड़ो। जो शिकार करे उसे हटाओ। समाई तक पहुँचो।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Clear 8 beasts', '8 पशु हटाओ'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'smash', min: 8 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'story', theme: 'deepforest', cast: [{ id: 'ramaA', x: 0.32, face: 1, s: 1.08 }, { id: 'lakA', x: 0.55, face: -1, s: 1.05 }, { id: 'sitaA', x: 0.76, face: -1, s: 1.02 }],
        lines: D([
          ['narrator', 'South of the river, the trees close their ranks. This is not yet Panchavati. This is only the road that teaches the feet.', 'नदी के दक्षिण में वृक्ष अपनी पंक्ति कस लेते हैं। यह अभी पंचवटी नहीं। यह केवल वह मार्ग है जो पैरों को सिखाता है।'],
          ['lakA', 'Boar, and something smaller that laughs. I will walk behind Sita. You take the front, brother.', 'सूअर, और कुछ छोटा जो हँसता है। मैं सीता के पीछे चलूँगा। आगे आप रहें, भैया।'],
          ['sitaA', 'Do not make a war of a path. Clear what stands in it, and leave the rest to the trees.', 'मार्ग का युद्ध मत बनाओ। जो उसमें खड़ा हो उसे हटाओ, शेष वृक्षों पर छोड़ दो।'],
          ['ramaA', 'A clearing by dusk. That is the whole ambition of today.', 'संध्या तक एक समाई। आज की पूरी आकांक्षा यही है।']
        ]) },
      { type: 'runner', hero: 'ramaA', theme: 'deepforest', len: 22000, speed: 390, speedMax: 450, seed: 20, music: 'play',
        phases: [
          { until: 7000, set: ['gap', 'boar', 'branch', 'rock'], name: L('The first shade', 'पहली छाया') },
          { until: 14000, set: ['imp', 'branch', 'boar', 'gap', 'wolf'], name: L('Things that follow', 'जो पीछे आते हैं') },
          { until: 21000, set: ['gap', 'imp', 'boulder', 'branch', 'boar'], name: L('Toward a clearing', 'समाई की ओर') }
        ],
        tips: [{ x: 40, t: L('Jump gaps, slide branches, loose arrows at boars and the small laughers.', 'खाई पर कूदो, डालियों के नीचे फिसलो, सूअरों और छोटे हँसने वालों पर बाण छोड़ो।') }],
        endText: L('A clearing', 'एक समाई') },
      { type: 'story', theme: 'deepforest', cast: [{ id: 'ramaA', x: 0.4, face: 1, s: 1.08 }, { id: 'sitaA', x: 0.66, face: -1, s: 1.02 }],
        lines: D([
          ['sitaA', 'The trees step back here. I can see sky.', 'यहाँ वृक्ष पीछे हटते हैं। मुझे आकाश दिखता है।'],
          ['ramaA', 'Not home. A place to stop. Tomorrow we look for water and a ground that will hold a hut.', 'घर नहीं। रुकने की जगह। कल हम जल खोजेंगे, और ऐसी भूमि जो एक कुटिया सँभाल सके।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 21
  LEVELS.push({
    n: 21, plate: 'bg21', title: L('The Forest Dwelling', 'वन की कुटिया'), hero: 'ramaA', theme: 'panch',
    mode: L('Platformer', 'प्लेटफ़ॉर्मर'), music: { raga: 'bhupali', lead: 'flute' },
    intro: L('Panchavati. Clear the ground, raise the hut, and keep a small fire through the first night.', 'पंचवटी। भूमि साफ़ करो, कुटिया उठाओ, और पहली रात एक छोटी अग्नि बचाए रखो।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Keep the night fire above 50%', 'रात्रि की अग्नि 50% से ऊपर रखो'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'altarMin', min: 50 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'story', theme: 'panch', cast: [{ id: 'ramaA', x: 0.28, face: 1, s: 1.08 }, { id: 'sitaA', x: 0.52, face: -1, s: 1.02 }, { id: 'lakA', x: 0.76, face: -1, s: 1.05 }],
        lines: D([
          ['narrator', 'They choose a bend of the Godavari where five trees stand close enough to be a wall, and far enough to be a sky.', 'वे गोदावरी के एक मोड़ को चुनते हैं, जहाँ पाँच वृक्ष दीवार जितने पास हैं, और आकाश जितने दूर।'],
          ['sitaA', 'Here. The water is near, and the ground is honest. I will not miss a palace that cannot follow us.', 'यहीं। जल पास है, और भूमि सच्ची है। मैं उस महल को नहीं पूछूँगी जो हमारे साथ नहीं आ सकता।'],
          ['lakA', 'Then I take the night side. Whatever comes out of the trees meets me before it meets the fire.', 'तो रात का पक्ष मैं लेता हूँ। वृक्षों से जो भी निकले, अग्नि से पहले मुझसे मिले।'],
          ['ramaA', 'First the ground. Then the hut. Then we learn what the dark wants.', 'पहले भूमि। फिर कुटिया। फिर हम जानेंगे कि अँधेरा क्या चाहता है।']
        ]) },
      { type: 'platform', hero: 'ramaA', partner: 'lakA', theme: 'panch', len: 2800, music: 'play',
        ground: [[0, 2800]],
        plats: [{ x: 900, y: 340, w: 170, k: 'ledgeRoots' }, { x: 1600, y: 300, w: 160, k: 'logBridge' }],
        foes: [{ t: 'raider', x: 700, hp: 3 }, { t: 'raider', x: 1400, hp: 3 }, { t: 'brute', x: 2100, hp: 5 }],
        decor: [{ k: 'bamboo', sh: 'scenery_9_30', x: 280, s: 0.7 }, { k: 'mango', sh: 'scenery_9_30', x: 1200, s: 0.65 }, { k: 'fern', sh: 'scenery_9_30', x: 2000, s: 0.5 }],
        checkpoints: [60, 1100, 1900],
        tips: [{ x: 40, t: L('Clear the ground. Rama shoots, Lakshmana strikes. ⇄ switches. The hut waits at the far trees.', 'भूमि साफ़ करो। राम बाण चलाते हैं, लक्ष्मण वार करते हैं। ⇄ से बदलो। कुटिया दूर के वृक्षों पर प्रतीक्षा करती है।') }],
        goal: { x: 2580, k: 'hut', line: D([['sitaA', 'It is small. It will do. A house is a decision, not a size.', 'यह छोटी है। काम चलेगी। घर एक निर्णय है, नाप नहीं।']]) } },
      { type: 'defend', hero: 'ramaA', partner: 'lakA', theme: 'panchNight', music: 'arena', altarX: 0.28, gap: 1.45,
        waves: [['raider', 'raider'], ['raider', 'brute']],
        decor: [{ k: 'leafHut', sh: 'props_9_30', x: 70, s: 0.7 }],
        tips: [{ t: L('Night. The ringed flame by the hut is the one that must last until dawn.', 'रात। कुटिया के पास वलय वाली लौ ही वह है जिसे प्रभात तक रहना है।') }] },
      { type: 'story', theme: 'panch', cast: [{ id: 'ramaA', x: 0.3, face: 1, s: 1.05 }, { id: 'sitaA', x: 0.52, face: 1, s: 1.0 }, { id: 'lakA', x: 0.74, face: -1, s: 1.05, fr: 'guard' }],
        lines: D([
          ['narrator', 'Dawn finds the hut still standing, and the fire low but alive. The Godavari makes its ordinary noise, as if the night had been a rumour.', 'प्रभात कुटिया को खड़ी पाता है, और अग्नि को मंद पर जीवित। गोदावरी अपनी साधारण ध्वनि करती है, मानो रात केवल एक अफवाह रही हो।'],
          ['lakA', 'They will come back larger. Tonight was only a question.', 'वे और बड़े होकर लौटेंगे। आज रात केवल एक प्रश्न था।'],
          ['ramaA', 'Then we have answered it once. That is how a dwelling begins.', 'तो हमने उसे एक बार उत्तर दे दिया। कुटिया ऐसे ही आरंभ होती है।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 22
  LEVELS.push({
    n: 22, plate: 'bg22', title: L('Forest Demon Encounters', 'वन के राक्षस'), hero: 'ramaA', theme: 'demons',
    mode: L('Arena', 'अखाड़ा'), music: { raga: 'bhairav', lead: 'flute' },
    intro: L('Three come out of the trees, one after another. Hold the clearing. Lakshmana guards the hut behind you.', 'तीन वृक्षों से निकलते हैं, एक के बाद एक। समाई सँभालो। लक्ष्मण तुम्हारे पीछे कुटिया की रखवाली करते हैं।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Land 3 perfect shots', '3 सटीक बाण लगाओ'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'perfect', min: 3 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'story', theme: 'demons', cast: [{ id: 'ramaA', x: 0.34, face: 1, s: 1.08 }, { id: 'lakA', x: 0.66, face: -1, s: 1.05, fr: 'guard' }],
        lines: D([
          ['narrator', 'The question comes back with company. Not an army. Three who have decided the hut is an insult.', 'प्रश्न संग लेकर लौटता है। सेना नहीं। तीन, जिन्होंने मान लिया है कि कुटिया एक अपमान है।'],
          ['lakA', 'I stay on the hut. If one gets past you, he still meets me.', 'मैं कुटिया पर रहता हूँ। यदि एक आपके पार निकल भी गया, तब भी वह मुझसे मिलेगा।'],
          ['ramaA', 'Then the clearing is mine. One at a time. I will not chase them into the trees.', 'तो समाई मेरी है। एक-एक करके। मैं उन्हें वृक्षों के भीतर नहीं खदेड़ूँगा।']
        ]) },
      { type: 'arena', hero: 'ramaA', theme: 'demons', music: 'arena',
        lose: L('The clearing is lost', 'समाई खो गई'),
        roster: [
          { id: 'raiderF', hp: 36, name: L('Forest raider', 'वन का राक्षस') },
          { id: 'raiderF', hp: 42, name: L('Forest raider', 'वन का राक्षस') },
          { id: 'bruteF', hp: 64, name: L('The large one', 'वह बड़ा वाला') }
        ],
        tips: [{ t: L('Fixed ground. Block the high strike, jump the sweep, shoot when they are open.', 'स्थिर भूमि। ऊँचा वार रोको, नीचे के वार पर कूदो, जब वे खुले हों तब बाण छोड़ो।') }] },
      { type: 'story', theme: 'panch', cast: [{ id: 'sitaA', x: 0.34, face: 1, s: 1.02 }, { id: 'ramaA', x: 0.62, face: -1, s: 1.05 }],
        lines: D([
          ['sitaA', 'The hut heard it. I kept the fire. You kept them off the step.', 'कुटिया ने सुना। मैंने अग्नि रखी। तुमने उन्हें सीढ़ी से दूर रखा।'],
          ['ramaA', 'There will be more. A sister of theirs walks these woods. I have not seen her yet. I think the trees have.', 'और भी आएँगे। उनकी एक बहन इन वनों में चलती है। मैंने उसे अभी नहीं देखा। मुझे लगता है वृक्षों ने देखा है।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 23
  LEVELS.push({
    n: 23, plate: 'bg21', title: L('Shurpanakha Approaches', 'शूर्पणखा का आगमन'), hero: 'ramaA', theme: 'panch',
    mode: L('Story + Platformer', 'कथा + प्लेटफ़ॉर्मर'), music: { raga: 'yaman', lead: 'flute' },
    intro: L('A woman comes to the hut with a proposal. Hear her. Refuse her plainly. The path after that is no longer a visit.', 'एक स्त्री प्रस्ताव लेकर कुटिया पर आती है। उसे सुनो। स्पष्ट मना करो। उसके बाद का मार्ग मुलाकात नहीं रहता।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Hear her offer and the refusal', 'उसका प्रस्ताव और अस्वीकार सुनो'), L('Cross the path without a fall', 'बिना गिरे पथ पार करो')],
    star2: { stat: 'offer', min: 1 }, star3: { stat: 'falls', max: 0 },
    segs: [
      { type: 'story', theme: 'panch', cast: [{ id: 'shurpa', x: 0.26, face: 1, s: 1.02 }, { id: 'ramaA', x: 0.52, face: -1, s: 1.05 }, { id: 'sitaA', x: 0.76, face: -1, s: 1.0 }],
        lines: [
          Line('narrator', 'She comes in the afternoon, alone, and she does not bother to pretend she is lost.', 'वह दोपहर में आती है, अकेली, और यह बहाना नहीं करती कि वह भटक गई है।', { pose: { shurpa: 'composed' } }),
          Line('shurpa', 'I am Shurpanakha. These woods know my brothers better than they know you. You are beautiful, archer. Come with me. Leave the hut.', 'मैं शूर्पणखा हूँ। ये वन मेरे भाइयों को तुमसे बेहतर जानते हैं। तुम सुंदर हो, धनुर्धर। मेरे साथ चलो। कुटिया छोड़ दो।', { pose: { shurpa: 'offer', ramaA: 'idle' }, stat: 'offer' }),
          Line('ramaA', 'I am married. She is standing beside the fire you are pretending not to see. I will not go, and I will not be cruel about the answer.', 'मेरा विवाह हो चुका है। वह उस अग्नि के पास खड़ी है जिसे तुम देखकर भी अनदेखा कर रही हो। मैं नहीं जाऊँगा, और उत्तर में क्रूर नहीं होऊँगा।', { pose: { shurpa: 'offer', sitaA: 'idle' } }),
          Line('sitaA', 'You may drink water. You may sit. You may not shop for my husband as if he were a garland.', 'तुम जल पी सकती हो। बैठ सकती हो। मेरे पति को माला की तरह नहीं चुन सकतीं।', { pose: { sitaA: 'idle', shurpa: 'angry' } }),
          Line('shurpa', 'A wife who speaks. How small a kingdom this hut is. Keep him, then. The woods will not stay this polite.', 'एक पत्नी जो बोलती है। यह कुटिया कितना छोटा राज्य है। तो उसे रखो। वन इतना विनम्र नहीं रहेगा।', { pose: { shurpa: 'turnAway' } })
        ] },
      { type: 'platform', hero: 'ramaA', partner: 'lakA', theme: 'panch', len: 2400, music: 'play',
        ground: [[0, 900], [1120, 2400]],
        plats: [{ x: 980, y: 360, w: 140, k: 'logBridge' }],
        foes: [{ t: 'raider', x: 1600, hp: 3 }],
        decor: [{ k: 'bamboo', sh: 'scenery_9_30', x: 400, s: 0.65 }, { k: 'fern', sh: 'scenery_9_30', x: 1700, s: 0.5 }],
        checkpoints: [60, 1200],
        tips: [{ x: 40, t: L('She has left the hut. Follow the path. The gap is only a gap. One raider is only a raider.', 'वह कुटिया छोड़ चुकी है। पथ पर चलो। खाई केवल खाई है। एक राक्षस केवल एक राक्षस है।') }],
        npcs: [{ id: 'shurpa', x: 2000, face: -1, key: 'shurpa', lines: [
          Line('shurpa', 'Tell your brother with the sword that I am not finished. I am going where my brothers can hear a complaint.', 'अपने तलवार वाले भाई से कहना कि मैं समाप्त नहीं हुई। मैं वहाँ जा रही हूँ जहाँ मेरे भाई एक शिकायत सुन सकें।', { pose: { shurpa: 'angry' } }),
          Line('ramaA', 'Go, then. Do not come back to this fire with a crowd.', 'तो जाओ। इस अग्नि पर भीड़ लेकर मत लौटना।', { pose: { shurpa: 'turnAway' } })
        ] }],
        goal: { x: 2260, k: 'mark', need: ['shurpa'],
          blocked: L('She is still on the path. Hear her last words.', 'वह अभी पथ पर है। उसके अंतिम शब्द सुनो।') } }
    ]
  });

  // ---------------------------------------------------------------- 24
  LEVELS.push({
    n: 24, plate: 'bg22', title: L("Shurpanakha's Attack", 'शूर्पणखा का आक्रमण'), hero: 'lakA', theme: 'demons',
    mode: L('Arena', 'अखाड़ा'), music: { raga: 'bhairav', lead: 'flute' },
    intro: L('You are Lakshmana. She comes back to hurt Sita. Stop her. The bout ends when she breaks and runs — not in a killing.', 'तुम लक्ष्मण हो। वह सीता को चोट पहुँचाने लौटती है। उसे रोको। मुक़ाबला तब समाप्त होता है जब वह टूटकर भागती है — वध में नहीं।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Land 2 perfect blows', '2 सटीक प्रहार करो'), L('Take no hit', 'कोई चोट नहीं')],
    star2: { stat: 'perfect', min: 2 }, star3: { stat: 'sparHits', max: 0 },
    segs: [
      { type: 'story', theme: 'demons', cast: [{ id: 'shurpa', x: 0.24, face: 1, s: 1.02, fr: 'angry' }, { id: 'sitaA', x: 0.5, face: -1, s: 1.0 }, { id: 'lakA', x: 0.74, face: -1, s: 1.08, fr: 'guard' }],
        lines: D([
          ['narrator', 'She comes back before the story she went to tell. The proposal is over. What remains is rage, and it is aimed at Sita.', 'वह अपनी कही जाने वाली कथा से पहले ही लौट आती है। प्रस्ताव समाप्त हो चुका है। जो बचा है वह क्रोध है, और वह सीता की ओर है।'],
          ['shurpa', 'You spoke. Now bleed for the speaking. He would have come with me if you had been quiet.', 'तुमने बोला। अब बोलने का मूल्य चुकाओ। यदि तुम चुप रहतीं, तो वह मेरे साथ आता।'],
          ['lakA', 'Brother is at the river. I am here. You will not touch her. Put the nails down, or I will make you leave.', 'भैया नदी पर हैं। मैं यहाँ हूँ। तुम उन्हें छू नहीं पाओगी। नख नीचे करो, नहीं तो मैं तुम्हें यहाँ से निकलवा दूँगा।'],
          ['sitaA', 'Lakshmana. Stop her. Do not make a spectacle of her. She is angry, and she is still a person.', 'लक्ष्मण। उसे रोको। उसका तमाशा मत बनाओ। वह क्रोधित है, और फिर भी एक व्यक्ति है।']
        ]) },
      { type: 'arena', hero: 'lakA', foe: 'shurpa', foeHp: 72, foeName: L('Shurpanakha', 'शूर्पणखा'), theme: 'demons', music: 'arena', yieldAt: 0.4,
        yieldLine: L('She breaks away', 'वह छिटककर भागती है'),
        lose: L('She reaches Sita', 'वह सीता तक पहुँच जाती है'),
        tips: [{ t: L('Lakshmana\'s sword. Block, jump the sweep, strike the opening. She flees when her pride fails. Do not chase a killing.', 'लक्ष्मण की तलवार। रोको, नीचे के वार पर कूदो, खुलाव पर वार करो। जब उसका गर्व टूटे, वह भागती है। वध के लिए पीछा मत करना।') }] },
      { type: 'story', theme: 'panch', cast: [{ id: 'lakA', x: 0.3, face: 1, s: 1.05 }, { id: 'ramaA', x: 0.52, face: -1, s: 1.05 }, { id: 'sitaA', x: 0.74, face: -1, s: 1.0 }],
        lines: D([
          ['narrator', 'She runs. Not cut apart for the audience, and not dead. Wounded in her pride, humiliated, and already composing the story she will tell Khara, and after Khara, Ravana.', 'वह भागती है। दर्शकों के लिए काटी हुई नहीं, और मरी हुई नहीं। गर्व में घायल, अपमानित, और पहले से वह कथा गढ़ती हुई जिसे वह खर को सुनाएगी, और खर के बाद रावण को।'],
          ['lakA', 'I struck to drive her off. She is gone toward her brothers. I am not proud of the noise.', 'मैंने उसे खदेड़ने के लिए वार किया। वह अपने भाइयों की ओर गई है। मैं इस शोर पर गर्व नहीं करता।'],
          ['sitaA', 'You kept your sword a sword. Thank you. I am still here.', 'तुमने अपनी तलवार को तलवार ही रहने दिया। धन्यवाद। मैं अभी भी यहाँ हूँ।'],
          ['ramaA', 'Then the forest has our names now, and her brothers will have a version of today that we will not like. We keep the hut. We do not go hunting a humiliated woman.', 'तो वन के पास अब हमारे नाम हैं, और उसके भाइयों के पास आज का एक रूप होगा जो हमें पसंद नहीं आएगा। हम कुटिया रखते हैं। हम एक अपमानित स्त्री का शिकार नहीं करते।']
        ]) }
    ]
  });

  window.RPD_LATER = [
    [25, L('The Golden Deer', 'स्वर्ण मृग'), L('Runner', 'दौड़')],
    [26, L('Lakshmana Drawn Away', 'लक्ष्मण का जाना'), L('Platformer + Story', 'प्लेटफ़ॉर्मर + कथा')],
    [27, L("Ravana's Approach and the Line", 'रावण का आगमन और रेखा'), L('Story + Platformer', 'कथा + प्लेटफ़ॉर्मर')],
    [28, L('The Abduction', 'सीता हरण'), L('Runner + Arena', 'दौड़ + अखाड़ा')],
    [29, L("Jatayu's Air Battle", 'जटायु का आकाश-युद्ध'), L('Air / Flyer', 'आकाश-उड़ान')],
    [30, L('Aftermath and the Vow', 'परिणाम और प्रतिज्ञा'), L('Story', 'कथा')]
  ];
})();
