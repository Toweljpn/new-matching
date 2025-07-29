document.addEventListener('DOMContentLoaded', () => {

    // --- HTMLから操作する要素を取得 ---
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const questionTitle = document.getElementById('question-title');
    const optionsContainer = document.getElementById('options-container');
    const resultStyleTitle = document.getElementById('result-style-title');
    const resultMessage = document.getElementById('result-message');
    const recommendedCategoriesContainer = document.getElementById('recommended-categories-container');
    const designerMessage = document.getElementById('designer-message');
    const restartBtn = document.getElementById('restart-btn');

    // --- アプリケーションの状態管理 ---
    let currentQuestionIndex = 0; // 現在の質問番号
    let userAnswers = {}; // ユーザーの回答を保存するオブジェクト

    // --- データ定義セクション ---
    // 質問の内容
    const questions = [
        {
            id: 'q1',
            title: 'Q1: お祝いの節句は？',
            options: [
                { text: '桃の節句（ひな人形）', value: 'hina' },
                { text: '端午の節句（五月人形）', value: 'gogatsu' }
            ]
        },
        {
            id: 'q2',
            title: 'Q2: 主にどちらにお飾りになるイメージですか？',
            options: [
                { text: 'リビングのサイドボードや棚の上など', value: 'compact' },
                { text: '床の間や、リビング・和室の床の上', value: 'standard' },
                { text: '飾る場所も収納場所も、できるだけコンパクトにしたい', value: 'space_saving' }
            ]
        },
        {
            id: 'q3',
            title: 'Q3: どのような雰囲気のデザインが好みですか？',
            options: [
                { text: '時代を超えて受け継がれる、気品あふれる伝統美', value: 'natural_elegant' },
                { text: '現代のインテリアに調和する、洗練されたおしゃれなデザイン', value: 'modern_stylish' },
                { text: 'わが子のように愛らしく、見るたびに心が和む雰囲気', value: 'playful_cheerful' }
            ]
        },
        {
            id: 'q4',
            title: 'Q4: お人形選びで、特に大切にしたい想いはどれですか？',
            options: [
                { text: '歴史や格式のある、確かなものを贈りたい', value: 'function' },
                { text: '自分たちが心から「素敵」と思える、デザイン性を重視したい', value: 'design' },
                { text: '家族みんなで相談しながら、納得できるものを選びたい', value: 'balance' }
            ]
        },
        {
            id: 'q5',
            title: 'Q5 (任意): ご予算の規模感を教えてください。',
            options: [
                { text: '10万円未満', value: 'under_10' },
                { text: '10万円～20万円未満', value: '10_to_20' },
                { text: '20万円以上', value: 'over_20' },
                { text: '特に決めていない', value: 'not_decided' }
            ]
        }
    ];

    // 全54パターンの診断結果データ
    const resultsData = {
        // --- 編集箇所：ここから下の診断結果テキストを編集してください ---

        // デフォルト（万が一、該当する結果がなかった場合の表示）
        'default': {
            style: 'カスタムミックス・スタイル',
            message: 'あなたの独自のセンスが光る、特別なミックススタイル。様々な要素を組み合わせて、あなただけの理想のお人形セットを創造しましょう。',
            categories: [
                { name: '照明', img: 'https://placehold.co/280x280/cccccc/FFFFFF?text=Lighting' },
                { name: 'ラグ', img: 'https://placehold.co/280x280/cccccc/FFFFFF?text=Rug' }
            ],
            advice: 'あなたの直感を信じて、楽しんで選んでみてください。それが最高のお人形セットです。'
        },

        // --- hina  を選んだ場合のパターン (27通り) ---
        // hina_compact_natural_elegant
        // 1
        'hina_compact_natural_elegant_function': {
            style: 'リビングに映える本格派、匠の技が光る伝統美のおひなさま ',
            message: 'コンパクトさを求めつつも、作家の技術や伝統的な格式を重視する、本物志向のお客様のニーズを的確に捉えたスタイルです。',
            categories: [{ name: '匠の技（ひな）', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Storage' }, { name: '本物志向（ひな）', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Chair' }],
            advice: '名匠の作には、木製の道具を合わせるとより格調高くなります。 '
        },
        // 2
        'hina_compact_natural_elegant_design': {
            style: '空間を彩る伝統の意匠、コンパクトに楽しむ本格おひなさま ',
            message: 'コンパクトなサイズ感と伝統的なデザイン性の両方を大切にしたいお客様向け。節句という伝統行事を現代の暮らしに取り入れたい想いを反映しています。 ',
            categories: [{ name: 'リビング収納 (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Storage' }, { name: 'コンパクト収納 (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Chair' }],
            advice: ' 屏風のデザインを少しモダンなものに変えると、印象が変わり新鮮です。'
        },
        // 3
        'hina_compact_natural_elegant_balance': {
            style: '家族で紡ぐ日本の美、コンパクトにまとまる伝統スタイル雛',
            message: '伝統的な美しさを大切にしながら、家族みんなで納得して選びたいという想いに応えるスタイル。コンパクトさも兼ね備え、バランスが良い選択です。 ',
            categories: [{ name: '家族で納得 （ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Storage' }, { name: '伝統美 (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Chair' }],
            advice: 'お子様と一緒に飾れる、扱いやすいお道具を追加しませんか？ '
        },

        // hina_compact_modern_stylish
        // 4
        'hina_compact_modern_stylish_function': {
            style: '小さくても本物志向、名匠が織りなすモダン＆スタイリッシュ雛',
            message: 'モダンなデザインを好みつつも、品質や作家性には妥協したくないという、高い美意識を持つお客様に最適なスタイルです。 ',
            categories: [{ name: 'モダン (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Shelf' }, { name: 'スタイリッシュ (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Desk' }],
            advice: '飾り台を明るい色にすると、よりモダンな印象になります。'
        },
        // 5
        'hina_compact_modern_stylish_design': {
            style: ' あなたのセンスで選ぶ、インテリアに溶け込むモダンコンパクト雛',
            message: 'コンパクトさと現代的なデザイン性を最優先するお客様の価値観を反映。節句人形をインテリアの一部として捉える、新しい楽しみ方を提案します。 ',
            categories: [{ name: 'シェルフ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Shelf' }, { name: 'デスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Desk' }],
            advice: '飾り台を木目調や白木のものに変えると、さらに統一感が出ます。 '
        },
        // 6
        'hina_compact_modern_stylish_balance': {
            style: '家族の「好き」を形に、暮らしに馴染むおしゃれなコンパクト雛',
            message: '家族それぞれの「おしゃれ」という感覚を大切にし、現代の住空間に調和するデザインを求めるお客様にぴったりのスタイルです。 ',
            categories: [{ name: 'シェルフ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Shelf' }, { name: 'デスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Desk' }],
            advice: 'お人形の衣裳の色味に合わせて、お花飾りを選ぶと素敵ですよ。 '
        },

        // hina_compact_playful_cheerful
        // 7
        'hina_compact_playful_cheerful_function': {
            style: ' 愛らしさの中に宿る確かな技、名匠が手がける優しいお顔のおひなさま ',
            message: 'お人形の可愛らしさを求めつつも、作家物ならではの品質と格式を重視するお客様のニーズに応えます。贈る側のこだわりも表現できるスタイルです。 ',
            categories: [{ name: '可愛らしさ (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Box' }, { name: '格式と品質 (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Stool' }],
            advice: '優しいお顔立ちには、春らしい色合いの「つるし飾り」が似合います。 '
        },
        // 8
        'hina_compact_playful_cheerful_design': {
            style: '見るたびに心和む、わが子に似合う「かわいい」を選ぶコンパクト雛 ',
            message: 'お子様の面影を重ねられるような、親しみやすく可愛らしいデザインを最優先するお客様の想いを形にしたスタイルです。 ',
            categories: [{ name: '収納ボックス (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Box' }, { name: 'スツール (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Stool' }],
            advice: 'お子様のお名前を入れた「名前旗」を隣に飾ると特別感が増します。 '
        },
        // 9
        'hina_compact_playful_cheerful_balance': {
            style: '家族みんなが笑顔になる、愛らしくて飾りやすいおひなさま ',
            message: '家族全員が「かわいい」と共感でき、かつコンパクトで飾りやすいという、現代の家族のニーズに最も寄り添ったバランスの良いスタイルです。 ',
            categories: [{ name: 'コンパクト (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Box' }, { name: '現代的 (ひな)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Stool' }],
            advice: 'ぼんぼりをコードレスタイプにすると、飾る場所の自由度が上がります。 '
        },

        // hina_standard_natural_elegant
        // 10
        'hina_standard_natural_elegant_function': {
            style: '受け継がれる家の誇り、名匠の技で仕立てる本格・伝統雛飾り ',
            message: '格式と作家性を最も重視し、床の間に飾るような本格的なお祝いを望むお客様に。一生もの、そして家宝として受け継ぐ価値を提案します。 ',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '伝統的な金屏風を選ぶと、お人形の衣裳の美しさが一層際立ちます。 '
        },
        // 11
        'hina_standard_natural_elegant_design': {
            style: '凛とした佇まいを美しく、晴れの日にふさわしい正統派のおひなさま ',
            message: '伝統的なデザインの美しさを純粋に楽しみたいお客様向け。流行に左右されない、日本の節句文化の王道を行くスタイルです。 ',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '緋毛氈（ひもうせん）を敷くと、より本格的で華やかな印象になります。 '
        },
        // 12
        'hina_standard_natural_elegant_balance': {
            style: '家族の想いを一つに、時代を超える日本の美を伝えるおひなさま ',
            message: '家族での調和を大切にしながら、本格的で伝統的なお祝いをしたいという想いを反映。世代を超えて愛される普遍的な美しさを提案します。 ',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: 'お道具を一つずつ増やしていく楽しみ方もご提案できます。 '
        },

        // hina_standard_modern_stylish
        // 13
        'hina_standard_modern_stylish_function': {
            style: '伝統と革新の融合、匠の感性が光るモダンで優美なおひなさま',
            message: '本格的なサイズ感の中に、現代的なデザイン要素を求めるお客様向け。作家の新しい挑戦や感性を楽しむ、通好みのスタイルです。 ',
            categories: [{ name: 'テレビボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+TV' }, { name: 'サイドボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sideboard' }],
            advice: '飾り台の色を抑えめにすると、モダンな衣裳のデザインが引き立ちます。 '
        },
        // 14
        'hina_standard_modern_stylish_design': {
            style: '和室にも洋室にも映える、洗練されたデザインをまとう優雅なおひなさま ',
            message: '設置スペースは確保しつつも、現代的なインテリアとの調和を最優先するお客様のニーズに応える、デザインコンシャスなスタイルです。 ',
            categories: [{ name: 'テレビボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+TV' }, { name: 'サイドボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sideboard' }],
            advice: '照明を工夫すると、アートオブジェのようにお飾りいただけます。 '
        },
        // 15
        'hina_standard_modern_stylish_balance': {
            style: '家族で選ぶ新しい伝統の形、晴れやかでモダンな雛飾り ',
            message: '家族みんなの意見を取り入れながら、伝統にとらわれない新しいお祝いの形を模索する、現代的な家族像を反映したスタイルです。 ',
            categories: [{ name: 'テレビボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+TV' }, { name: 'サイドボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sideboard' }],
            advice: '屏風のデザインを家族で選ぶのも「フリープラン」の醍醐味です。 '
        },

        // hina_standard_playful_cheerful
        // 16
        'hina_standard_playful_cheerful_function': {
            style: '愛らしさの中に宿る本物の気品、名匠が手がける優しいお顔立ちのおひなさま ',
            message: '可愛らしいお顔立ちを好みながらも、作家物ならではの品質と本格的な飾り栄えを両立させたいという、こだわりのあるお客様に最適です。 ',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '優しいお顔には、桜橘だけでなく、現代的なお花飾りも似合います。 '
        },
        // 17
        'hina_standard_playful_cheerful_design': {
            style: 'お子様の笑顔を引き出す、晴れやかで優しい雰囲気のおひなさま',
            message: 'お人形の「かわいい」表情や雰囲気を何よりも大切にしたいという、お子様への愛情が伝わるピュアな想いを反映したスタイルです。',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: 'お子様が好きな動物などをモチーフにした「つるし飾り」もおすすめです。 '
        },
        // 18
        'hina_standard_playful_cheerful_balance': {
            style: '家族の愛情を映す、優しく穏やかな表情の本格雛飾り ',
            message: '家族全員が「かわいい」と心から思えることを大切にしつつ、本格的な飾りで盛大にお祝いしたいという想いを形にしたスタイルです。 ',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: 'お子様と一緒に飾り付けができる、安全で軽いお道具もございます。 '
        },

        // hina_space_saving_natural_elegant
        // 19
        'hina_space_saving_natural_elegant_function': {
            style: '伝統美と機能性を両立、匠の技が詰まった本格収納雛飾り',
            message: '格式高い作家物を求めつつも、収納の利便性は譲れないという、非常に賢明で現代的なニーズに応える、最も合理的な本格派スタイルです。',
            categories: [{ name: '折りたたみデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+FoldDesk' }, { name: '壁面収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+WallStorage' }],
            advice: '伝統的なお道具も全て収まるか、事前にサイズ確認をしましょう。'
        },
        // 20
        'hina_space_saving_natural_elegant_design': {
            style: '美しく飾り、賢くしまう、デザイン性に優れた伝統収納雛 ',
            message: '伝統的なデザインの美しさを楽しみながら、収納の手間は省きたいというお客様のニーズを的確に捉えた、スマートな選択です。 ',
            categories: [{ name: '折りたたみデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+FoldDesk' }, { name: '壁面収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+WallStorage' }],
            advice: '伝統的ながらもコンパクトなお道具を選ぶのがおすすめです。 '
        },
        // 21
        'hina_space_saving_natural_elegant_balance': {
            style: '家族みんなに優しい、伝統美あふれるオールインワン雛飾り',
            message: '伝統的な美しさを求めつつ、収納の手間を軽減したいという実用的なニーズと、家族での調和を大切にする想いを汲み取ったスタイルです。 ',
            categories: [{ name: '折りたたみデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+FoldDesk' }, { name: '壁面収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+WallStorage' }],
            advice: '飾り方の説明書を見ながら、家族で一緒に飾り付けを楽しんで。 '
        },

        // hina_space_saving_modern_stylish
        // 22
        'hina_space_saving_modern_stylish_function': {
            style: '現代の名匠が作る、デザインと機能性を極めたモダン収納雛',
            message: 'モダンなデザインと作家物の品質、そして収納の利便性という、現代のニーズをすべて満たしたいと考える、最も要求レベルの高いお客様向けのスタイル。 ',
            categories: [{ name: 'スリムデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+SlimDesk' }, { name: 'スタッキングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+StackChair' }],
            advice: '飾り台の色とお部屋の家具の色を合わせると、統一感が出ます。 '
        },
        // 23
        'hina_space_saving_modern_stylish_design': {
            style: '飾る姿も、しまう姿も美しい、暮らしにフィットするおしゃれな収納雛',
            message: 'デザイン性と収納のしやすさを最優先するお客様に。節句の準備から後片付けまで、すべてのプロセスをスマートに楽しみたいという想いを反映します。 ',
            categories: [{ name: 'スリムデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+SlimDesk' }, { name: 'スタッキングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+StackChair' }],
            advice: '屏風のデザインにこだわると、よりインテリア性が高まります。 '
        },
        // 24
        'hina_space_saving_modern_stylish_balance': {
            style: '家族の「あったらいいな」を形に、スマートでおしゃれな収納雛飾り',
            message: '家族みんなが「おしゃれで、しかも片付けが楽」と納得できる、最もバランスの取れた現代的な選択。デザインと実用性の両方を満たします。 ',
            categories: [{ name: 'スリムデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+SlimDesk' }, { name: 'スタッキングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+StackChair' }],
            advice: 'お子様が自分でしまえるような、軽いお道具を選ぶのも良いですね。'
        },

        // hina_space_saving_playful_cheerful
        // 25
        'hina_space_saving_playful_cheerful_function': {
            style: '確かな品質と愛らしさをひとつに、名匠が作るかわいい収納雛',
            message: '可愛らしいお顔のお人形を、確かな品質の作家物で、かつ収納しやすい形で揃えたいという、愛情と賢さを兼ね備えたお客様に最適なスタイルです。',
            categories: [{ name: '収納付きベッド (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Bed' }, { name: 'カラフルな小物 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Colorful' }],
            advice: 'お人形の衣裳に合わせた布を収納箱の中に敷くと、より丁寧です。 '
        },
        // 26
        'hina_space_saving_playful_cheerful_design': {
            style: '「かわいい」と「便利」を両立、お片付けも楽しくなる収納雛 ',
            message: 'お人形の可愛らしさと、収納の利便性を何よりも重視するお客様のニーズに特化。お子様と一緒に節句の準備と片付けを楽しみたい方に。 ',
            categories: [{ name: '収納付きベッド (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Bed' }, { name: 'カラフルな小物 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Colorful' }],
            advice: '飾り付けの場所を示すシールを箱に貼っておくと、翌年迷いません。 '
        },
        // 27
        'hina_space_saving_playful_cheerful_balance': {
            style: '家族みんなが納得、愛らしくて片付けも簡単なオールインワン雛 ',
            message: '家族全員が「かわいい」と共感でき、かつ収納も簡単という、最も手軽で現代のライフスタイルに合った、みんなが笑顔になるスタイルです。 ',
            categories: [{ name: '収納付きベッド (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Bed' }, { name: 'カラフルな小物 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Colorful' }],
            advice: '毎年出すのが楽しみになるよう、家族の思い出の品を一緒に飾っては？ '
        },

        // --- gogatsu (鉄の家具) を選んだ場合のパターン (27通り) ---
        // gogatsu_compact_natural_elegant
        // 28
        'gogatsu_compact_natural_elegant_function': {
            style: 'アイアンの質感が映える、コンパクトでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したコンパクトな空間。機能性を重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンラック (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Rack' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 29
        'gogatsu_compact_natural_elegant_design': {
            style: 'アイアンの質感が映える、コンパクトでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したコンパクトな空間。デザイン性を重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンラック (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Rack' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 30
        'gogatsu_compact_natural_elegant_balance': {
            style: 'アイアンの質感が映える、コンパクトでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したコンパクトな空間。価格と機能のバランスを重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンラック (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Rack' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_compact_modern_stylish
        // 31
        'gogatsu_compact_modern_stylish_function': {
            style: 'アイアンの質感が映える、コンパクトでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、機能性を重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンデスク (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Desk' }, { name: 'ミニマルチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+MiniChair' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 32
        'gogatsu_compact_modern_stylish_design': {
            style: 'アイアンの質感が映える、コンパクトでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、デザイン性を重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンデスク (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Desk' }, { name: 'ミニマルチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+MiniChair' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 33
        'gogatsu_compact_modern_stylish_balance': {
            style: 'アイアンの質感が映える、コンパクトでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、価格と機能のバランスを重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンデスク (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Desk' }, { name: 'ミニマルチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+MiniChair' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_compact_playful_cheerful
        // 34
        'gogatsu_compact_playful_cheerful_function': {
            style: 'アイアンの質感が映える、コンパクトで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したコンパクトな空間。機能性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルな収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorStorage' }, { name: 'デザインスツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignStool' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 35
        'gogatsu_compact_playful_cheerful_design': {
            style: 'アイアンの質感が映える、コンパクトで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したコンパクトな空間。デザイン性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルな収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorStorage' }, { name: 'デザインスツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignStool' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 36
        'gogatsu_compact_playful_cheerful_balance': {
            style: 'アイアンの質感が映える、コンパクトで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したコンパクトな空間。価格と機能のバランスを重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルな収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorStorage' }, { name: 'デザインスツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignStool' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_standard_natural_elegant
        // 37
        'gogatsu_standard_natural_elegant_function': {
            style: 'アイアンの質感が映える、スタンダードでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したスタンダードな空間。機能性を重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンダイニング (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Dining' }, { name: 'ファブリックソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Sofa' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 38
        'gogatsu_standard_natural_elegant_design': {
            style: 'アイアンの質感が映える、スタンダードでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したスタンダードな空間。デザイン性を重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンダイニング (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Dining' }, { name: 'ファブリックソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Sofa' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 39
        'gogatsu_standard_natural_elegant_balance': {
            style: 'アイアンの質感が映える、スタンダードでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したスタンダードな空間。価格と機能のバランスを重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンダイニング (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Dining' }, { name: 'ファブリックソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Sofa' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_standard_modern_stylish
        // 40
        'gogatsu_standard_modern_stylish_function': {
            style: 'アイアンの質感が映える、スタンダードでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。スタンダードな空間に機能性を重視し、洗練された都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンテレビボード (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+TV' }, { name: 'ローテーブル (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+LowTable' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 41
        'gogatsu_standard_modern_stylish_design': {
            style: 'アイアンの質感が映える、スタンダードでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。スタンダードな空間にデザイン性を重視し、洗練された都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンテレビボード (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+TV' }, { name: 'ローテーブル (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+LowTable' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 42
        'gogatsu_standard_modern_stylish_balance': {
            style: 'アイアンの質感が映える、スタンダードでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。スタンダードな空間に価格と機能のバランスを重視し、洗練された都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンテレビボード (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+TV' }, { name: 'ローテーブル (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+LowTable' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_standard_playful_cheerful
        // 43
        'gogatsu_standard_playful_cheerful_function': {
            style: 'アイアンの質感が映える、スタンダードで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したスタンダードな空間。機能性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルなチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorChair' }, { name: 'デザイン照明 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignLight' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 44
        'gogatsu_standard_playful_cheerful_design': {
            style: 'アイアンの質感が映える、スタンダードで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したスタンダードな空間。デザイン性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルなチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorChair' }, { name: 'デザイン照明 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignLight' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 45
        'gogatsu_standard_playful_cheerful_balance': {
            style: 'アイアンの質感が映える、スタンダードで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したスタンダードな空間。価格と機能のバランスを重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルなチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorChair' }, { name: 'デザイン照明 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignLight' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_space_saving_natural_elegant
        // 46
        'gogatsu_space_saving_natural_elegant_function': {
            style: 'アイアンの質感が映える、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感とナチュラルで上品なテイストが、機能性を重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+SlimShelf' }, { name: '壁掛け収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallStorage' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 47
        'gogatsu_space_saving_natural_elegant_design': {
            style: 'アイアンの質感が映える、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感とナチュラルで上品なテイストが、デザイン性を重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+SlimShelf' }, { name: '壁掛け収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallStorage' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 48
        'gogatsu_space_saving_natural_elegant_balance': {
            style: 'アイアンの質感が映える、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感とナチュラルで上品なテイストが、価格と機能のバランスを重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+SlimShelf' }, { name: '壁掛け収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallStorage' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_space_saving_modern_stylish
        // 49
        'gogatsu_space_saving_modern_stylish_function': {
            style: 'アイアンの質感が映える、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、機能性を重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Shelf' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 50
        'gogatsu_space_saving_modern_stylish_design': {
            style: 'アイアンの質感が映える、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、デザイン性を重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Shelf' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 51
        'gogatsu_space_saving_modern_stylish_balance': {
            style: 'アイアンの質感が映える、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、価格と機能のバランスを重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Shelf' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_space_saving_playful_cheerful
        // 52
        'gogatsu_space_saving_playful_cheerful_function': {
            style: 'アイアンの質感が映える、省スペース・効率重視で明るく・元気なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感と明るく元気なテイストが、機能性を重視しつつも楽しい空間を演出します。',
            categories: [{ name: 'コンパクトソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+CompactSofa' }, { name: '壁面アート (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallArt' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        // 53
        'gogatsu_space_saving_playful_cheerful_design': {
            style: 'アイアンの質感が映える、省スペース・効率重視で明るく・元気なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感と明るく元気なテイストが、デザイン性を重視しつつも楽しい空間を演出します。',
            categories: [{ name: 'コンパクトソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+CompactSofa' }, { name: '壁面アート (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallArt' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        // 54
        'gogatsu_space_saving_playful_cheerful_balance': {
            style: 'アイアンの質感が映える、省スペース・効率重視で明るく・元気なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感と明るく元気なテイストが、価格と機能のバランスを重視しつつも楽しい空間を演出します。',
            categories: [{ name: 'コンパクトソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+CompactSofa' }, { name: '壁面アート (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallArt' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        }
        // --- 編集箇所：ここまで ---
    };

    // --- 関数定義セクション ---

    /**
     * 現在の質問を画面に表示する関数
     */
    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const q = questions[currentQuestionIndex];
            questionTitle.textContent = q.title;
            optionsContainer.innerHTML = '';
            q.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option.text;
                button.onclick = () => handleAnswer(q.id, option.value);
                optionsContainer.appendChild(button);
            });

            // Q2以降の場合のみ「前の質問に戻る」選択肢を追加
            if (currentQuestionIndex > 0) {
                const backButton = document.createElement('button');
                backButton.className = 'option-btn back-option-btn'; // 新しいクラスを追加
                backButton.textContent = 'ひとつ前の質問に戻る';
                backButton.onclick = () => handleAnswer('back_action', 'go_back'); // 特殊なIDとValue
                optionsContainer.appendChild(backButton);
            }
        } else {
            showResult();
        }
    }

    /**
     * ユーザーの回答を処理し、次の質問へ進む関数
     * @param {string} questionId - 回答された質問のID
     * @param {string} value - 選択された選択肢の値
     */
    function handleAnswer(questionId, value) {
        if (value === 'go_back') {
            currentQuestionIndex--; // ひとつ前の質問に戻る
            if (currentQuestionIndex < 0) currentQuestionIndex = 0; // 0未満にならないように
            displayQuestion();
            return; // ここで処理を終了
        }
        userAnswers[questionId] = value;
        currentQuestionIndex++;
        displayQuestion();
    }

    /**
     * 診断結果を表示する関数
     */
    function showResult() {
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'block';

        // ユーザーの回答から結果キーを生成
        const resultKey = `${userAnswers.q1}_${userAnswers.q2}_${userAnswers.q3}_${userAnswers.q4}`;
        // 対応する結果データを取得（なければデフォルトを使用）
        const result = resultsData[resultKey] || resultsData['default'];

        // 取得したデータで結果ページの内容を更新
        resultStyleTitle.textContent = result.style;
        resultMessage.textContent = result.message;
        designerMessage.textContent = result.advice;

        recommendedCategoriesContainer.innerHTML = '';
        result.categories.forEach(category => {
            const catItem = document.createElement('div');
            catItem.className = 'category-item';

            const image = document.createElement('img');
            image.src = category.img;
            image.alt = category.name;
            // 画像の読み込みに失敗した場合のフォールバック処理
            image.onerror = () => { 
                image.src = 'https://via.placeholder.com/280x280/EFEFEF/AAAAAA?text=Image+Not+Found';
                image.alt = '画像が見つかりません';
            };

            const p = document.createElement('p');
            p.textContent = category.name;

            catItem.appendChild(image);
            catItem.appendChild(p);
            recommendedCategoriesContainer.appendChild(catItem);
        });
    }

    /**
     * 診断を最初からやり直す関数
     */
    function restartQuiz() {
        currentQuestionIndex = 0;
        userAnswers = {};
        resultContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        displayQuestion();
    }

    // --- 初期化処理とイベントリスナーの設定 ---
    restartBtn.addEventListener('click', restartQuiz);
    displayQuestion(); // 最初の質問を表示
});
