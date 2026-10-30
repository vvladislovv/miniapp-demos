/* Контент Out of Box. В opts первый вариант — верный, порядок перемешивается при показе. */
const SCENARIOS = [
  {
    id: 'cafe', title: 'Первое свидание в кофейне', sub: 'Знакомство и small talk', lvl: 'A2', emoji: '☕', cost: 0,
    steps: [
      { him: "Hi! You must be Anna. I'm Alex, nice to meet you!", ru: 'Привет! Ты, наверное, Анна. Я Алекс, приятно познакомиться!',
        opts: [['Hi Alex! Nice to meet you too.', '«too» отвечает на «nice to meet you» — тепло и естественно.'], ['Hi! Me too nice meet you.', 'Нужен порядок слов: «Nice to meet you too».'], ['Yes. Where is the menu?', 'Вы не ответили на приветствие — звучит холодно.']] },
      { him: 'What would you like to drink? They have great flat whites here.', ru: 'Что будешь пить? Тут отличный флэт уайт.',
        opts: [["I'd love a flat white, thanks!", '«I\'d love…» — вежливый способ согласиться или заказать.'], ['I want flat white now.', 'Слишком резко: нужны артикль «a» и вежливая форма.'], ['Me flat white yes please.', 'Нет подлежащего и глагола — звучит неестественно.']] },
      { him: 'So, what do you do for a living?', ru: 'Так чем ты зарабатываешь на жизнь?',
        opts: [['I work as a designer. How about you?', '«I work as…» — профессия, «How about you?» возвращает вопрос.'], ['I am working designer.', 'Нужно «I work as a designer» или «I\'m a designer».'], ['My job is design of people.', 'Так не говорят — получается «проектирую людей».']] },
      { him: 'I had a great time. Would you like to see each other again?', ru: 'Я отлично провёл время. Хочешь увидеться ещё?',
        opts: [["I'd really like that. Let's do it again soon!", 'Тёплое и естественное согласие.'], ['Yes, I want see you again.', 'Пропущено «to»: «I want to see you again».'], ['No problem, see you never.', '«See you never» значит «никогда не увидимся» — грубо.']] }
    ]
  },
  {
    id: 'app', title: 'Знакомство в приложении', sub: 'Первые сообщения в чате', lvl: 'A2', emoji: '💬', cost: 0,
    steps: [
      { him: 'Hey! I liked your profile. Your photo from Iceland is amazing 😍', ru: 'Привет! Мне понравился твой профиль. Фото из Исландии потрясающее.',
        opts: [['Thank you! It was the trip of a lifetime.', '«Trip of a lifetime» — идиома: поездка всей жизни.'], ['Thanks, I am agree.', '«Agree» — глагол, «am» не нужен: «I agree».'], ['Yes I did it.', 'Не по смыслу — на комплимент ждут «спасибо».']] },
      { him: 'What are you into? Any hobbies?', ru: 'Чем увлекаешься? Есть хобби?',
        opts: [["I'm into yoga and cooking. What about you?", '«I\'m into…» — разговорное «увлекаюсь».'], ['I am like very much yoga.', 'Лучше «I really like yoga» или «I\'m into yoga».'], ['My hobbies are exist: yoga.', 'Глагол «exist» здесь лишний.']] },
      { him: 'Wanna grab a drink this weekend?', ru: 'Может, выпьем что-нибудь на выходных?',
        opts: [['Sure, that sounds fun! Saturday works for me.', '«Sounds fun» и «works for me» — естественное согласие.'], ['Yes, I am free on Saturday day.', '«Saturday day» избыточно — достаточно «on Saturday».'], ['I will to go with you.', 'После «will» не нужно «to».']] },
      { him: 'Cool! Text me when you get there?', ru: 'Отлично! Напиши мне, когда доберёшься?',
        opts: [['Will do! See you soon.', '«Will do!» — «Обязательно сделаю!»'], ['I will text to you.', '«Text me» — без предлога «to».'], ['I texting you later.', 'Нужно «I\'ll text you later».']] }
    ]
  },
  {
    id: 'rest', title: 'Ужин в ресторане', sub: 'Заказ, комплименты и счёт', lvl: 'B1', emoji: '🍝', cost: 0,
    steps: [
      { him: 'Shall we share a starter?', ru: 'Закажем закуску на двоих?',
        opts: [["Good idea! Let's get the bruschetta.", 'Согласие + конкретное предложение.'], ['Yes, we shall to share.', 'После «shall» не нужно «to».'], ["No, I don't share food with you, sorry.", 'Грамматически верно, но звучит грубо на первом свидании.']] },
      { him: "How's your pasta?", ru: 'Как твоя паста?',
        opts: [["It's delicious! Would you like to try some?", 'Эмоция + забота о собеседнике.'], ["It's very tasty for me.", 'Лучше «It\'s delicious» — без «for me».'], ['My pasta is good like a dream.', 'Неестественно; нужно «tastes like a dream».']] },
      { him: 'Do you want dessert or should we get the check?', ru: 'Десерт или попросим счёт?',
        opts: [["I'm full, let's get the check. This one's on me!", '«On me» — «плачу я».'], ['I am full of food, the bill please me.', 'Конструкция неверная: «Could we have the bill, please?»'], ['Give me the money list.', '«Money list» — нет такого, говорят check/bill.']] },
      { him: "Are you sure? Let's split it.", ru: 'Уверена? Давай пополам.',
        opts: [['Absolutely, my treat this time. You get the next one!', '«My treat» — «я угощаю».'], ['No, I will pay for you all.', '«For you all» звучит странно: «I\'ll pay for both of us».'], ['Okay, you pay and I am happy.', 'Звучит как требование, не шутка.']] }
    ]
  },
  {
    id: 'london', title: 'Поездка в Лондон', sub: 'Метро, карты и чай в Ritz', lvl: 'B1', emoji: '🇬🇧', cost: 50,
    steps: [
      { him: 'Welcome to London! How was your flight?', ru: 'Добро пожаловать в Лондон! Как перелёт?',
        opts: [["Pretty smooth, but I'm a bit jet-lagged.", '«Jet-lagged» — уставший от смены часовых поясов.'], ['My flight was flying good.', 'Нужно «The flight was good».'], ["I am tired from the airplane's flight.", 'Неестественно, лучше «jet-lagged».']] },
      { him: 'Shall we take the Tube or grab a cab?', ru: 'Поедем на метро или возьмём такси?',
        opts: [["Let's take the Tube — it's cheaper and quicker.", 'The Tube — лондонское метро.'], ['Let us ride on metro of London.', 'В Лондоне говорят «the Tube» или «Underground».'], ['I will go by my legs.', 'Пешком — «on foot».']] },
      { him: 'Mind the gap! Do you have your Oyster card?', ru: 'Осторожно, щель! У тебя есть карта Oyster?',
        opts: [['Not yet. Where can I top one up?', 'Oyster — карта проезда, «top up» — пополнить.'], ['No, I am not having oyster.', 'Нужно «I don\'t have one».'], ['Oyster? I only eat it.', 'Шутка, но вопрос остался без ответа.']] },
      { him: 'Fancy tea at the Ritz tomorrow?', ru: 'Как насчёт чая в Ritz завтра?',
        opts: [["I'd love to! It's a classic London experience.", '«I\'d love to» — вежливое «с удовольствием».'], ['Yes, I fancy to drink tea.', '«Fancy» без «to»: «I fancy a cup of tea».'], ['Tea at Ritz is for me nice.', 'Нарушен порядок слов.']] }
    ]
  },
  {
    id: 'talk', title: 'Трудный разговор', sub: 'Как мириться и не обижать', lvl: 'B2', emoji: '🕊️', cost: 80,
    steps: [
      { him: "I'm sorry about last night. I didn't mean to snap at you.", ru: 'Прости за вчерашнее. Я не хотел на тебя срываться.',
        opts: [["It's okay. I appreciate you saying that.", 'Принимает извинение и благодарит за него.'], ['No problem, you are forgiven by me.', 'Слишком театрально и канцелярски.'], ["It's not okay, you always do this.", '«Always» разжигает конфликт.']] },
      { him: "I just felt like you weren't listening.", ru: 'Мне просто казалось, что ты меня не слушаешь.',
        opts: [["I hear you. I'll try to be more present.", '«I hear you» — признаю твои чувства.'], ["I was listened, you didn't see.", 'Страдательный залог здесь неверен.'], ['You are exaggerating.', 'Обесценивает чувства собеседника.']] },
      { him: 'Can we talk it through calmly?', ru: 'Можем спокойно всё обсудить?',
        opts: [["Of course. Let's start fresh and be honest.", 'Готовность и конструктивный тон.'], ['Talk it through is not needed.', 'Прозвучит как отказ.'], ['Calm down first, then maybe.', 'Грубовато и снисходительно.']] },
      { him: 'Thanks for giving me another chance.', ru: 'Спасибо, что даёшь мне ещё один шанс.',
        opts: [['We all make mistakes. Let us move on together.', '«Move on» — идти дальше, не застревая в обиде.'], ['You are lucky that I stay.', 'Манипулятивно.'], ["Chance is not given, it's taken.", 'Не по теме, звучит странно.']] }
    ]
  }
];

const MEMES = [
  { phrase: 'ghosting', emoji: '👻', top: 'He said “let’s meet soon”', bottom: '…and then disappeared', g: ['#3a1c6e', '#8a3c9e'],
    q: 'Что значит «ghosting»?', opts: ['Резко пропасть и не отвечать', 'Встречаться с призраками', 'Красить волосы в белый'],
    ru: 'Ghosting — когда человек внезапно перестаёт отвечать и исчезает без объяснений.', en: 'He ghosted me after two dates.' },
  { phrase: 'no cap', emoji: '🧢', top: 'This pizza is the best ever', bottom: 'no cap', g: ['#0e4a6e', '#1d9bb0'],
    q: 'Что значит «no cap»?', opts: ['Без шуток, честно', 'Без шапки', 'Без сахара'],
    ru: '«Cap» — это враньё. «No cap» значит «без вранья, честно».', en: 'No cap, that was the best concert of my life.' },
  { phrase: 'touch grass', emoji: '🌱', top: 'Me after 14 hours online', bottom: 'Friend: go touch grass', g: ['#134a2a', '#5bb04a'],
    q: 'Что советуют фразой «touch grass»?', opts: ['Выйти из интернета и пройтись', 'Заняться садоводством', 'Купить газонокосилку'],
    ru: 'Шутливый совет оторваться от экрана и выйти на улицу.', en: 'You’ve been gaming all weekend. Go touch grass.' },
  { phrase: 'spill the tea', emoji: '☕', top: 'Wait, you know something?', bottom: 'Spill the tea!', g: ['#6e3a14', '#d49a4a'],
    q: 'Что значит «spill the tea»?', opts: ['Рассказать сплетню', 'Пролить чай', 'Заварить чай'],
    ru: 'Выдать свежую сплетню или интересные новости.', en: 'Come on, spill the tea about your date!' },
  { phrase: 'red flag', emoji: '🚩', top: 'He’s rude to the waiter', bottom: 'Big red flag', g: ['#6e1414', '#d4452a'],
    q: 'Что значит «red flag» о человеке?', opts: ['Тревожный сигнал', 'Он любит красный цвет', 'Он болеет за сборную'],
    ru: 'Красный флаг — признак, что с человеком или отношениями что-то не так.', en: 'Lying about small things is a red flag.' },
  { phrase: 'rent free', emoji: '🏠', top: 'That song from yesterday', bottom: 'Living in my head rent free', g: ['#14306e', '#4a6ad4'],
    q: 'Что значит «live in my head rent free»?', opts: ['Постоянно крутится в голове', 'Снимаю жильё бесплатно', 'Я сдаю голову в аренду'],
    ru: 'О мысли или человеке, которые бесплатно «живут» в вашей голове и не уходят.', en: 'Her laugh lives in my head rent free.' },
  { phrase: 'FOMO', emoji: '📱', top: 'Everyone is at the party', bottom: 'I’m home. FOMO.', g: ['#2a1a4a', '#c43a8a'],
    q: 'Что такое «FOMO»?', opts: ['Страх что-то упустить', 'Название приложения', 'Любовь к еде'],
    ru: 'Fear Of Missing Out — тревога, что другие веселятся, а вы пропускаете.', en: 'I went out just because of FOMO.' },
  { phrase: 'salty', emoji: '🧂', top: 'Lost the game', bottom: 'Why so salty?', g: ['#3a3a4a', '#8a9aaa'],
    q: 'Что значит «salty» о человеке?', opts: ['Раздражённый, обиженный', 'Любит солёное', 'Очень богатый'],
    ru: 'Salty — злой или обиженный, часто из-за проигрыша или критики.', en: 'He’s still salty about losing.' },
  { phrase: "I can't even", emoji: '😵', top: 'That cat video', bottom: "I can't even", g: ['#6e1450', '#d45a9a'],
    q: 'Что выражает «I can’t even»?', opts: ['Нет слов от эмоций', 'Я не умею чётные числа', 'Я не могу уснуть'],
    ru: 'Эмоции зашкаливают — смешно, мило или возмутительно, и слов не хватает.', en: 'She did what?! I can’t even.' },
  { phrase: 'slay', emoji: '💅', top: 'New outfit, new me', bottom: 'You slay!', g: ['#4a1470', '#d49aff'],
    q: 'Что значит «You slay!»?', opts: ['Ты великолепна, блестяще!', 'Ты всех победила в бою', 'Ты опоздала'],
    ru: 'Похвала: выглядишь или справилась просто блестяще.', en: 'That presentation? You absolutely slayed.' }
];
