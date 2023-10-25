export const input = {
  type: 'object',
  title: '呵呵',
  properties: {
    'Unicode property ÄÖÉÜß 𐌼𐌰𐌲': {
      type: 'number',
      title: 'میں نے گوگل ٹرانسلیٹ استعمال کیا۔',
    },
    chinese: {
      type: 'string',
      title: '哈哈'
    },
    'this is \'I can eat glass in Gothic\' apparently': {
      type: 'string', 
      title: '𐌼𐌰𐌲 𐌲𐌻𐌴𐍃 𐌹̈𐍄𐌰𐌽, 𐌽𐌹 𐌼𐌹𐍃 𐍅𐌿 𐌽𐌳𐌰𐌽 𐌱𐍂𐌹𐌲𐌲𐌹𐌸.'
    },
    spanish: {
      type: 'boolean',
      title: 'Utilicé el traductor de'
    },
    myanmar: {
      type: 'string',
      title: 'ကျွန်တော် translate သုံးပါတယ်။'
    },
    korean: {
      type: 'string',
      title: '나는 구글 번역을 사용했다'
    },
    japanese: {
      type: 'string',
      title: '私は翻訳を使用しました'
    },
    hebrew: {
      type: 'string',
      title: 'השתמשתי בגוגל תרגום'
    },
    greek: {
      type: 'string',
      title: 'Χρησιμοποίησα το Translate'
    },
    armenian: {
      type: 'string',
      title: 'Ես օգտագործել եմ translate-ը'
    },
    arabic: {
      type: 'string',
      title: 'لقد استخدمت مترجم جوجل'
    },
    thai: {
      type: 'string',
      title: 'ผมใช้ แปล'
    },
    'Russian/Cyrillic': {
      type: 'string',
      title: 'Я использовал Translate.com'
    },
    bengali: {
      type: 'string',
      title: 'আমি Translate.com ব্যবহার করেছি'
    },
    malayalam: {
      type: 'string',
      title: 'ഞാൻ ഗൂഗിൾ വിവർത്തനം ഉപയോഗിച്ചു'
    },
    georgian: {
      type: 'string',
      // This string is especially tricky because identifierfy removes the entire string if passed to toSafeString twice
      title: 'Მე გამოვიყენე გუგლის თარგმანი'
    },
    tibetian: {
      type: 'string',
      title: 'ངས་སྔོན་ཆད་'
    },
    lao: {
      type: 'string',
      title: 'ຂ້ອຍໃຊ້ ແປພາສາ'
    },
    kmer: {
      type: 'string',
      title: 'ខ្ញុំបានប្រើ បកប្រែ'
    },
    mongolian: {
      type: 'string',
      title: 'Би Translate ашигласан'
    },
    hindi: {
      type: 'string',
      title: 'मैंने गूगल अनुवाद का इस्तेमाल किया'
    },
    tamil: {
      type: 'string',
      title: 'நான் கூகல் மொழிப்பெயர்ப்பை பயன்படுத்தினேன்'
    },
    telugu: {
      type: 'string',
      title: 'నేను అనువాదం ఉపయోగించాను'
    },     
    urdu: {
      type: 'string',
      title: 'میں نے گوگل ٹرانسلیٹ استعمال کیا۔',
    },
    '✔✔✔': {
      type: 'integer',
      title: '𝄇𝄇𝄇'
    },
    refAndExtends: {
      $ref: 'test/resources/UnicodeSchemaΔЙק๗あ叶葉.json',
    },
    unicodeEnums: {
      enum: ['کیا', 'ე გამოვიყენე', '🇦🇶 doesn\'t'],
      tsEnumNames: ['გუგლის', 'ყე', '🇦🇶antartica'],
      title: 'ე გამოვიყენე',
    },
    '🇦🇶 starts with and contains emoji': {
      type: 'string',
      title: '🇦🇶 doesn\'t have 𝄰 𝄱 𝄲 𝄳 𝄴 𝄵 or 🀀 🀁 🀂 🀃 🀄 or 🏴󠁧󠁢󠁷󠁬󠁳󠁿'
    },
  }
}
