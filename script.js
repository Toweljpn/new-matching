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
            message: 'あなたの独自のセンスが光る、特別なミックススタイル。様々な要素を組み合わせて、あなただけの理想の空間を創造しましょう。',
            categories: [
                { name: '照明', img: 'https://placehold.co/280x280/cccccc/FFFFFF?text=Lighting' },
                { name: 'ラグ', img: 'https://placehold.co/280x280/cccccc/FFFFFF?text=Rug' }
            ],
            advice: 'あなたの直感を信じて、楽しんで家具を選んでみてください。それが最高の空間作りの秘訣です。'
        },

        // --- hina (木の家具) を選んだ場合のパターン (27通り) ---
        // hina_compact_natural_elegant
        'hina_compact_natural_elegant_function': {
            style: '木の温もりを活かした、コンパクトでナチュラル・上品なスタイル',
            message: 'あなたの理想は、木の温もりを感じるコンパクトな空間に、ナチュラルで上品なテイストを取り入れること。機能性を重視し、あなただけの心地よい隠れ家のような空間が生まれます。',
            categories: [{ name: 'リビング収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Storage' }, { name: 'ダイニングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Chair' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_compact_natural_elegant_design': {
            style: '木の温もりを活かした、コンパクトでナチュラル・上品なスタイル',
            message: 'あなたの理想は、木の温もりを感じるコンパクトな空間に、ナチュラルで上品なテイストを取り入れること。デザイン性を重視し、あなただけの心地よい隠れ家のような空間が生まれます。',
            categories: [{ name: 'リビング収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Storage' }, { name: 'ダイニングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Chair' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_compact_natural_elegant_balance': {
            style: '木の温もりを活かした、コンパクトでナチュラル・上品なスタイル',
            message: 'あなたの理想は、木の温もりを感じるコンパクトな空間に、ナチュラルで上品なテイストを取り入れること。価格と機能のバランスを重視し、あなただけの心地よい隠れ家のような空間が生まれます。',
            categories: [{ name: 'リビング収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Storage' }, { name: 'ダイニングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Chair' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // hina_compact_modern_stylish
        'hina_compact_modern_stylish_function': {
            style: '木の温もりを活かした、コンパクトでモダン・スタイリッシュなスタイル',
            message: '木の温もりとモダンなデザインが融合した、コンパクトながらも洗練された空間。機能性を重視しつつ、スタイリッシュさも忘れない、都会的な暮らしにフィットします。',
            categories: [{ name: 'シェルフ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Shelf' }, { name: 'デスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Desk' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_compact_modern_stylish_design': {
            style: '木の温もりを活かした、コンパクトでモダン・スタイリッシュなスタイル',
            message: '木の温もりとモダンなデザインが融合した、コンパクトながらも洗練された空間。デザイン性を重視しつつ、スタイリッシュさも忘れない、都会的な暮らしにフィットします。',
            categories: [{ name: 'シェルフ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Shelf' }, { name: 'デスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Desk' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_compact_modern_stylish_balance': {
            style: '木の温もりを活かした、コンパクトでモダン・スタイリッシュなスタイル',
            message: '木の温もりとモダンなデザインが融合した、コンパクトながらも洗練された空間。価格と機能のバランスを重視しつつ、スタイリッシュさも忘れない、都会的な暮らしにフィットします。',
            categories: [{ name: 'シェルフ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Shelf' }, { name: 'デスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Desk' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // hina_compact_playful_cheerful
        'hina_compact_playful_cheerful_function': {
            style: '木の温もりを活かした、コンパクトで明るく・元気なスタイル',
            message: '木の温もりと明るく元気な雰囲気が調和した、コンパクトながらも楽しい空間。機能性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: '収納ボックス (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Box' }, { name: 'スツール (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Stool' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_compact_playful_cheerful_design': {
            style: '木の温もりを活かした、コンパクトで明るく・元気なスタイル',
            message: '木の温もりと明るく元気な雰囲気が調和した、コンパクトながらも楽しい空間。デザイン性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: '収納ボックス (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Box' }, { name: 'スツール (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Stool' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_compact_playful_cheerful_balance': {
            style: '木の温もりを活かした、コンパクトで明るく・元気なスタイル',
            message: '木の温もりと明るく元気な雰囲気が調和した、コンパクトながらも楽しい空間。価格と機能のバランスを重視し、日々の生活を快適に彩ります。',
            categories: [{ name: '収納ボックス (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Box' }, { name: 'スツール (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Stool' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // hina_standard_natural_elegant
        'hina_standard_natural_elegant_function': {
            style: '木の温もりを活かした、スタンダードでナチュラル・上品なスタイル',
            message: '家族や友人との時間を大切にする、スタンダードな空間。木の温もりが、集まる人々を優しく包み込み、ナチュラルで上品な雰囲気を演出します。機能性を重視し、快適な暮らしをサポートします。',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_standard_natural_elegant_design': {
            style: '木の温もりを活かした、スタンダードでナチュラル・上品なスタイル',
            message: '家族や友人との時間を大切にする、スタンダードな空間。木の温もりが、集まる人々を優しく包み込み、ナチュラルで上品な雰囲気を演出します。デザイン性を重視し、快適な暮らしをサポートします。',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_standard_natural_elegant_balance': {
            style: '木の温もりを活かした、スタンダードでナチュラル・上品なスタイル',
            message: '家族や友人との時間を大切にする、スタンダードな空間。木の温もりとナチュラルで上品な雰囲気を演出します。価格と機能のバランスを重視し、快適な暮らしをサポートします。',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // hina_standard_modern_stylish
        'hina_standard_modern_stylish_function': {
            style: '木の温もりを活かした、スタンダードでモダン・スタイリッシュなスタイル',
            message: '木の温もりとモダンなデザインが融合した、スタンダードながらも洗練された空間。機能性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'テレビボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+TV' }, { name: 'サイドボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sideboard' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_standard_modern_stylish_design': {
            style: '木の温もりを活かした、スタンダードでモダン・スタイリッシュなスタイル',
            message: '木の温もりとモダンなデザインが融合した、スタンダードながらも洗練された空間。デザイン性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'テレビボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+TV' }, { name: 'サイドボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sideboard' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_standard_modern_stylish_balance': {
            style: '木の温もりを活かした、スタンダードでモダン・スタイリッシュなスタイル',
            message: '木の温もりとモダンなデザインが融合した、スタンダードながらも洗練された空間。価格と機能のバランスを重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'テレビボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+TV' }, { name: 'サイドボード (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sideboard' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // hina_standard_playful_cheerful
        'hina_standard_playful_cheerful_function': {
            style: '木の温もりを活かした、スタンダードで明るく・元気なスタイル',
            message: '家族や友人との時間を大切にする、明るく元気なスタンダード空間。木の温もりが、集まる人々を優しく包み込みます。機能性を重視し、快適な暮らしをサポートします。',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_standard_playful_cheerful_design': {
            style: '木の温もりを活かした、スタンダードで明るく・元気なスタイル',
            message: '家族や友人との時間を大切にする、明るく元気なスタンダード空間。木の温もりが、集まる人々を優しく包み込みます。デザイン性を重視し、快適な暮らしをサポートします。',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_standard_playful_cheerful_balance': {
            style: '木の温もりを活かした、スタンダードで明るく・元気なスタイル',
            message: '家族や友人との時間を大切にする、明るく元気なスタンダード空間。木の温もりと明るく元気な雰囲気を演出します。価格と機能のバランスを重視し、快適な暮らしをサポートします。',
            categories: [{ name: 'ダイニングテーブル (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Table' }, { name: 'ソファ (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Sofa' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // hina_space_saving_natural_elegant
        'hina_space_saving_natural_elegant_function': {
            style: '木の温もりを活かした、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりとナチュラルで上品なテイストが、機能性を重視しつつも心地よい空間を演出します。',
            categories: [{ name: '折りたたみデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+FoldDesk' }, { name: '壁面収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+WallStorage' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_space_saving_natural_elegant_design': {
            style: '木の温もりを活かした、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりとナチュラルで上品なテイストが、デザイン性を重視しつつも心地よい空間を演出します。',
            categories: [{ name: '折りたたみデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+FoldDesk' }, { name: '壁面収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+WallStorage' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_space_saving_natural_elegant_balance': {
            style: '木の温もりを活かした、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりとナチュラルで上品なテイストが、価格と機能のバランスを重視しつつも心地よい空間を演出します。',
            categories: [{ name: '折りたたみデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+FoldDesk' }, { name: '壁面収納 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+WallStorage' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // hina_space_saving_modern_stylish
        'hina_space_saving_modern_stylish_function': {
            style: '木の温もりを活かした、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりとモダンでスタイリッシュなテイストが、機能性を重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+SlimDesk' }, { name: 'スタッキングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+StackChair' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_space_saving_modern_stylish_design': {
            style: '木の温もりを活かした、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりとモダンでスタイリッシュなテイストが、デザイン性を重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+SlimDesk' }, { name: 'スタッキングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+StackChair' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_space_saving_modern_stylish_balance': {
            style: '木の温もりを活かした、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりとモダンでスタイリッシュなテイストが、価格と機能のバランスを重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムデスク (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+SlimDesk' }, { name: 'スタッキングチェア (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+StackChair' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // hina_space_saving_playful_cheerful
        'hina_space_saving_playful_cheerful_function': {
            style: '木の温もりを活かした、省スペース・効率重視で明るく・元気なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりと明るく元気なテイストが、機能性を重視しつつも楽しい空間を演出します。',
            categories: [{ name: '収納付きベッド (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Bed' }, { name: 'カラフルな小物 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Colorful' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'hina_space_saving_playful_cheerful_design': {
            style: '木の温もりを活かした、省スペース・効率重視で明るく・元気なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりと明るく元気なテイストが、デザイン性を重視しつつも楽しい空間を演出します。',
            categories: [{ name: '収納付きベッド (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Bed' }, { name: 'カラフルな小物 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Colorful' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'hina_space_saving_playful_cheerful_balance': {
            style: '木の温もりを活かした、省スペース・効率重視で明るく・元気なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。木の温もりと明るく元気なテイストが、価格と機能のバランスを重視しつつも楽しい空間を演出します。',
            categories: [{ name: '収納付きベッド (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Bed' }, { name: 'カラフルな小物 (木)', img: 'https://placehold.co/280x280/c2a890/FFFFFF?text=Hina+Colorful' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // --- gogatsu (鉄の家具) を選んだ場合のパターン (27通り) ---
        // gogatsu_compact_natural_elegant
        'gogatsu_compact_natural_elegant_function': {
            style: 'アイアンの質感が映える、コンパクトでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したコンパクトな空間。機能性を重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンラック (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Rack' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_compact_natural_elegant_design': {
            style: 'アイアンの質感が映える、コンパクトでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したコンパクトな空間。デザイン性を重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンラック (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Rack' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'gogatsu_compact_natural_elegant_balance': {
            style: 'アイアンの質感が映える、コンパクトでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したコンパクトな空間。価格と機能のバランスを重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンラック (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Rack' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_compact_modern_stylish
        'gogatsu_compact_modern_stylish_function': {
            style: 'アイアンの質感が映える、コンパクトでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、機能性を重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンデスク (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Desk' }, { name: 'ミニマルチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+MiniChair' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_compact_modern_stylish_design': {
            style: 'アイアンの質感が映える、コンパクトでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、デザイン性を重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンデスク (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Desk' }, { name: 'ミニマルチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+MiniChair' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'gogatsu_compact_modern_stylish_balance': {
            style: 'アイアンの質感が映える、コンパクトでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、価格と機能のバランスを重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンデスク (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Desk' }, { name: 'ミニマルチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+MiniChair' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_compact_playful_cheerful
        'gogatsu_compact_playful_cheerful_function': {
            style: 'アイアンの質感が映える、コンパクトで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したコンパクトな空間。機能性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルな収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorStorage' }, { name: 'デザインスツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignStool' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_compact_playful_cheerful_design': {
            style: 'アイアンの質感が映える、コンパクトで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したコンパクトな空間。デザイン性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルな収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorStorage' }, { name: 'デザインスツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignStool' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'gogatsu_compact_playful_cheerful_balance': {
            style: 'アイアンの質感が映える、コンパクトで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したコンパクトな空間。価格と機能のバランスを重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルな収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorStorage' }, { name: 'デザインスツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignStool' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_standard_natural_elegant
        'gogatsu_standard_natural_elegant_function': {
            style: 'アイアンの質感が映える、スタンダードでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したスタンダードな空間。機能性を重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンダイニング (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Dining' }, { name: 'ファブリックソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Sofa' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_standard_natural_elegant_design': {
            style: 'アイアンの質感が映える、スタンダードでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したスタンダードな空間。デザイン性を重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンダイニング (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Dining' }, { name: 'ファブリックソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Sofa' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'gogatsu_standard_natural_elegant_balance': {
            style: 'アイアンの質感が映える、スタンダードでナチュラル・上品なスタイル',
            message: 'アイアンのクールな質感と、ナチュラルで上品なテイストが融合したスタンダードな空間。価格と機能のバランスを重視し、洗練された都会的な暮らしにフィットします。',
            categories: [{ name: 'アイアンダイニング (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Dining' }, { name: 'ファブリックソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Sofa' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_standard_modern_stylish
        'gogatsu_standard_modern_stylish_function': {
            style: 'アイアンの質感が映える、スタンダードでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。スタンダードな空間に機能性を重視し、洗練された都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンテレビボード (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+TV' }, { name: 'ローテーブル (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+LowTable' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_standard_modern_stylish_design': {
            style: 'アイアンの質感が映える、スタンダードでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。スタンダードな空間にデザイン性を重視し、洗練された都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンテレビボード (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+TV' }, { name: 'ローテーブル (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+LowTable' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'gogatsu_standard_modern_stylish_balance': {
            style: 'アイアンの質感が映える、スタンダードでモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。スタンダードな空間に価格と機能のバランスを重視し、洗練された都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンテレビボード (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+TV' }, { name: 'ローテーブル (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+LowTable' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_standard_playful_cheerful
        'gogatsu_standard_playful_cheerful_function': {
            style: 'アイアンの質感が映える、スタンダードで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したスタンダードな空間。機能性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルなチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorChair' }, { name: 'デザイン照明 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignLight' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_standard_playful_cheerful_design': {
            style: 'アイアンの質感が映える、スタンダードで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したスタンダードな空間。デザイン性を重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルなチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorChair' }, { name: 'デザイン照明 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignLight' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'gogatsu_standard_playful_cheerful_balance': {
            style: 'アイアンの質感が映える、スタンダードで明るく・元気なスタイル',
            message: 'アイアンのクールな質感と、明るく元気な雰囲気が調和したスタンダードな空間。価格と機能のバランスを重視し、日々の生活を快適に彩ります。',
            categories: [{ name: 'カラフルなチェア (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+ColorChair' }, { name: 'デザイン照明 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+DesignLight' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_space_saving_natural_elegant
        'gogatsu_space_saving_natural_elegant_function': {
            style: 'アイアンの質感が映える、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感とナチュラルで上品なテイストが、機能性を重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+SlimShelf' }, { name: '壁掛け収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallStorage' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_space_saving_natural_elegant_design': {
            style: 'アイアンの質感が映える、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感とナチュラルで上品なテイストが、デザイン性を重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+SlimShelf' }, { name: '壁掛け収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallStorage' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'gogatsu_space_saving_natural_elegant_balance': {
            style: 'アイアンの質感が映える、省スペース・効率重視でナチュラル・上品なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感とナチュラルで上品なテイストが、価格と機能のバランスを重視しつつも洗練された空間を演出します。',
            categories: [{ name: 'スリムシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+SlimShelf' }, { name: '壁掛け収納 (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallStorage' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_space_saving_modern_stylish
        'gogatsu_space_saving_modern_stylish_function': {
            style: 'アイアンの質感が映える、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、機能性を重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Shelf' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_space_saving_modern_stylish_design': {
            style: 'アイアンの質感が映える、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、デザイン性を重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Shelf' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
        'gogatsu_space_saving_modern_stylish_balance': {
            style: 'アイアンの質感が映える、省スペース・効率重視でモダン・スタイリッシュなスタイル',
            message: 'アイアンのクールな質感と、モダンでスタイリッシュなデザインが特徴。限られたスペースを最大限に活用し、価格と機能のバランスを重視したスマートな都市型の暮らしを実現します。',
            categories: [{ name: 'アイアンシェルフ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Shelf' }, { name: 'スツール (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+Stool' }],
            advice: '定番ブランドのロングセラー商品や、異素材ミックスのアイテムを選ぶと、価格を抑えつつも質の高い空間づくりができます。'
        },

        // gogatsu_space_saving_playful_cheerful
        'gogatsu_space_saving_playful_cheerful_function': {
            style: 'アイアンの質感が映える、省スペース・効率重視で明るく・元気なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感と明るく元気なテイストが、機能性を重視しつつも楽しい空間を演出します。',
            categories: [{ name: 'コンパクトソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+CompactSofa' }, { name: '壁面アート (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallArt' }],
            advice: '長く使える良い素材や、収納力を兼ね備えた多機能なアイテムを選ぶのがおすすめです。'
        },
        'gogatsu_space_saving_playful_cheerful_design': {
            style: 'アイアンの質感が映える、省スペース・効率重視で明るく・元気なスタイル',
            message: '限られたスペースを最大限に活用し、効率的でスマートな暮らし。アイアンのクールな質感と明るく元気なテイストが、デザイン性を重視しつつも楽しい空間を演出します。',
            categories: [{ name: 'コンパクトソファ (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+CompactSofa' }, { name: '壁面アート (鉄)', img: 'https://placehold.co/280x280/555555/FFFFFF?text=Gogatsu+WallArt' }],
            advice: '空間の主役になるような、デザイン性の高い照明やアートを一つ取り入れるだけで、お部屋の印象がぐっと上がります。'
        },
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
