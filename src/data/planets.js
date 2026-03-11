export const moon = {
	id: 'moon',
	name: 'Луна',
	subtitle: 'Единственный естественный спутник ЗЕМЛИ',
	image: '/img/planets/themoon.png',
	hasEarth: true,
	temp: -61,
	distance: 384400,
	tours: ['По следам Апполона-11'],
	facts: [
		{
			icon: 'rover.svg',
			title: 'Обитатели',
			description: 'Один активный китайский луноход Yutu-2',
		},
		{
			icon: 'temp.svg',
			title: 'Переменчивая температура',
			description:
				'От +127 °C днём у экватора до -249 °C в затенённых кратерах',
		},
		{
			icon: 'ruler.svg',
			title: 'Площадь: 38 млн км²',
			description: 'Примерно в 2,2 раза больше площади России',
		},
	],
	score: 1.8,
	modalDesc: '',
	stats: {
		climate: 10,
		temperature: 45,
		distance: 5
	},
}

export const planets = [
	{
		id: 'mercury',
		name: 'Меркурий',
		subtitle: 'Первая и самая маленькая планета солнечной системы',
		image: '/img/planets/merkurij.png',
		temp: 125,
		distance: 91700000,
		tours: ['Ближе некуда'],
		facts: [
			{
				icon: 'holes.svg',
				title: 'Обитатели',
				description: 'Гигантские кратеры',
			},
			{
				icon: 'temp.svg',
				title: 'Температура',
				description: 'От -180°C до +430°C',
			},
			{
				icon: 'ruler.svg',
				title: 'Близость',
				description: 'Самая близкая к солнцу планета',
			},
		],
		score: 6.5,
		modalDesc: '',
		stats: {
			climate: 80,
			temperature: 95,
			distance: 40
		},
		tourImage: '/img/tours/merkurij_tour.svg'
	},
	{
		id: 'venus',
		name: 'Венера',
		subtitle: 'Вторая и самая горячая планета солнечной системы',
		image: '/img/planets/venera.svg',
		temp: 460,
		distance: 41400000,
		tours: ['Золотая завеса'],
		facts: [
			{
				icon: 'cloud.svg',
				title: 'Обитатели',
				description: 'Сернокислотные облака и дожди из кислоты',
			},
			{
				icon: 'temp.svg',
				title: 'Самая жаркая планета',
				description: 'Температура в среднем +460°C',
			},
			{
				icon: 'reverse.svg',
				title: 'Вращение в обратном направлении',
				description: 'Солнце встает на западе, а заходит на востоке',
			},
		],
		score: 8.6,
		modalDesc: '',
		stats: {
			climate: 100,
			temperature: 100,
			distance: 35
		},
	},
	{
		id: 'earth',
		name: 'Земля',
		subtitle: 'Ваше местоположение',
		showPin: true,
		image: '/img/planets/theEarth.svg',
		hasMoon: true,
		temp: 15,
		distance: 0,
		tours: ['Полюс холода. Оймякон', 'Станция восток'],
		facts: [
			{
				icon: 'human.svg',
				title: 'Обитатели',
				description: '8 272 345 242 человек',
				counter: true,
			},
			{
				icon: 'temp.svg',
				title: 'Лучшая для жизни планета',
				description: 'Температура всреднем 15°C',
			},
			{
				icon: 'messages.svg',
				title: 'Языки',
				description:
					'普通话, English, हिन्दी, Русский, العربية, Español, Português, 日本語, Français, বাংলা, Deutsch......',
			},
		],
		score: 0,
		modalDesc: '',
		stats: {
			climate: 15,
			temperature: 55,
			distance: 0
		},
	},
	{
		id: 'mars',
		name: 'Марс',
		subtitle: 'Четвёртая и самая исследуемая планета солнечной системы',
		image: '/img/planets/mars.svg',
		temp: -60,
		distance: 78300000,
		tours: ['Сафари на марсоходах', 'Фотоохота на марсиан'],
		facts: [
			{
				icon: 'rover.svg',
				title: 'Обитатели',
				description: '2 активных марсохода NASA',
			},
			{
				icon: 'temp.svg',
				title: 'Температура',
				description: 'В среднем -60°C',
			},
			{ icon: 'alien.svg', title: 'Языки', description: '⋔⏃⍀⌇⟟⏃⋏⌇☍⟟⊬' },
		],
		score: 2.8,
		modalDesc: '',
		stats: {
			climate: 45,
			temperature: 65,
			distance: 55
		},
	},
	{
		id: 'jupiter',
		name: 'Юпитер',
		subtitle: 'Пятая и самая большая планета солнечной системы',
		image: '/img/planets/jupiter.svg',
		temp: -130,
		distance: 628700000,
		tours: ['Вихрь гигантов'],
		facts: [
			{
				icon: 'cloud.svg',
				title: 'Обитатели',
				description: 'Гигантское пятно мощнейшего урагана',
			},
			{
				icon: 'temp.svg',
				title: 'Температура',
				description: 'В среднем -130°C',
			},
			{
				icon: 'children.svg',
				title: 'Многодетная планета',
				description: 'Имеет 95 спутников и уступает лишь Сатурну',
			},
		],
		score: 7.8,
		modalDesc: '',
		stats: {
			climate: 95,
			temperature: 70,
			distance: 75
		},
	},
	{
		id: 'saturn',
		name: 'Сатурн',
		subtitle: 'Шестая планета солнечной системы с самой маленькой плотностью',
		image: '/img/planets/saturn.png',
		temp: -180,
		distance: 1275000000,
		tours: ['Кольцевая линия'],
		facts: [
			{
				icon: 'circle.svg',
				title: 'Обитатели',
				description: 'Гигантское кольцо льда',
			},
			{
				icon: 'temp.svg',
				title: 'Температура',
				description: 'В среднем -180°C',
			},
			{
				icon: 'light.svg',
				title: 'Масса и плотность',
				description:
					'Масса больше Земли в 95 раз, а плотность в 1.5 раза меньше чем плотность воды',
			},
			{
				icon: 'children.svg',
				title: '274 спутника',
				description:
					'Это больше, чем у всех вместе взятых планет солнечной системы',
			},
		],
		score: 7.2,
		modalDesc: '',
		stats: {
			climate: 90,
			temperature: 80,
			distance: 85
		},
	},
	{
		id: 'uranus',
		name: 'Уран',
		subtitle: 'Седьмая и самая холодная планета солнечной системы',
		image: '/img/planets/uran.png',
		temp: -224,
		distance: 2724000000,
		tours: ['Алмазный дождь', 'Ледяной штиль'],
		facts: [
			{
				icon: 'crystal.svg',
				title: 'Обитатели',
				description: 'Холодные кристаллы метана',
			},
			{
				icon: 'temp.svg',
				title: 'Самая холодная планета',
				description: 'В среднем -224°C',
			},
		],
		score: 7.7,
		modalDesc: '',
		stats: {
			climate: 85,
			temperature: 90,
			distance: 95
		},
	},
	{
		id: 'neptune',
		name: 'Нептун',
		subtitle: 'Восьмая и самая удалённая от солнца',
		image: '/img/planets/neptun.png',
		temp: -220,
		distance: 4351000000,
		tours: ['Синий предел'],
		facts: [
			{
				icon: 'wind.svg',
				title: 'Обитатели',
				description: 'Сверхзвуковые ветры до 2100 км/ч',
			},
			{
				icon: 'temp.svg',
				title: 'Температура',
				description: 'В среднем -220°C',
			},
		],
		score: 8.4,
		modalDesc: '',
		stats: {
			climate: 95,
			temperature: 95,
			distance: 100
		},
	},
	{
		id: 'pluto',
		name: 'Плутон',
		subtitle: 'Карликовая планета',
		image: '/img/planets/pluton.png',
		temp: -230,
		distance: 5906000000,
		tours: [],
	},
]
