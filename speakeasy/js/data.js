/* Speakeasy: сценарии свиданий. В opts первый вариант верный, порядок перемешивается при показе. */
window.SPK = window.SPK || {};
SPK.DAILY_GOAL = 30;
SPK.AUTHOR = 'Mia Lane';
SPK.SCENARIOS = [
  { id: 'coffee', n: 1, title: 'Кофе на двоих', sub: 'Знакомство и small talk', lvl: 'A2', cost: 0, who: 'Alex', hue: 28,
    steps: [
      { him: "Hi! You must be Kate. I'm Alex, nice to meet you!", ru: 'Привет! Ты, наверное, Кейт. Я Алекс, приятно познакомиться!',
        opts: [['Hi Alex! Nice to meet you too.', '«too» отвечает на «nice to meet you» — тепло и естественно.'], ['Hi! Me too nice meet you.', 'Нужен порядок слов: «Nice to meet you too».'], ['Yes. Where is the menu?', 'Вы не ответили на приветствие — звучит холодно.']] },
      { him: 'What would you like to drink? They have great flat whites here.', ru: 'Что будешь пить? Тут отличный флэт уайт.',
        opts: [["I'd love a flat white, thanks!", '«I\'d love…» — вежливый способ согласиться или заказать.'], ['I want flat white now.', 'Слишком резко: нужны артикль «a» и вежливая форма.'], ['Me flat white yes please.', 'Нет подлежащего и глагола — звучит неестественно.']] },
      { him: 'So, what do you do for a living?', ru: 'Так чем ты зарабатываешь на жизнь?',
        opts: [['I work as a designer. How about you?', '«I work as…» — профессия, «How about you?» возвращает вопрос.'], ['I am working designer.', 'Нужно «I work as a designer» или «I\'m a designer».'], ['My job is design of people.', 'Так не говорят — получается «проектирую людей».']] },
      { him: 'I had a great time. Would you like to see each other again?', ru: 'Я отлично провёл время. Хочешь увидеться ещё?',
        opts: [["I'd really like that. Let's do it again soon!", 'Тёплое и естественное согласие.'], ['Yes, I want see you again.', 'Пропущено «to»: «I want to see you again».'], ['No problem, see you never.', '«See you never» значит «никогда не увидимся» — грубо.']] }
    ] },
  { id: 'match', n: 2, title: 'Первый мэтч', sub: 'Первые сообщения в чате', lvl: 'A2', cost: 0, who: 'Sam', hue: 330,
    steps: [
      { him: 'Hey! I liked your profile. Your photo from Iceland is amazing 😍', ru: 'Привет! Мне понравился твой профиль. Фото из Исландии потрясающее.',
        opts: [['Thank you! It was the trip of a lifetime.', '«Trip of a lifetime» — идиома: поездка всей жизни.'], ['Thanks, I am agree.', '«Agree» — глагол, «am» не нужен: «I agree».'], ['Yes I did it.', 'Не по смыслу — на комплимент ждут «спасибо».']] },
      { him: 'What are you into? Any hobbies?', ru: 'Чем увлекаешься? Есть хобби?',
        opts: [["I'm into yoga and cooking. What about you?", '«I\'m into…» — разговорное «увлекаюсь».'], ['I am like very much yoga.', 'Лучше «I really like yoga» или «I\'m into yoga».'], ['My hobbies are exist: yoga.', 'Глагол «exist» здесь лишний.']] },
      { him: 'Wanna grab a drink this weekend?', ru: 'Может, выпьем что-нибудь на выходных?',
        opts: [['Sure, that sounds fun! Saturday works for me.', '«Sounds fun» и «works for me» — естественное согласие.'], ['Yes, I am free on Saturday day.', '«Saturday day» избыточно — достаточно «on Saturday».'], ['I will to go with you.', 'После «will» не нужно «to».']] },
      { him: 'Cool! Text me when you get there?', ru: 'Отлично! Напиши мне, когда доберёшься?',
        opts: [['Will do! See you soon.', '«Will do!» — «Обязательно сделаю!»'], ['I will text to you.', '«Text me» — без предлога «to».'], ['I texting you later.', 'Нужно «I\'ll text you later».']] }
    ] },
  { id: 'dinner', n: 3, title: 'Ужин при свечах', sub: 'Заказ, комплименты и счёт', lvl: 'B1', cost: 0, who: 'Leo', hue: 12,
    steps: [
      { him: 'Shall we share a starter?', ru: 'Закажем закуску на двоих?',
        opts: [["Good idea! Let's get the bruschetta.", 'Согласие + конкретное предложение.'], ['Yes, we shall to share.', 'После «shall» не нужно «to».'], ["No, I don't share food with you, sorry.", 'Грамматически верно, но звучит грубо на первом свидании.']] },
      { him: "How's your pasta?", ru: 'Как твоя паста?',
        opts: [["It's delicious! Would you like to try some?", 'Эмоция + забота о собеседнике.'], ["It's very tasty for me.", 'Лучше «It\'s delicious» — без «for me».'], ['My pasta is good like a dream.', 'Неестественно; нужно «tastes like a dream».']] },
      { him: 'Do you want dessert or should we get the check?', ru: 'Десерт или попросим счёт?',
        opts: [["I'm full, let's get the check. This one's on me!", '«On me» — «плачу я».'], ['I am full of food, the bill please me.', 'Конструкция неверная: «Could we have the bill, please?»'], ['Give me the money list.', '«Money list» — нет такого, говорят check/bill.']] },
      { him: "Are you sure? Let's split it.", ru: 'Уверена? Давай пополам.',
        opts: [['Absolutely, my treat this time. You get the next one!', '«My treat» — «я угощаю».'], ['No, I will pay for you all.', '«For you all» звучит странно: «I\'ll pay for both of us».'], ['Okay, you pay and I am happy.', 'Звучит как требование, не шутка.']] }
    ] },
  { id: 'parents', n: 4, title: 'Встреча с родителями', sub: 'Вежливость и тёплый тон', lvl: 'B2', cost: 0, who: 'Mrs. Reed', hue: 160,
    steps: [
      { him: "Come in, come in! We've heard so much about you.", ru: 'Проходи! Мы столько о тебе слышали.',
        opts: [['Thank you for having me. You have a lovely home!', 'Благодарность хозяевам + комплимент дому.'], ['Thanks, I am very glad to be at your house.', 'Грамматически можно, но звучит неестественно: «Thank you for having me».'], ['Hello. Where do I sit?', 'Слишком сухо и без тепла для первой встречи.']] },
      { him: 'Can I get you something to drink? Tea, coffee, juice?', ru: 'Что тебе предложить? Чай, кофе, сок?',
        opts: [['Tea would be lovely, thank you.', '«Would be lovely» — мягкая, вежливая форма.'], ['Give me tea, please.', '«Give me» звучит как приказ, лучше «I\'d like…» или «would be lovely».'], ['I am wanting coffee.', '«Want» не используется в Continuous так.']] },
      { him: 'So, how did you two meet?', ru: 'Так как вы познакомились?',
        opts: [['We met through a mutual friend. It was a funny coincidence.', '«Mutual friend» — общий друг, «coincidence» — совпадение.'], ['We are meeting by friend.', 'Нужно прошедшее время: «We met through a friend».'], ['Why do you ask?', 'Прозвучит подозрительно и закрыто.']] },
      { him: "Dinner's ready! Hope you're hungry.", ru: 'Ужин готов! Надеюсь, ты голоден.',
        opts: [['It smells amazing! Can I help set the table?', 'Комплимент + предложение помощи — идеальный тон.'], ['I am very hungry from smell.', '«Hungry from smell» — не по-английски: «It smells amazing».'], ['No, I already ate at home.', 'Грамматика верна, но обижает хозяев.']] }
    ] },
  { id: 'nyc', n: 5, title: 'Уикенд в Нью-Йорке', sub: 'Метро, бранч и первые прогулки', lvl: 'B1', cost: 50, who: 'Jake', hue: 205,
    steps: [
      { him: 'Welcome to New York! How was your flight?', ru: 'Добро пожаловать в Нью-Йорк! Как перелёт?',
        opts: [["Pretty smooth, but I'm a bit jet-lagged.", '«Jet-lagged» — уставший от смены часовых поясов.'], ['My flight was flying good.', 'Нужно «The flight was good».'], ["I am tired from the airplane's flight.", 'Неестественно, лучше «jet-lagged».']] },
      { him: 'Shall we take the subway or grab a cab?', ru: 'Поедем на метро или возьмём такси?',
        opts: [["Let's take the subway — it's cheaper and quicker.", 'В Нью-Йорке метро — «the subway».'], ['Let us ride on metro of New York.', 'Так не говорят: «take the subway».'], ['I will go by my legs.', 'Пешком — «on foot».']] },
      { him: 'Do you have a MetroCard, or should we just tap in?', ru: 'У тебя есть MetroCard или просто приложим карту?',
        opts: [['Not yet. Where can I top one up?', '«Top up» — пополнить баланс карты.'], ['No, I am not having this card.', 'Нужно «I don\'t have one».'], ['A card? I only know credit cards.', 'Шутка, но вопрос остался без ответа.']] },
      { him: 'Fancy brunch in Brooklyn tomorrow?', ru: 'Как насчёт бранча в Бруклине завтра?',
        opts: [["I'd love to! It's a classic New York thing.", '«I\'d love to» — вежливое «с удовольствием».'], ['Yes, I fancy to eat brunch.', '«Fancy» без «to»: «I fancy a brunch».'], ['Brunch at Brooklyn is for me nice.', 'Нарушен порядок слов.']] }
    ] },
  { id: 'makeup', n: 6, title: 'Помириться после ссоры', sub: 'Как мириться и не обижать', lvl: 'B2', cost: 80, who: 'Chris', hue: 275,
    steps: [
      { him: "I'm sorry about last night. I didn't mean to snap at you.", ru: 'Прости за вчерашнее. Я не хотел на тебя срываться.',
        opts: [["It's okay. I appreciate you saying that.", 'Принимает извинение и благодарит за него.'], ['No problem, you are forgiven by me.', 'Слишком театрально и канцелярски.'], ["It's not okay, you always do this.", '«Always» разжигает конфликт.']] },
      { him: "I just felt like you weren't listening.", ru: 'Мне просто казалось, что ты меня не слушаешь.',
        opts: [["I hear you. I'll try to be more present.", '«I hear you» — признаю твои чувства.'], ["I was listened, you didn't see.", 'Страдательный залог здесь неверен.'], ['You are exaggerating.', 'Обесценивает чувства собеседника.']] },
      { him: 'Can we talk it through calmly?', ru: 'Можем спокойно всё обсудить?',
        opts: [["Of course. Let's start fresh and be honest.", 'Готовность и конструктивный тон.'], ['Talk it through is not needed.', 'Прозвучит как отказ.'], ['Calm down first, then maybe.', 'Грубовато и снисходительно.']] },
      { him: 'Thanks for giving me another chance.', ru: 'Спасибо, что даёшь мне ещё один шанс.',
        opts: [['We all make mistakes. Let us move on together.', '«Move on» — идти дальше, не застревая в обиде.'], ['You are lucky that I stay.', 'Манипулятивно.'], ["Chance is not given, it's taken.", 'Не по теме, звучит странно.']] }
    ] }
];
SPK.PACKS = [
  { id: 'p1', sparks: 100, price: 99, name: 'Глоток' },
  { id: 'p2', sparks: 500, price: 399, name: 'Вечер', tag: 'Популярный' },
  { id: 'p3', sparks: 1200, price: 799, name: 'Вся ночь', tag: 'Выгоднее на 33%' }
];
SPK.HINT_COST = 5;
SPK.DAILY_BONUS = 50;
