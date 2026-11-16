// RAMAYANA: PATH OF DHARMA - levels 1-8 (message 194 opening interleave: Ravana / Rama / Sita).
// Every level is data: segments (story, platform, runner, arena, meditate, archery, beat), geometry, foes,
// bilingual lines (en / hi), star rules. All wording is original, in a measured epic voice.
(function () {
  'use strict';
  var GY = 440;
  function L(en, hi) { return { en: en, hi: hi }; }
  // dialogue line: [speaker, en, hi]
  function D(arr) { return arr.map(function (a) { return { who: a[0], en: a[1], hi: a[2] }; }); }

  var CAST = {
    narrator: { name: L('The Telling', 'कथा') },
    dash: { sh: 'dash', fr: 'idle', name: L('Dashanan', 'दशानन') },
    ascetic: { sh: 'ascetic', fr: 'calm', name: L('Dashanan', 'दशानन') },
    rama: { sh: 'rama', fr: 'idle', name: L('Rama', 'राम') },
    lak: { sh: 'lak', fr: 'idle', name: L('Lakshmana', 'लक्ष्मण') },
    sita: { sh: 'sita', fr: 'idle', name: L('Sita', 'सीता') },
    teacher: { sh: 'teacher', fr: 'ready', name: L('Arms-Mistress of Mithila', 'मिथिला की शस्त्र-गुरु') },
    kaikasi: { sh: 'npc', fr: 'kaikasi', name: L('Kaikasi, his mother', 'कैकसी, उसकी माता') },
    kaushalya: { sh: 'npc', fr: 'kaushalya', name: L('Queen Kaushalya', 'महारानी कौशल्या') },
    dasharatha: { sh: 'npc', fr: 'dasharatha', name: L('King Dasharatha', 'महाराज दशरथ') },
    vasishtha: { sh: 'npc', fr: 'vasishtha', name: L('Sage Vasishtha', 'महर्षि वशिष्ठ') }
  };

  var LEVELS = [];

  // ---------------------------------------------------------------- 1
  LEVELS.push({
    n: 1, title: L("Young Dashanan's Departure", 'युवा दशानन का प्रस्थान'), hero: 'dash', theme: 'ash',
    mode: L('Platformer + Runner', 'प्लेटफ़ॉर्मर + दौड़'), music: { raga: 'bhairav', lead: 'veena' },
    intro: L('The asura host is broken. Cross the burning field and find the mountain road.', 'असुर सेना टूट चुकी है। जलते रणक्षेत्र को पार करो और पर्वत का मार्ग खोजो।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Gather the 3 fallen war-standards', '3 गिरे हुए युद्ध-ध्वज इकट्ठा करो'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'standards', min: 3 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'story', theme: 'ash', cast: [{ id: 'dash', x: 0.32, face: 1, s: 1.32 }, { id: 'kaikasi', x: 0.62, face: -1, s: 1.0 }],
        lines: D([
          ['narrator', "The asura host is broken. Smoke hangs over the field where Sumali's banners fell.", 'असुरों की सेना टूट चुकी है। जहाँ सुमाली के ध्वज गिरे थे, वहाँ धुआँ छाया है।'],
          ['kaikasi', 'My son, you walk away from ash. Do not let the ash walk with you.', 'मेरे पुत्र, तुम राख से दूर जा रहे हो। उस राख को अपने साथ मत ले जाना।'],
          ['dash', 'Mother, I have seen what weakness costs. I will not kneel to it again.', 'माँ, मैंने देखा है कि दुर्बलता का मूल्य क्या है। मैं फिर उसके आगे नहीं झुकूँगा।'],
          ['kaikasi', 'Then go to the mountains. Seek strength through tapas, not through plunder. Go with my blessing.', 'तो पर्वतों की ओर जाओ। लूट से नहीं, तप से बल पाओ। मेरा आशीर्वाद तुम्हारे साथ है।'],
          ['dash', 'I will return with a power no god can take from me.', 'मैं ऐसी शक्ति लेकर लौटूँगा जिसे कोई देवता मुझसे छीन न सके।']
        ]) },
      { type: 'platform', hero: 'dash', theme: 'ash', len: 5650, music: 'play',
        ground: [[0, 900], [1040, 1900], [2160, 3000], [3200, 4200], [4380, 5650]],
        pits: 'fire',
        plats: [{ x: 1220, y: 330, w: 230, k: 'ledgeRuin' }, { x: 2660, y: 320, w: 210, k: 'ledgeRuin' }, { x: 2930, y: 205, w: 190, k: 'ledgeRuin' },
          { x: 4560, y: 330, w: 230, k: 'ledgeRuin' }, { x: 3560, y: 320, w: 200, k: 'ledgeRuin' }],
        solids: [{ x: 520, w: 92, h: 74, k: 'pillarBroken' }, { x: 2420, w: 100, h: 104, k: 'pillarBroken' }, { x: 3780, w: 92, h: 74, k: 'pillarBroken' }, { x: 5000, w: 92, h: 74, k: 'pillarBroken' }],
        foes: [{ t: 'spirit', x: 1600 }, { t: 'jackal', x: 2700 }, { t: 'spirit', x: 3450 }, { t: 'spirit', x: 4000 }, { t: 'jackal', x: 5150 }],
        items: [{ t: 'standard', x: 1335, y: 330 }, { t: 'standard', x: 3025, y: 205 }, { t: 'standard', x: 4675, y: 330 }],
        checkpoints: [60, 1080, 2200, 3240, 4420],
        decor: [{ k: 'fire', x: 320, s: 0.5 }, { k: 'fire', x: 1750, s: 0.45 }, { k: 'deadtree', x: 2250, s: 0.7, sh: 'scen' }, { k: 'arch', x: 3300, s: 0.75, sh: 'scen' }, { k: 'fire', x: 4300, s: 0.4 }],
        tips: [{ x: 40, t: L('Move: A / D or arrow keys. On a phone, hold the left side and tilt the stick.', 'चलो: A / D या तीर कुंजी। फ़ोन पर बाईं ओर दबाकर छड़ी झुकाओ।') }, { x: 700, t: L('Jump: Space / W  ·  touch JUMP. Hold for height.', 'कूदो: Space / W  ·  स्पर्श JUMP। ऊँचाई के लिए दबाए रखो।') },
          { x: 1350, t: L('Strike: J / K  ·  touch ⚔. Two quick taps = heavy cleave.', 'वार: J / K  ·  स्पर्श ⚔। दो तेज़ टैप = भारी वार।') }, { x: 2000, t: L('Double jump: press jump again in the air.', 'दोहरी छलांग: हवा में फिर से कूदो।') },
          { x: 3300, t: L('Three quick taps with a full meter: blade storm!', 'पूरा मीटर हो तो तीन तेज़ टैप: खड्ग-तूफ़ान!') }],
        goal: { x: 5450, k: 'shrine', line: D([['dash', 'Here the road turns north. Kubera rules golden Lanka; I own nothing but this blade. Then let the mountain make me.', 'यहाँ से मार्ग उत्तर को मुड़ता है। कुबेर स्वर्ण लंका पर राज करता है; मेरे पास इस खड्ग के सिवा कुछ नहीं। तो पर्वत ही मुझे गढ़ेगा।']]) } },
      { type: 'runner', hero: 'dash', theme: 'ash', len: 7800, speed: 390, jumpOnly: true, seed: 11,
        fixed: [{ t: 'rock', x: 1100 }, { t: 'gap', x: 1900, w: 170 }, { t: 'rock', x: 2700 }, { t: 'gap', x: 3500, w: 210 }, { t: 'masonry', x: 4300 }, { t: 'gap', x: 5100, w: 250 }, { t: 'rock', x: 5900 }, { t: 'gap', x: 6600, w: 180 }],
        tips: [{ x: 60, t: L('Break into a run! Jump: tap left side / Space', 'दौड़ पड़ो! कूदो: बाईं ओर टैप / Space') }],
        endText: L('The mountain road', 'पर्वत का मार्ग') }
    ]
  });

  // ---------------------------------------------------------------- 2
  LEVELS.push({
    n: 2, title: L('Little Rama in the Palace', 'महल में बालक राम'), hero: 'rama', theme: 'palace',
    mode: L('Platformer + Story', 'प्लेटफ़ॉर्मर + कथा'), music: { raga: 'bhupali', lead: 'flute' },
    intro: L('Morning in Ayodhya. Run the palace grounds, speak with your mother and father, and reach the bow-yard gate.', 'अयोध्या में सुबह। महल के आँगन में दौड़ो, माता-पिता से बात करो, और धनुर्शाला के द्वार तक पहुँचो।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Find the hidden lotus', 'छिपा हुआ कमल खोजो'), L('No falls, no splashes, no barking dog', 'न गिरना, न छपाक, न भौंकता कुत्ता')],
    star2: { stat: 'lotus', min: 1 }, star3: { stat: 'falls', max: 0 },
    segs: [
      { type: 'platform', hero: 'rama', theme: 'palace', len: 5300, noAttack: true, music: 'calm',
        ground: [[0, 1500], [1500, 1820, 'pool'], [1820, 5300]],
        plats: [{ x: 980, y: 345, w: 200, k: 'ledgePalace' }, { x: 1230, y: 270, w: 190, k: 'ledgePalace' },
          { x: 1960, y: 360, w: 80, k: 'post', seq: 0 }, { x: 2140, y: 320, w: 80, k: 'post', seq: 1 }, { x: 2320, y: 360, w: 80, k: 'post', seq: 2 },
          { x: 3980, y: 330, w: 170, k: 'ledgePalace' }, { x: 4170, y: 220, w: 150, k: 'ledgePalace' }],
        solids: [{ x: 790, w: 130, h: 58, k: 'ledgePalace' }, { x: 2720, y: 318, w: 120, h: 50, k: 'beam' }, { x: 2880, y: 318, w: 120, h: 50, k: 'beam' }],
        carts: [{ x0: 3080, x1: 3540, speed: 150 }],
        dogs: [{ x: 3880 }],
        items: [{ t: 'lotus', x: 4245, y: 220, hidden: true }],
        npcs: [{ id: 'kaushalya', x: 540, face: -1, key: 'mother', lines: D([
          ['kaushalya', 'Rama! You climb the palace walls like a little monkey of the forest.', 'राम! तुम महल की दीवारों पर वन के नन्हे वानर की तरह चढ़ते हो।'],
          ['rama', 'Mother, the peacocks run faster than me. I am only practising.', 'माँ, मोर मुझसे तेज़ दौड़ते हैं। मैं तो बस अभ्यास कर रहा हूँ।'],
          ['kaushalya', 'Practise, then. But be gentle with all that is smaller than you. That is the first strength of a king.', 'तो अभ्यास करो। पर जो तुमसे छोटा है, उसके साथ कोमल रहो। यही राजा का पहला बल है।']]) },
          { id: 'dasharatha', x: 4620, face: -1, key: 'father', lines: D([
          ['dasharatha', 'My son. The bow-yard gate is open for you today.', 'मेरे पुत्र। आज धनुर्शाला का द्वार तुम्हारे लिए खुला है।'],
          ['rama', 'Father, will you watch me?', 'पिताजी, क्या आप मुझे देखेंगे?'],
          ['dasharatha', "Always. A father's eyes follow his son further than any arrow flies.", 'सदा। पिता की आँखें पुत्र का पीछा किसी भी बाण से दूर तक करती हैं।'],
          ['rama', 'Then I will make every arrow true.', 'तो मैं हर बाण को सच्चा बनाऊँगा।']]) }],
        seq: { posts: 3, x0: 1900, x1: 2420 },
        decor: [{ k: 'peacock', x: 260, s: 0.6, sh: 'terr' }, { k: 'pillarPalace', x: 1420, s: 0.75, sh: 'terr' }, { k: 'pot', x: 2560, s: 0.45 }, { k: 'peacock', x: 3700, s: 0.55, sh: 'terr', face: -1 }, { k: 'pot', x: 4480, s: 0.4 }],
        fgPillar: { x: 4245, w: 110 },
        checkpoints: [60, 1860, 2960, 3640, 4450],
        tips: [{ x: 40, t: L('Walk to your mother and tap her (or press Enter) to talk.', 'माँ के पास जाओ और उन्हें टैप करो (या Enter दबाओ)।') },
          { x: 1300, t: L("The pool is shallow, but don't dawdle in it!", 'तालाब उथला है, पर उसमें देर मत करो!') },
          { x: 1880, t: L('Hop across all three dummy posts without touching the ground.', 'तीनों पुतला-खंभों पर बिना ज़मीन छुए कूदो।') },
          { x: 2580, t: L('Low beams: slide with S, swipe down, or push the stick down.', 'नीचे की बल्लियाँ: S, नीचे स्वाइप, या छड़ी को नीचे दबाकर फिसलो।') },
          { x: 3640, t: L('Shh! Pass the guard dog only while it sleeps.', 'श्श! पहरेदार कुत्ते के पास से केवल तब निकलो जब वह सो रहा हो।') }],
        goal: { x: 5050, k: 'gate', need: ['mother', 'father', 'seq'],
          blocked: L('Speak with your mother and father, and clear the dummy posts, first.', 'पहले माता-पिता से बात करो, और पुतला-खंभे पार करो।'),
          line: D([['rama', 'The bow-yard! One day I will be worthy of the great bows that hang here.', 'धनुर्शाला! एक दिन मैं यहाँ टँगे महान धनुषों के योग्य बनूँगा।']]) } }
    ]
  });

  // ---------------------------------------------------------------- 3
  LEVELS.push({
    n: 3, title: L("Sita's Early Training", 'सीता का प्रारंभिक प्रशिक्षण'), hero: 'sita', theme: 'yard',
    mode: L('Platformer + Arena', 'प्लेटफ़ॉर्मर + अखाड़ा'), music: { raga: 'yaman', lead: 'flute' },
    intro: L("Mithila's training yard. Run the target drill, then spar with the Arms-Mistress.", 'मिथिला की अभ्यास-भूमि। लक्ष्य-अभ्यास करो, फिर शस्त्र-गुरु से मुक़ाबला करो।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('8 perfect-timing shots', '8 सटीक-समय वाले बाण'), L('Take no hit in the spar', 'मुक़ाबले में कोई चोट नहीं')],
    star2: { stat: 'perfect', min: 8 }, star3: { stat: 'sparHits', max: 0 },
    segs: [
      { type: 'story', theme: 'yard', cast: [{ id: 'sita', x: 0.34, face: 1, s: 1.35 }, { id: 'teacher', x: 0.64, face: -1, s: 1.35 }],
        lines: D([
          ['narrator', "In Mithila, King Janaka's daughter is at the training yard before the sun is high.", 'मिथिला में, राजा जनक की पुत्री सूरज चढ़ने से पहले ही अभ्यास-भूमि में है।'],
          ['teacher', 'Princess, the posts first. Your feet must know the ground before your arrows can.', 'राजकुमारी, पहले खंभे। बाणों से पहले तुम्हारे पैरों को धरती पहचाननी चाहिए।'],
          ['sita', 'And after the posts?', 'और खंभों के बाद?'],
          ['teacher', "After the posts, you face me. I will not go easy because you are a king's daughter.", 'खंभों के बाद, मेरा सामना करोगी। राजा की बेटी हो, इसलिए मैं नरमी नहीं बरतूँगी।'],
          ['sita', 'Good. Then the victory will truly be mine.', 'अच्छा। तब विजय सचमुच मेरी होगी।']
        ]) },
      { type: 'platform', hero: 'sita', theme: 'yard', len: 4300, music: 'play', needTargets: true,
        ground: [[0, 4300]],
        plats: [{ x: 900, y: 360, w: 120, k: 'plank' }, { x: 1080, y: 290, w: 120, k: 'plank' }, { x: 1260, y: 360, w: 120, k: 'plank' },
          { x: 1950, y: 330, w: 150, k: 'plank', mx: 300, per: 5 }, { x: 3050, y: 330, w: 130, k: 'plank' }],
        solids: [{ x: 2760, w: 130, h: 92, k: 'earthWall' }],
        targets: [{ x: 640, y: 372 }, { x: 1150, y: 170 }, { x: 1700, y: 300, my: 80, per: 3 }, { x: 2560, y: 205 }, { x: 3200, y: 230, my: 60, per: 2.6 },
          { x: 3620, y: 330, mx: 220, per: 4 }],
        decor: [{ k: 'dummy', x: 420, s: 0.5 }, { k: 'banana', x: 1500, s: 0.55, sh: 'scen' }, { k: 'dummy', x: 2300, s: 0.5 }, { k: 'pot', x: 3400, s: 0.4 }],
        checkpoints: [60],
        tips: [{ x: 40, t: L('Shoot: J / K  ·  touch ➶. Two quick taps = charged arrow.', 'बाण: J / K  ·  स्पर्श ➶। दो तेज़ टैप = शक्तिशाली बाण।') },
          { x: 520, t: L('Shoot while a target glows gold for a PERFECT shot.', 'लक्ष्य सुनहरा चमके तब छोड़ो — सटीक बाण!') },
          { x: 950, t: L('High targets: climb the posts, or jump and shoot.', 'ऊँचे लक्ष्य: खंभों पर चढ़ो, या कूदकर बाण चलाओ।') }],
        goal: { x: 4100, k: 'flag', blocked: L('Hit every target first.', 'पहले सारे लक्ष्य भेदो।') } },
      { type: 'arena', hero: 'sita', foe: 'teacher', theme: 'yard', foeHp: 100, music: 'arena',
        tips: [{ t: L('Watch her staff: it glows before she strikes. Block (L / Shift) or jump the low sweep.', 'उसकी लाठी देखो: वार से पहले चमकती है। रोको (L / Shift) या नीचे के वार पर कूदो।') },
          { t: L('After her strike her guard opens — shoot then for a PERFECT hit.', 'उसके वार के बाद उसकी रक्षा खुलती है — तब बाण चलाओ!') }] },
      { type: 'story', theme: 'yard', cast: [{ id: 'sita', x: 0.34, face: 1, s: 1.35 }, { id: 'teacher', x: 0.64, face: -1, s: 1.35, fr: 'bow' }],
        lines: D([
          ['teacher', 'Enough! Well struck, princess. You read my staff before it moved.', 'बस! बहुत अच्छा, राजकुमारी। तुमने मेरी लाठी को हिलने से पहले ही पढ़ लिया।'],
          ['sita', 'You taught me to watch the shoulders, not the weapon.', 'आपने ही सिखाया था — शस्त्र को नहीं, कंधों को देखो।'],
          ['teacher', 'Tomorrow, the range. The wind is a harder teacher than I am.', 'कल, धनुष-क्षेत्र। हवा मुझसे कठोर गुरु है।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 4
  LEVELS.push({
    n: 4, title: L("Ravana's Journey to the Mountain", 'रावण की पर्वत-यात्रा'), hero: 'dash', theme: 'rock',
    mode: L('Runner', 'दौड़'), music: { raga: 'bhairav', lead: 'veena' },
    intro: L('The road to tapas is long. The mountain tests everyone who climbs toward it.', 'तप का मार्ग लंबा है। पर्वत हर उस व्यक्ति की परीक्षा लेता है जो उसकी ओर चढ़ता है।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Smash or clear 14 boulders and beasts', '14 शिलाएँ और पशु तोड़ो या हटाओ'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'smash', min: 14 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'runner', hero: 'dash', theme: 'rock', len: 52000, speed: 400, speedMax: 470, seed: 4, music: 'play',
        phases: [{ until: 11000, set: ['gap', 'rock', 'gap', 'boulder', 'rock'], name: L('The scree slopes', 'पथरीली ढलानें') },
          { until: 25000, set: ['wolf', 'branch', 'gap', 'boulder', 'wolf', 'branch'], name: L('The wild forest', 'जंगली वन') },
          { until: 38000, set: ['ledges', 'fall', 'gap', 'boulder', 'eagle', 'fall'], name: L('The narrow ledges', 'संकरी चट्टानें') },
          { until: 51000, set: ['eagle', 'boulder', 'wolf', 'gap', 'fall', 'branch', 'ledges'], name: L('The last climb', 'अंतिम चढ़ाई') }],
        wind: [[30500, 34500]], cave: 51200,
        tips: [{ x: 60, t: L('Jump: tap LEFT side / Space. Strike: tap RIGHT side / J. Slide: swipe down / S.', 'कूदो: बायाँ भाग / Space। वार: दायाँ भाग / J। फिसलो: नीचे स्वाइप / S।') },
          { x: 3000, t: L('Boulders: jump them, or two quick strikes to smash.', 'शिलाएँ: उन पर कूदो, या दो तेज़ वार से तोड़ो।') },
          { x: 11500, t: L('Low branches: slide!', 'नीची डालियाँ: फिसलो!') }, { x: 26000, t: L('"!" marks a falling rock. Keep moving.', '"!" गिरती चट्टान का संकेत है। चलते रहो।') },
          { x: 30300, t: L('Headwind! Your jumps fall short here.', 'सामने की हवा! यहाँ छलांगें छोटी पड़ेंगी।') }],
        endText: L('The cave of penance', 'तप की गुफा') },
      { type: 'story', theme: 'rock', cast: [{ id: 'dash', x: 0.42, face: 1, s: 1.32 }],
        lines: D([
          ['narrator', 'Many days north, where the trees give up and only stone remains, Dashanan finds the cave.', 'उत्तर की ओर कई दिन चलकर, जहाँ वृक्ष हार मान लेते हैं और केवल पत्थर बचते हैं, दशानन को गुफा मिलती है।'],
          ['dash', "Here. No army, no throne, no mother's voice. Only the mountain and my will.", 'यहीं। न सेना, न सिंहासन, न माँ की आवाज़। केवल पर्वत और मेरा संकल्प।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 5
  LEVELS.push({
    n: 5, title: L("Rama's First Lessons", 'राम के प्रथम पाठ'), hero: 'rama', theme: 'sand',
    mode: L('Platformer + Story', 'प्लेटफ़ॉर्मर + कथा'), music: { raga: 'bhupali', lead: 'flute' },
    intro: L('The lesson court of Sage Vasishtha. Three drills: footwork, a held aim, and a moving target.', 'महर्षि वशिष्ठ की पाठशाला। तीन अभ्यास: पद-संचालन, स्थिर लक्ष्य, और चलता लक्ष्य।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Clear all three drills on the first try', 'तीनों अभ्यास पहले प्रयास में पूरे करो'), L('No wild shots at the bell or the pot', 'घंटी या घड़े पर कोई भटका बाण नहीं')],
    star2: { stat: 'drillRetries', max: 0 }, star3: { stat: 'wild', max: 0 },
    segs: [
      { type: 'story', theme: 'sand', cast: [{ id: 'rama', x: 0.34, face: 1, s: 1.3 }, { id: 'vasishtha', x: 0.64, face: -1, s: 0.98 }],
        lines: D([
          ['narrator', 'In Ayodhya, the young princes come to the lesson court of Sage Vasishtha.', 'अयोध्या में, युवा राजकुमार महर्षि वशिष्ठ की पाठशाला में आते हैं।'],
          ['vasishtha', 'Rama. Before the bow, the stance. Plant your feet as a tree plants its roots.', 'राम। धनुष से पहले, मुद्रा। अपने पैर ऐसे जमाओ जैसे वृक्ष अपनी जड़ें जमाता है।'],
          ['rama', 'And then I may shoot, Gurudev?', 'और फिर मैं बाण चला सकता हूँ, गुरुदेव?'],
          ['vasishtha', 'Then the breath. An arrow leaves on the out-breath, never on the in-breath of anger.', 'फिर श्वास। बाण बाहर जाती साँस पर छूटता है, क्रोध की भीतर खिंचती साँस पर कभी नहीं।'],
          ['rama', 'Why does a prince hold a bow at all, if not in anger?', 'यदि क्रोध में नहीं, तो राजकुमार धनुष क्यों उठाता है?'],
          ['vasishtha', 'To protect those who cannot hold one. Remember that, and the bow will never shame you.', 'उनकी रक्षा के लिए जो उसे उठा नहीं सकते। यह याद रखो, तो धनुष तुम्हें कभी लज्जित नहीं करेगा।']
        ]) },
      { type: 'platform', hero: 'rama', theme: 'sand', len: 2700, drill: 1, timeLimit: 45, noAttack: true, music: 'play',
        drillName: L('Drill 1 · Footwork', 'अभ्यास 1 · पद-संचालन'),
        ground: [[0, 520], [520, 2180, 'sandpit'], [2180, 2700]],
        plats: [{ x: 600, y: 380, w: 90, k: 'post' }, { x: 780, y: 330, w: 90, k: 'post' }, { x: 960, y: 290, w: 90, k: 'post' }, { x: 1160, y: 340, w: 130, k: 'plank', mx: 120, per: 3.2 },
          { x: 1440, y: 300, w: 90, k: 'post' }, { x: 1620, y: 250, w: 90, k: 'post' }, { x: 1800, y: 320, w: 90, k: 'post' }, { x: 1980, y: 370, w: 110, k: 'post' }],
        checkpoints: [60], failOnPit: true,
        tips: [{ x: 40, t: L('Cross the posts before the sand-glass empties. Falling in the pit restarts the drill.', 'रेत-घड़ी खाली होने से पहले खंभे पार करो। गड्ढे में गिरे तो अभ्यास फिर से।') }],
        goal: { x: 2500, k: 'flag' } },
      { type: 'beat', hero: 'rama', theme: 'sand', drill: 2, need: 4, arrows: 7, music: 'calm',
        drillName: L('Drill 2 · The held aim', 'अभ्यास 2 · स्थिर लक्ष्य'),
        tips: [{ t: L('HOLD (Space / hold left side) to draw. RELEASE on the drum beat, when the rings meet.', 'खींचने के लिए दबाए रखो (Space / बायाँ भाग)। ढोल की थाप पर, जब वलय मिलें, छोड़ो।') }] },
      { type: 'platform', hero: 'rama', theme: 'sand', len: 2400, drill: 3, music: 'play', arrows: 10,
        drillName: L('Drill 3 · The moving target', 'अभ्यास 3 · चलता लक्ष्य'),
        ground: [[0, 2400]],
        plats: [{ x: 700, y: 350, w: 130, k: 'plank' }, { x: 1150, y: 300, w: 130, k: 'plank' }, { x: 1600, y: 350, w: 130, k: 'plank' }],
        targets: [{ x: 1250, y: 215, mx: 380, per: 5.5, hp: 3, big: true }],
        wilds: [{ t: 'bell', x: 1450, y: 440 }, { t: 'pot', x: 1700, y: 440 }, { t: 'pot', x: 820, y: 440 }],
        needTargets: true, checkpoints: [60],
        tips: [{ x: 40, t: L('Strike the moving target 3 times. Do NOT hit the bell or the pots!', 'चलते लक्ष्य को 3 बार भेदो। घंटी या घड़ों को मत छूना!') }],
        goal: { x: 2250, k: 'flag', blocked: L('The target still moves. Three true hits!', 'लक्ष्य अभी चल रहा है। तीन सच्चे बाण!') } },
      { type: 'story', theme: 'sand', cast: [{ id: 'rama', x: 0.34, face: 1, s: 1.3 }, { id: 'vasishtha', x: 0.64, face: -1, s: 0.98 }],
        lines: D([
          ['vasishtha', 'Three lessons, and you listened to each. Tomorrow we begin again.', 'तीन पाठ, और तुमने हर एक को सुना। कल हम फिर आरंभ करेंगे।'],
          ['rama', 'Again, Gurudev?', 'फिर से, गुरुदेव?'],
          ['vasishtha', 'A warrior is only a student who never stopped.', 'योद्धा केवल वह शिष्य है जिसने कभी सीखना नहीं छोड़ा।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 6
  var walk = function (len, extra) {
    var s = { type: 'platform', hero: 'sita', theme: 'range', len: len, noAttack: true, music: 'calm', wind: -1, ground: [[0, len]], checkpoints: [60], goal: { x: len - 160, k: 'mark' } };
    for (var k in extra) s[k] = extra[k];
    return s;
  };
  LEVELS.push({
    n: 6, title: L("Sita's Archery Focus", 'सीता की धनुर्विद्या-साधना'), hero: 'sita', theme: 'range',
    mode: L('Focus + Platformer', 'एकाग्रता + प्लेटफ़ॉर्मर'), music: { raga: 'yaman', lead: 'flute' },
    intro: L('The open range at late afternoon. Three marks. Hold your aim through wind, shouts and birds.', 'ढलती दोपहर का खुला धनुष-क्षेत्र। तीन निशान। हवा, शोर और पक्षियों के बीच लक्ष्य साधे रखो।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('8 or more TRUE shots', '8 या अधिक सच्चे बाण'), L('Never break focus', 'एकाग्रता कभी न टूटे')],
    star2: { stat: 'trueShots', min: 8 }, star3: { stat: 'breaks', max: 0 },
    dayTime: 300, focusLives: 4,
    segs: [
      { type: 'story', theme: 'range', cast: [{ id: 'sita', x: 0.34, face: 1, s: 1.35 }, { id: 'teacher', x: 0.64, face: -1, s: 1.35 }],
        lines: D([
          ['narrator', 'Late afternoon on the open range outside Mithila. The wind has come up from the river.', 'मिथिला के बाहर खुले धनुष-क्षेत्र में ढलती दोपहर। नदी की ओर से हवा उठ आई है।'],
          ['teacher', 'Three marks, princess. Hold your aim until the world goes quiet, then loose.', 'तीन निशान, राजकुमारी। तब तक लक्ष्य साधे रहो जब तक संसार शांत न हो जाए, फिर छोड़ो।'],
          ['sita', 'The world is never quiet.', 'संसार कभी शांत नहीं होता।'],
          ['teacher', 'No. But you can be.', 'नहीं। पर तुम हो सकती हो।']
        ]) },
      { type: 'archery', mark: 1, need: 3, arrows: 6, wind: 0.15, gusts: 0, birds: 0, shouts: 0, moving: 0, music: 'calm',
        tips: [{ t: L('HOLD to draw and steady your aim. When the gold ring closes on the target, TAP (J / right side) to loose.', 'खींचने और लक्ष्य स्थिर करने के लिए दबाए रखो। जब सुनहरा वलय लक्ष्य पर सिमटे, टैप करो (J / दायाँ भाग)।') }] },
      walk(1500, { plats: [{ x: 600, y: 360, w: 140, k: 'plank' }, { x: 860, y: 320, w: 140, k: 'plank' }], tips: [{ x: 40, t: L('Walk to the second mark.', 'दूसरे निशान तक चलो।') }] }),
      { type: 'archery', mark: 2, need: 4, arrows: 7, wind: 0.6, gusts: 1, birds: 1, shouts: 1, moving: 0, music: 'calm',
        tips: [{ t: L('Gusts shove your aim: keep holding and let it settle. Ignore the shouts. Never loose through a bird.', 'झोंके लक्ष्य हिलाते हैं: दबाए रखो और स्थिर होने दो। शोर अनसुना करो। पक्षी के बीच से कभी मत छोड़ो।') }] },
      walk(1700, { plats: [{ x: 560, y: 350, w: 130, k: 'plank', mx: 140, per: 3.4 }, { x: 980, y: 300, w: 130, k: 'plank' }], solids: [{ x: 1250, w: 120, h: 80, k: 'earthWall' }], tips: [{ x: 40, t: L('The last mark is beyond the wall.', 'अंतिम निशान दीवार के पार है।') }] }),
      { type: 'archery', mark: 3, need: 5, arrows: 8, wind: 0.45, gusts: 1, birds: 1.4, shouts: 1.2, moving: 1, music: 'calm',
        tips: [{ t: L('The last target moves. Breathe. Lead it.', 'अंतिम लक्ष्य चलता है। साँस लो। उसके आगे साधो।') }] },
      { type: 'story', theme: 'range', cast: [{ id: 'sita', x: 0.34, face: 1, s: 1.35, fr: 'focus' }, { id: 'teacher', x: 0.64, face: -1, s: 1.35, fr: 'bow' }],
        lines: D([
          ['sita', 'The wind did not stop. I simply stopped listening to it.', 'हवा नहीं रुकी। मैंने बस उसे सुनना छोड़ दिया।'],
          ['teacher', 'That is the whole lesson. I have nothing more to give you today.', 'यही पूरा पाठ है। आज मेरे पास तुम्हें देने को और कुछ नहीं।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 7
  LEVELS.push({
    n: 7, title: L('Ravana Begins Penance', 'रावण की तपस्या का आरंभ'), hero: 'ascetic', theme: 'peak',
    mode: L('Stay-Put / Focus', 'स्थिर / एकाग्रता'), music: { raga: 'malkauns', lead: 'veena' },
    intro: L('A ledge above the clouds. Hold the meditation. Do not move, whatever the mountain sends.', 'बादलों के ऊपर एक चट्टान। ध्यान बनाए रखो। पर्वत जो भी भेजे, हिलना मत।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('Keep steadiness above 35%', 'स्थिरता 35% से ऊपर रखो'), L('A perfect hold: never break', 'संपूर्ण ध्यान: कभी न टूटे')],
    star2: { stat: 'minSteady', min: 35 }, star3: { stat: 'breaks', max: 0 },
    segs: [
      { type: 'story', theme: 'peak', cast: [{ id: 'ascetic', x: 0.45, face: 1, s: 1.15 }],
        lines: D([
          ['narrator', 'On a ledge above the clouds, Dashanan sets down his blade. He will not lift it again until the gods answer.', 'बादलों के ऊपर एक चट्टान पर, दशानन अपना खड्ग रख देता है। जब तक देवता उत्तर न दें, वह उसे फिर नहीं उठाएगा।'],
          ['ascetic', 'Let the cold come. Let hunger come. I will not move.', 'ठंड आए। भूख आए। मैं नहीं हिलूँगा।']
        ]) },
      { type: 'meditate', duration: 120, music: 'penance',
        tips: [{ t: L('HOLD (Space / hold left side) to stay in meditation. When a ring closes on a distraction, TAP it (J / right side).', 'ध्यान में रहने के लिए दबाए रखो (Space / बायाँ भाग)। जब वलय किसी विघ्न पर सिमटे, उसे टैप करो (J / दायाँ भाग)।') }] },
      { type: 'story', theme: 'peak', dim: true, cast: [{ id: 'ascetic', x: 0.45, face: 1, s: 1.15 }],
        lines: D([
          ['narrator', 'The night passes. The fire burns low. No god descends.', 'रात बीत जाती है। अग्नि मंद पड़ जाती है। कोई देवता नहीं उतरता।'],
          ['ascetic', 'Not yet. Then I will sit longer than the mountain itself.', 'अभी नहीं। तो मैं पर्वत से भी अधिक समय तक बैठूँगा।']
        ]) }
    ]
  });

  // ---------------------------------------------------------------- 8
  LEVELS.push({
    n: 8, title: L('Young Rama and Lakshmana Together', 'युवा राम और लक्ष्मण साथ-साथ'), hero: 'rama', theme: 'field',
    mode: L('Platformer (two brothers)', 'प्लेटफ़ॉर्मर (दो भाई)'), music: { raga: 'bhupali', lead: 'flute' },
    intro: L("The practice field at the city's edge. Rama's bow, Lakshmana's sword. Clear the course together.", 'नगर के किनारे का अभ्यास-मैदान। राम का धनुष, लक्ष्मण की तलवार। साथ मिलकर मार्ग पार करो।'),
    stars: [L('Finish the level', 'स्तर पूरा करो'), L('6 "together" hits (both brothers strike one target)', '6 "साथ" वार (दोनों भाई एक लक्ष्य पर)'), L('Take one hit or fewer', 'एक या कम चोट खाओ')],
    star2: { stat: 'together', min: 6 }, star3: { stat: 'hits', max: 1 },
    segs: [
      { type: 'platform', hero: 'rama', partner: 'lak', theme: 'field', len: 6400, music: 'play', needTargets: true,
        ground: [[0, 6400]],
        plats: [{ x: 1180, y: 330, w: 220, k: 'ledgeRock' }, { x: 2360, y: 320, w: 200, k: 'plank' }, { x: 3480, y: 300, w: 220, k: 'ledgeRock' }, { x: 4400, y: 330, w: 200, k: 'plank' }],
        solids: [{ x: 1900, w: 140, h: 96, k: 'earthWall' }, { x: 3000, w: 150, h: 175, k: 'earthWall', boost: true }],
        targets: [{ x: 620, y: 420, dummy: true, hp: 3 }, { x: 980, y: 420, dummy: true, hp: 3 }, { x: 1300, y: 205 }, { x: 1650, y: 420, dummy: true, hp: 3 },
          { x: 2460, y: 190 }, { x: 2700, y: 420, dummy: true, hp: 3 }, { x: 3580, y: 160 }, { x: 3900, y: 420, dummy: true, hp: 3 }, { x: 4500, y: 200, my: 50, per: 3 }, { x: 4800, y: 420, dummy: true, hp: 3 }],
        swings: [{ x: 2200, y: 250, len: 150 }, { x: 4200, y: 250, len: 150 }],
        boar: { x0: 5250, x1: 6000, hp: 14 },
        checkpoints: [60, 1500, 2300, 3200, 4300, 5100],
        decor: [{ k: 'banyan', x: 300, s: 0.6, sh: 'scen' }, { k: 'reeds', x: 1500, s: 0.45, sh: 'scen' }, { k: 'ashoka', x: 2900, s: 0.55, sh: 'scen' }, { k: 'reeds', x: 4100, s: 0.45, sh: 'scen' }],
        tips: [{ x: 40, t: L('Switch brother: Q / Tab  ·  touch ⇄. Rama shoots, Lakshmana strikes.', 'भाई बदलो: Q / Tab  ·  स्पर्श ⇄। राम बाण चलाते हैं, लक्ष्मण वार करते हैं।') },
          { x: 540, t: L('Both brothers hitting one target in a breath = TOGETHER!', 'दोनों भाई एक साथ एक लक्ष्य पर वार करें = साथ!') },
          { x: 2050, t: L('Mind the swinging sandbags.', 'झूलते रेत-बोरों से बचो।') },
          { x: 2860, t: L('A high wall: one brother climbs, then pulls the other up.', 'ऊँची दीवार: एक भाई चढ़ता है, फिर दूसरे को ऊपर खींचता है।') },
          { x: 5000, t: L('The straw boar! It charges along its rail.', 'घास का सूअर! यह अपनी पटरी पर दौड़ता है।') }],
        goal: { x: 6200, k: 'flag', blocked: L('Clear every target and the boar first.', 'पहले सारे लक्ष्य और सूअर को हराओ।') } },
      { type: 'story', theme: 'field', cast: [{ id: 'rama', x: 0.38, face: 1, s: 1.3 }, { id: 'lak', x: 0.62, face: -1, s: 1.38, fr: 'cheer' }],
        lines: D([
          ['lak', 'Brother! Did you see? The boar is beaten!', 'भैया! देखा आपने? सूअर हार गया!'],
          ['rama', 'We beat it together. Neither of us alone.', 'हमने उसे साथ मिलकर हराया। हम में से कोई अकेले नहीं।'],
          ['lak', 'Then wherever you go, I go. That is a promise.', 'तो आप जहाँ जाएँगे, मैं भी वहीं जाऊँगा। यह वचन है।'],
          ['rama', 'I will hold you to it, Lakshmana.', 'मैं इस वचन को याद रखूँगा, लक्ष्मण।'],
          ['narrator', 'Childhood ends here. The road ahead leads to a sage named Vishvamitra.', 'बचपन यहीं समाप्त होता है। आगे का मार्ग विश्वामित्र नामक ऋषि की ओर जाता है।']
        ]) }
    ]
  });

  window.RPD_LEVELS = LEVELS;
  window.RPD_CAST = CAST;
  window.RPD_GY = GY;
})();
