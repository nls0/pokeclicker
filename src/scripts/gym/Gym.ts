///<reference path="GymPokemon.ts"/>
///<reference path="../pokemons/PokemonFactory.ts"/>
///<reference path="../achievements/OneFromManyRequirement.ts"/>
///<reference path="../badgeCase/BadgeTypes.ts"/>

/**
 * Data list that contains all gymLeaders, accessible by townName.
 */
const gymList: { [townName: string]: Gym } = {};

/**
 * Gym class.
 */
class Gym {
    constructor(
        public leaderName: string,
        public town: string,
        public pokemons: GymPokemon[],
        public badgeReward: BadgeTypes,
        public moneyReward: number,
        public defeatMessage: string,
        public requirements: (OneFromManyRequirement | Requirement)[] = [],
        public rewardFunction = () => {}
    ) {}

    public static isUnlocked(gym: Gym): boolean {
        return gym.requirements.every(requirement => requirement.isCompleted());
    }

    public static calculateCssClass(gym: Gym): KnockoutComputed<string> {
        return ko.pureComputed(() => {
            if (App.game.badgeCase.hasBadge(gym.badgeReward)) {
                return 'btn btn-success';
            }
            return 'btn btn-secondary';
        });
    }

    public static getLeaderByBadge(badge: BadgeTypes): string {
        for (const item in gymList) {
            const gym = gymList[item];
            if (BadgeTypes[gym.badgeReward] == BadgeTypes[BadgeTypes[badge]]) {
                return gym.leaderName;
            }
        }
        return 'Brock';
    }

    public firstWinReward() {
        // Give the player this gyms badge
        App.game.badgeCase.gainBadge(this.badgeReward);
        // Show the badge modal
        $('#receiveBadgeModal').modal('show');
        // Run the first time reward function
        this.rewardFunction();
    }
}

// Kanto Gyms
gymList['Pewter City'] = new Gym(
    'Brock',
    'Pewter City',
    [
        new GymPokemon('Geodude', 770, 12),
        new GymPokemon('Onix', 1554, 14),
    ],
    BadgeTypes.Boulder,
    250,
    'I took you for granted, and so I lost. As proof of your victory, I confer on you this...the official Pokémon League Boulder Badge.',
    [new RouteKillRequirement(10, 2)]
);

gymList['Cerulean City'] = new Gym(
    'Misty',
    'Cerulean City',
    [
        new GymPokemon('Staryu', 4000, 18),
        new GymPokemon('Starmie', 6800, 21),
    ],
    BadgeTypes.Cascade,
    500,
    "Wow! You're too much, all right! You can have the Cascade Badge to show that you beat me.",
    [new RouteKillRequirement(10, 4)]
);
gymList['Vermillion City'] = new Gym(
    'Lt. Surge',
    'Vermillion City',
    [
        new GymPokemon('Voltorb', 10780, 21),
        new GymPokemon('Pikachu', 13540, 18),
        new GymPokemon('Raichu', 15675, 24),
    ],
    BadgeTypes.Thunder,
    1000,
    "Now that's a shocker! You're the real deal, kid! Fine, then, take the Thunder Badge!",
    [
        new RouteKillRequirement(10, 6),
        new GymBadgeRequirement(BadgeTypes.Cascade),
    ]
);
gymList['Celadon City'] = new Gym(
    'Erika',
    'Celadon City',
    [
        new GymPokemon('Victreebel', 38810, 29),
        new GymPokemon('Tangela', 30340, 24),
        new GymPokemon('Vileplume', 36400, 29),
    ],
    BadgeTypes.Rainbow,
    1500,
    'Oh! I concede defeat. You are remarkably strong. I must confer on you the Rainbow Badge.',
    [new RouteKillRequirement(10, 8)]
);
gymList['Saffron City'] = new Gym(
    'Sabrina',
    'Saffron City',
    [
        new GymPokemon('Kadabra', 23040, 38),
        new GymPokemon('Mr. Mime', 25600, 37),
        new GymPokemon('Venomoth', 28400, 38),
        new GymPokemon('Alakazam', 35380, 43),
    ],
    BadgeTypes.Marsh,
    2500,
    'This loss shocks me! But a loss is a loss. I admit I didn\'t work hard enough to win. You earned the Marsh Badge.',
    [new GymBadgeRequirement(BadgeTypes.Rainbow)]
);
gymList['Fuchsia City'] = new Gym(
    'Koga',
    'Fuchsia City',
    [
        new GymPokemon('Koffing', 30780, 38),
        new GymPokemon('Muk', 32460, 37),
        new GymPokemon('Koffing', 36540, 38),
        new GymPokemon('Weezing', 37430, 43),
    ],
    BadgeTypes.Soul,
    3500,
    'Humph! You have proven your worth! Here! Take the Soul Badge!',
    [
        new OneFromManyRequirement([
            new RouteKillRequirement(10, 18),
            new RouteKillRequirement(10, 15),
        ]),
    ],
    () => {
        App.game.quests.getQuestLine('Mining Expedition').beginQuest();
    }
);
gymList['Cinnabar Island'] = new Gym(
    'Blaine',
    'Cinnabar Island',
    [
        new GymPokemon('Growlithe', 37430, 42),
        new GymPokemon('Ponyta', 42340, 40),
        new GymPokemon('Rapidash', 45230, 42),
        new GymPokemon('Arcanine', 50290, 47),
    ],
    BadgeTypes.Volcano,
    5000,
    'I have burned down to nothing! Not even ashes remain! You have earned the Volcano Badge.',
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Pokemon Mansion'))]
);
gymList['Viridian City'] = new Gym(
    'Giovanni',
    'Viridian City',
    [
        new GymPokemon('Rhyhorn', 45230, 45),
        new GymPokemon('Dugtrio', 47530, 42),
        new GymPokemon('Nidoqueen', 48740, 44),
        new GymPokemon('Nidoking', 48350, 45),
        new GymPokemon('Rhydon', 55000, 50),
    ],
    BadgeTypes.Earth,
    6000,
    'Ha! That was a truly intense fight. You have won! As proof, here is the Earth Badge!',
    [
        new GymBadgeRequirement(BadgeTypes.Volcano),
        new GymBadgeRequirement(BadgeTypes.Marsh),
        new GymBadgeRequirement(BadgeTypes.Thunder),
    ]
);

// Kanto Elite 4
gymList['Elite Lorelei'] = new Gym(
    'Lorelei',
    'Elite Lorelei',
    [
        new GymPokemon('Dewgong', 45330, 52),
        new GymPokemon('Cloyster', 48300, 51),
        new GymPokemon('Slowbro', 52000, 52),
        new GymPokemon('Jynx', 57000, 54),
        new GymPokemon('Lapras', 60250, 54),
    ],
    BadgeTypes.Elite_Lorelei,
    7500,
    '...Things shouldn\'t be this way!',
    [new GymBadgeRequirement(BadgeTypes.Earth)]
);
gymList['Elite Bruno'] = new Gym(
    'Bruno',
    'Elite Bruno',
    [
        new GymPokemon('Onix', 45330, 51),
        new GymPokemon('Hitmonchan', 48300, 53),
        new GymPokemon('Hitmonlee', 52000, 53),
        new GymPokemon('Onix', 57000, 54),
        new GymPokemon('Machamp', 60250, 56),
    ],
    BadgeTypes.Elite_Bruno,
    7500,
    'Why? How could I lose?',
    [new GymBadgeRequirement(BadgeTypes.Elite_Lorelei)]
);
gymList['Elite Agatha'] = new Gym(
    'Agatha',
    'Elite Agatha',
    [
        new GymPokemon('Gengar', 45330, 54),
        new GymPokemon('Golbat', 48300, 54),
        new GymPokemon('Haunter', 52000, 53),
        new GymPokemon('Arbok', 57000, 56),
        new GymPokemon('Gengar', 60250, 58),
    ],
    BadgeTypes.Elite_Agatha,
    7500,
    'Oh, my! You\'re something special, child!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Bruno)]
);
gymList['Elite Lance'] = new Gym(
    'Lance',
    'Elite Lance',
    [
        new GymPokemon('Gyarados', 48300, 56),
        new GymPokemon('Dragonair', 52000, 54),
        new GymPokemon('Dragonair', 57000, 54),
        new GymPokemon('Aerodactyl', 60250, 58),
        new GymPokemon('Dragonite', 66000, 60),
    ],
    BadgeTypes.Elite_Lance,
    7500,
    'That’s it! I hate to admit it, but you are a Pokémon master!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Agatha)]
);
//TODO make champion Gym

//Johto Gyms
gymList['Violet City'] = new Gym(
    'Falkner',
    'Violet City',
    [
        new GymPokemon('Pidgey', 108000, 9),
        new GymPokemon('Pidgeotto', 112000, 13),
    ],
    BadgeTypes.Zephyr,
    250,
    '...For pity\'s sake! My dad\'s cherished bird Pokémon... But a defeat is a defeat. All right. Take this official Pokémon League Badge. This one is the Zephyr Badge.',
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Sprout Tower'))]
);
gymList['Azalea Town'] = new Gym(
    'Bugsy',
    'Azalea Town',
    [
        new GymPokemon('Metapod', 103000, 15),
        new GymPokemon('Kakuna', 101500, 15),
        new GymPokemon('Scyther', 119000, 17),
    ],
    BadgeTypes.Hive,
    500,
    'Whoa, amazing! You\'re an expert on Pokémon! My research isn\'t complete yet. OK, you win. Take this Hive Badge.',
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Slowpoke Well'))]
);
gymList['Goldenrod City'] = new Gym(
    'Whitney',
    'Goldenrod City',
    [
        new GymPokemon('Clefairy', 130000, 17),
        new GymPokemon('Miltank', 170000, 19),
    ],
    BadgeTypes.Plain,
    1000,
    '...Sniff... What? What do you want? A badge? Oh, right. I forgot. Here\'s the Plain Badge.',
    [new RouteKillRequirement(10, 34)]
);
gymList['Ecruteak City'] = new Gym(
    'Morty',
    'Ecruteak City',
    [
        new GymPokemon('Gastly', 127000, 21),
        new GymPokemon('Haunter', 128000, 21),
        new GymPokemon('Haunter', 130000, 23),
        new GymPokemon('Gengar', 132000, 25),
    ],
    BadgeTypes.Fog,
    1500,
    'I see... Your journey has taken you to far-away places. And you have witnessed much more than me. I envy you for that... Here is the Fog Badge..',
    [new GymBadgeRequirement(BadgeTypes.Plain)]
);
gymList['Cianwood City'] = new Gym(
    'Chuck',
    'Cianwood City',
    [
        new GymPokemon('Primeape', 177000, 29),
        new GymPokemon('Poliwrath', 183000, 31),
    ],
    BadgeTypes.Storm,
    2500,
    'Here is the Storm Badge. Wahahah! I enjoyed battling you! But a loss is a loss! From now on, I\'m going to train 24 hours a day!',
    [new GymBadgeRequirement(BadgeTypes.Fog)]
);
gymList['Olivine City'] = new Gym(
    'Jasmine',
    'Olivine City',
    [
        new GymPokemon('Magnemite', 177000, 30),
        new GymPokemon('Magnemite', 178000, 30),
        new GymPokemon('Steelix', 182000, 35),
    ],
    BadgeTypes.Mineral,
    3500,
    '...You are a better Trainer than me, in both skill and kindness. In accordance with League rules, I confer upon you this Mineral Badge.',
    [new GymBadgeRequirement(BadgeTypes.Storm)]
);
gymList['Mahogany Town'] = new Gym(
    'Pryce',
    'Mahogany Town',
    [
        new GymPokemon('Seel', 190000, 30),
        new GymPokemon('Dewgong', 192500, 32),
        new GymPokemon('Piloswine', 196000, 34),
    ],
    BadgeTypes.Glacier,
    4000,
    'I am impressed by your prowess. With your strong will, I know you will overcome all life\'s obstacles. You are worthy of this Glacier Badge!',
    [new RouteKillRequirement(10, 43)]
);
gymList['Blackthorn City'] = new Gym(
    'Clair',
    'Blackthorn City',
    [
        new GymPokemon('Dragonair', 205000, 38),
        new GymPokemon('Dragonair', 205000, 38),
        new GymPokemon('Gyarados', 218000, 38),
        new GymPokemon('Kingdra', 220000, 41),
    ],
    BadgeTypes.Rising,
    5000,
    'Here, this is the Rising Badge... Hurry up! Take it!',
    [new GymBadgeRequirement(BadgeTypes.Glacier)]
);

//Johto Elite 4
gymList['Elite Will'] = new Gym(
    'Will',
    'Elite Will',
    [
        new GymPokemon('Xatu', 245330, 40),
        new GymPokemon('Jynx', 248300, 41),
        new GymPokemon('Exeggutor', 252000, 41),
        new GymPokemon('Slowbro', 257000, 41),
        new GymPokemon('Xatu', 260250, 42),
    ],
    BadgeTypes.Elite_Will,
    7500,
    'Even though I was defeated, I won\'t change my course. I will continue battling until I stand above all Trainers! Now move on and experience the true ferocity of the Elite Four.',
    [new GymBadgeRequirement(BadgeTypes.Rising)]
);
gymList['Elite Koga'] = new Gym(
    'Koga2',
    'Elite Koga',
    [
        new GymPokemon('Ariados', 245330, 40),
        new GymPokemon('Venomoth', 248300, 41),
        new GymPokemon('Forretress', 252000, 43),
        new GymPokemon('Muk', 257000, 42),
        new GymPokemon('Crobat', 260250, 44),
    ],
    BadgeTypes.Elite_Koga,
    7500,
    'I subjected you to everything I could muster. But my efforts failed. I must hone my skills. Go on to the next room, and put your abilities to the test!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Will)]
);
gymList['Elite Bruno2'] = new Gym(
    'Bruno2',
    'Elite Bruno2',
    [
        new GymPokemon('Hitmontop', 245330, 42),
        new GymPokemon('Hitmonlee', 248300, 42),
        new GymPokemon('Hitmonchan', 252000, 42),
        new GymPokemon('Onix', 257000, 43),
        new GymPokemon('Machamp', 260250, 46),
    ],
    BadgeTypes.Elite_Bruno2,
    7500,
    'Having lost, I have no right to say anything… Go face your next challenge!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Koga)]
);
gymList['Elite Karen'] = new Gym(
    'Karen',
    'Elite Karen',
    [
        new GymPokemon('Umbreon', 248300, 42),
        new GymPokemon('Vileplume', 252000, 42),
        new GymPokemon('Gengar', 257000, 45),
        new GymPokemon('Murkrow', 260250, 44),
        new GymPokemon('Houndoom', 266000, 47),
    ],
    BadgeTypes.Elite_Karen,
    7500,
    'Strong Pokémon. Weak Pokémon. That is only the selfish perception of people. Truly skilled Trainers should try to win with the Pokémon they love best. I like your style. You understand what\'s important. Go on — — the Champion is waiting.',
    [new GymBadgeRequirement(BadgeTypes.Elite_Bruno2)]
);
gymList['Champion Lance'] = new Gym(
    'Lance2',
    'Champion Lance',
    [
        new GymPokemon('Gyarados', 258300, 44),
        new GymPokemon('Dragonite', 262000, 49),
        new GymPokemon('Dragonite', 264000, 49),
        new GymPokemon('Aerodactyl', 260250, 48),
        new GymPokemon('Dragonite', 270000, 50),
    ],
    BadgeTypes.Elite_JohtoChampion,
    7500,
    '…It\'s over. But it\'s an odd feeling. I\'m not angry that I lost. In fact, I feel happy. Happy that I witnessed the rise of a great new Champion!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Karen)]
);

// Hoenn Gyms
gymList['Rustboro City'] = new Gym(
    'Roxanne',
    'Rustboro City',
    [
        new GymPokemon('Geodude', 282900, 12),
        new GymPokemon('Geodude', 282900, 12),
        new GymPokemon('Nosepass', 310200, 15),
    ],
    BadgeTypes.Stone,
    1000,
    'So… I lost… It seems that I still have much more to learn… I understand.',
    [new GymBadgeRequirement(BadgeTypes.Elite_JohtoChampion)]
);
gymList['Dewford Town'] = new Gym(
    'Brawly',
    'Dewford Town',
    [
        new GymPokemon('Machop', 324000, 17),
        new GymPokemon('Meditite', 324000, 18),
        new GymPokemon('Makuhita', 344000, 19),
    ],
    BadgeTypes.Knuckle,
    2000,
    'Whoah, wow! You made a much bigger splash than I expected! You swamped me! Okay, you\'ve got me. Take this Gym Badge!',
    []
);
gymList['Mauville City'] = new Gym(
    'Wattson',
    'Mauville City',
    [
        new GymPokemon('Voltorb', 352000, 20),
        new GymPokemon('Electrike', 348000, 20),
        new GymPokemon('Magneton', 383000, 22),
        new GymPokemon('Manectric', 348000, 24),
    ],
    BadgeTypes.Dynamo,
    3000,
    'Wahahahah! Fine, I lost! You ended up giving me a thrill! Take this Badge!',
    []
);
gymList['Lavaridge Town'] = new Gym(
    'Flannery',
    'Lavaridge Town',
    [
        new GymPokemon('Numel', 372000, 24),
        new GymPokemon('Slugma', 372000, 24),
        new GymPokemon('Camerupt', 392000, 26),
        new GymPokemon('Torkoal', 424000, 28),
    ],
    BadgeTypes.Heat,
    4000,
    'Oh... I guess I was trying too hard... I... I\'ve only recently become a Gym Leader. I tried too hard to be someone I\'m not. I have to do things my natural way. If I don\'t, my Pokémon will be confused. Thanks for teaching me that. For that, you deserve this.',
    []
);
gymList['Petalburg City'] = new Gym(
    'Norman',
    'Petalburg City',
    [
        new GymPokemon('Spinda', 390000, 27),
        new GymPokemon('Vigoroth', 430000, 30),
        new GymPokemon('Linoone', 460000, 29),
        new GymPokemon('Slaking', 496000, 31),
    ],
    BadgeTypes.Balance,
    5000,
    '… I… I can\'t… I can\'t believe it. I lost to you? But, rules are rules! Here, take this.',
    [new GymBadgeRequirement(BadgeTypes.Heat)]
);
gymList['Fortree City'] = new Gym(
    'Winona',
    'Fortree City',
    [
        new GymPokemon('Swablu', 405000, 29),
        new GymPokemon('Tropius', 450000, 29),
        new GymPokemon('Pelipper', 430000, 30),
        new GymPokemon('Skarmory', 467000, 32),
        new GymPokemon('Altaria', 469000, 33),
    ],
    BadgeTypes.Feather,
    6000,
    'Never before have I seen a Trainer command Pokémon with more grace than I... In recognition of your prowess, I present to you this Gym Badge.',
    []
);
gymList['Mossdeep City'] = new Gym(
    'Tate & Liza',
    'Mossdeep City',
    [
        new GymPokemon('Xatu', 502000, 41),
        new GymPokemon('Claydol', 503000, 41),
        new GymPokemon('Lunatone', 502000, 42),
        new GymPokemon('Solrock', 503000, 42),
    ],
    BadgeTypes.Mind,
    8000,
    'What? Our combination... Was shattered! It can\'t be helped. You\'ve won... So, in recognition, take this Gym Badge.',
    []
);
gymList['Sootopolis City'] = new Gym(
    'Juan',
    'Sootopolis City',
    [
        new GymPokemon('Luvdisc', 498000, 41),
        new GymPokemon('Whiscash', 513000, 41),
        new GymPokemon('Sealeo', 523400, 43),
        new GymPokemon('Crawdaunt', 542000, 43),
        new GymPokemon('Kingdra', 565000, 46),
    ],
    BadgeTypes.Rain,
    10000,
    'I realize now your authenticity and magnificence as a Pokémon Trainer. I find much joy in having met you and your Pokémon. You have proven yourself worthy of the Rain Badge. Accept it. Having that Badge assures you full obedience of all your Pokémon to every command you make.',
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Sky Pillar'))]
);

// Hoenn Elite 4
gymList['Elite Sidney'] = new Gym(
    'Sidney',
    'Elite Sidney',
    [
        new GymPokemon('Mightyena', 572000, 46),
        new GymPokemon('Cacturne', 580000, 46),
        new GymPokemon('Shiftry', 602000, 48),
        new GymPokemon('Sharpedo', 615000, 48),
        new GymPokemon('Absol', 620000, 49),
    ],
    BadgeTypes.Elite_Sidney,
    15000,
    'Well, how do you like that? I lost! Eh, it was fun, so it doesn\'t matter.',
    [new GymBadgeRequirement(BadgeTypes.Rain)]
);
gymList['Elite Phoebe'] = new Gym(
    'Phoebe',
    'Elite Phoebe',
    [
        new GymPokemon('Dusclops', 636700, 48),
        new GymPokemon('Banette', 638000, 49),
        new GymPokemon('Banette', 638000, 49),
        new GymPokemon('Sableye', 652000, 50),
        new GymPokemon('Dusclops', 663000, 51),
    ],
    BadgeTypes.Elite_Phoebe,
    15000,
    'Oh, darn. I\'ve gone and lost.',
    [new GymBadgeRequirement(BadgeTypes.Elite_Sidney)]
);
gymList['Elite Glacia'] = new Gym(
    'Glacia',
    'Elite Glacia',
    [
        new GymPokemon('Glalie', 672000, 50),
        new GymPokemon('Sealeo', 682000, 50),
        new GymPokemon('Glalie', 676000, 52),
        new GymPokemon('Sealeo', 686000, 52),
        new GymPokemon('Walrein', 700000, 53),
    ],
    BadgeTypes.Elite_Glacia,
    15000,
    'You and your Pokémon... How hot your spirits burn! The all-consuming heat overwhelms. It\'s no surprise that my icy skills failed to harm you.',
    [new GymBadgeRequirement(BadgeTypes.Elite_Phoebe)]
);
gymList['Elite Drake'] = new Gym(
    'Drake',
    'Elite Drake',
    [
        new GymPokemon('Shelgon', 664000, 52),
        new GymPokemon('Altaria', 672000, 54),
        new GymPokemon('Flygon', 676000, 53),
        new GymPokemon('Flygon', 676000, 53),
        new GymPokemon('Salamence', 757000, 55),
    ],
    BadgeTypes.Elite_Drake,
    15000,
    'You deserve every credit for coming this far as a Trainer of Pokémon. You do seem to know what is needed. Yes, what a Trainer needs is a virtuous heart. Pokémon touch the good hearts of Trainers and learn good from wrong. They touch the good hearts of Trainers and grow strong. Go! Go onwards! The Champion is waiting!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Glacia)]
);
gymList['Champion Wallace'] = new Gym(
    'Wallace',
    'Champion Wallace',
    [
        new GymPokemon('Wailord', 802000, 57),
        new GymPokemon('Tentacruel', 764000, 55),
        new GymPokemon('Ludicolo', 784000, 56),
        new GymPokemon('Whiscash', 772000, 56),
        new GymPokemon('Gyarados', 763000, 56),
        new GymPokemon('Milotic', 782000, 58),
    ],
    BadgeTypes.Elite_HoennChampion,
    15000,
    'I, the Champion, fall in defeat… That was wonderful work. You were elegant, infuriatingly so. And yet it was utterly glorious! Kudos to you! You are a truly noble Pokémon Trainer!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Drake)],
    () => {
        App.game.quests.getQuestLine('Mystery of Deoxys').beginQuest();
    }
);

//Sinnoh Gyms
gymList['Oreburgh City'] = new Gym(
    'Roark',
    'Oreburgh City',
    [
        new GymPokemon('Geodude', 938000, 12),
        new GymPokemon('Onix', 942000, 12),
        new GymPokemon('Cranidos', 942000, 14),
    ],
    BadgeTypes.Coal,
    2500,
    'This is embarrassing... I went and lost to a Trainer who didn\'t have a single Gym Badge... But that\'s tough. You were strong, and I was weak. That\'s all there is. According to Pokémon League rules, I have to give you our Gym Badge since you\'ve beaten me, the Leader. Heres your official Pokémon League Coal Badge.',
    [new GymBadgeRequirement(BadgeTypes.Elite_HoennChampion)]
);
gymList['Eterna City'] = new Gym(
    'Gardenia',
    'Eterna City',
    [
        new GymPokemon('Turtwig', 1033000, 20),
        new GymPokemon('Cherrim (overcast)', 1037500, 20),
        new GymPokemon('Roserade', 1039000, 22),
    ],
    BadgeTypes.Forest,
    5000,
    'I might\'ve said it before, but you\'re really tough! Wasn\'t it hard for you to raise your Pokémon to be so good? I guess that\'s a measure of how much you love your Pokémon. In recognition of that, I proudly grant you this!"',
    [new GymBadgeRequirement(BadgeTypes.Coal)]
);
gymList['Hearthome City'] = new Gym(
    'Fantina',
    'Hearthome City',
    [
        new GymPokemon('Duskull', 1050000, 24),
        new GymPokemon('Haunter', 1080000, 24),
        new GymPokemon('Mismagius', 1080000, 26),
    ],
    BadgeTypes.Relic,
    10000,
    'I am dumbfounded! So very, very strong! You, your Pokémon, so strong! Your power is admirable! I shall honor it with this Gym Badge!"',
    [new GymBadgeRequirement(BadgeTypes.Forest)]
);
gymList['Veilstone City'] = new Gym(
    'Maylene',
    'Veilstone City',
    [
        new GymPokemon('Meditite', 1137000, 28),
        new GymPokemon('Machoke', 1138000, 29),
        new GymPokemon('Lucario', 1140000, 32),
    ],
    BadgeTypes.Cobble,
    20000,
    '...OK. You win. That was a tough loss. I learned a lot from it. Please, accept this Gym Badge.',
    [new GymBadgeRequirement(BadgeTypes.Relic)]
);
gymList['Pastoria City'] = new Gym(
    'Crasher Wake',
    'Pastoria City',
    [
        new GymPokemon('Gyarados', 1187000, 33),
        new GymPokemon('Quagsire', 1193000, 34),
        new GymPokemon('Floatzel', 1193000, 37),
    ],
    BadgeTypes.Fen,
    40000,
    'It seems the undertow pulled me under... But I had a great time battling with you! You\'ve earned this!',
    [new GymBadgeRequirement(BadgeTypes.Cobble)]
);
gymList['Canalave City'] = new Gym(
    'Byron',
    'Canalave City',
    [
        new GymPokemon('Magneton', 1267000, 37),
        new GymPokemon('Steelix', 1272000, 38),
        new GymPokemon('Magnemite', 1268000, 41),
    ],
    BadgeTypes.Mine,
    80000,
    'You were strong enough to take down my prized team of Pokémon. In recognition of that power, I give you this: the Mine Badge!',
    [new GymBadgeRequirement(BadgeTypes.Fen)]
);
gymList['Snowpoint City'] = new Gym(
    'Candice',
    'Snowpoint City',
    [
        new GymPokemon('Sneasel', 1372500, 40),
        new GymPokemon('Piloswine', 1376000, 40),
        new GymPokemon('Abomasnow', 1370000, 42),
        new GymPokemon('Froslass', 1370000, 44),
    ],
    BadgeTypes.Icicle,
    16000,
    'Wow! You\'re great! You\'ve earned my respect! I think your focus and will bowled us over totally. Oh, that\'s right! I\'m supposed to give you this!',
    [new GymBadgeRequirement(BadgeTypes.Mine)]
);
gymList['Sunyshore City'] = new Gym(
    'Volkner',
    'Sunyshore City',
    [
        new GymPokemon('Jolteon', 1465000, 46),
        new GymPokemon('Raichu', 1465000, 46),
        new GymPokemon('Luxray', 1478000, 48),
        new GymPokemon('Electivire', 1480000, 50),
    ],
    BadgeTypes.Beacon,
    32000,
    '...Hehehe. Hahahah! ...That was the most fun I\'ve had in a battle since...I don\'t know when! It\'s also made me excited to know you and your team will keep battling to greater heights! This is your eighth Gym Badge. You\'ve earned this!',
    [new GymBadgeRequirement(BadgeTypes.Icicle)]
);

//Sinnoh Elite 4
gymList['Elite Aaron'] = new Gym(
    'Aaron',
    'Elite Aaron',
    [
        new GymPokemon('Yanmega', 1945330, 49),
        new GymPokemon('Scizor', 1948300, 49),
        new GymPokemon('Vespiquen', 1952000, 50),
        new GymPokemon('Heracross', 1957000, 51),
        new GymPokemon('Drapion', 1960250, 53),
    ],
    BadgeTypes.Elite_Aaron,
    64000,
    'I lost with the most beautiful and toughest of the bug Pokémon... We lost because I wasn\'t good enough... That\'s it! Back to training camp! Let\'s hear it for me! No... That was wrong... Anyway... Go on to the next room! Three Trainers are waiting for you. They are all tougher than me.',
    [new GymBadgeRequirement(BadgeTypes.Beacon)]
);
gymList['Elite Bertha'] = new Gym(
    'Bertha',
    'Elite Bertha',
    [
        new GymPokemon('Whiscash', 2045330, 50),
        new GymPokemon('Gliscor', 2048300, 53),
        new GymPokemon('Golem', 2052000, 52),
        new GymPokemon('Rhyperior', 2057000, 52),
        new GymPokemon('Hippowdon', 2060250, 55),
    ],
    BadgeTypes.Elite_Bertha,
    64000,
    'You\'re quite something, youngster. I like how you and your Pokémon earned the win by working as one. That\'s what makes you so strong. Ahahaha! I think that you can go as far as you want.',
    [new GymBadgeRequirement(BadgeTypes.Elite_Aaron)]
);
gymList['Elite Flint'] = new Gym(
    'Flint',
    'Elite Flint',
    [
        new GymPokemon('Houndoom', 2145330, 52),
        new GymPokemon('Flareon', 2148300, 55),
        new GymPokemon('Rapidash', 2152000, 53),
        new GymPokemon('Infernape', 2157000, 55),
        new GymPokemon('Magmortar', 2160250, 57),
    ],
    BadgeTypes.Elite_Flint,
    64000,
    '...! I don\'t believe it! I lost! I didn\'t take you for granted. Bud I\'d never even considered it! I\'m blown away by this! You and your Pokémon are hot stuff!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Bertha)]
);
gymList['Elite Lucian'] = new Gym(
    'Lucian',
    'Elite Lucian',
    [
        new GymPokemon('Mr. Mime', 2248300, 53),
        new GymPokemon('Espeon', 2252000, 55),
        new GymPokemon('Bronzong', 2257000, 54),
        new GymPokemon('Alakazam', 2260250, 56),
        new GymPokemon('Gallade', 2266000, 59),
    ],
    BadgeTypes.Elite_Lucian,
    64000,
    'Congratulations. You have beaten the Elite Four. However, that doesn\'t mean you\'re done with the Pokémon league. There remains the Champion. I should warn you—the Champion is far stronger than the Elite Four. Now, go on. Step through the doorway to your final battle.',
    [new GymBadgeRequirement(BadgeTypes.Elite_Flint)]
);
gymList['Champion Cynthia'] = new Gym(
    'Cynthia',
    'Champion Cynthia',
    [
        new GymPokemon('Spiritomb', 2458300, 58),
        new GymPokemon('Roserade', 2462000, 58),
        new GymPokemon('Togekiss', 2464000, 58),
        new GymPokemon('Lucario', 2460250, 60),
        new GymPokemon('Milotic', 2470000, 58),
        new GymPokemon('Garchomp', 2570000, 62),
    ],
    BadgeTypes.Elite_SinnohChampion,
    128000,
    'That was excellent. Truly, an outstanding battle. You gave the support your Pokémon needed to maximize their power. And you guided them with certainty to secure victory. You have both passion and calculating coolness. Together, you and your Pokémon can overcome any challenge that may come your way. Those are the impressions I got from our battle. I\'m glad I got to take part in the crowning of Sinnoh\'s new Champion! Come with me. We\'ll take the lift.',
    [new GymBadgeRequirement(BadgeTypes.Elite_Lucian)]
);

//Unova Gyms
//TODO: Balancing of gym Pokemon HP & rewards.
gymList['Aspertia City'] = new Gym(
    'Cheren',
    'Aspertia City',
    [
        new GymPokemon('Patrat', 2458300, 58),
        new GymPokemon('Pidove', 2462000, 58),
        new GymPokemon('Lillipup', 2464000, 58),
    ],
    BadgeTypes.Basic,
    128000,
    'That battle has made me feel really glad you were my first challenger as a Gym Leader… I give you this in honor of the strength you and your Pokémon showed!',
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Floccesy Ranch'))]
);
gymList['Virbank City'] = new Gym(
    'Roxie',
    'Virbank City',
    [
        new GymPokemon('Koffing', 2458300, 58),
        new GymPokemon('Grimer', 2462000, 58),
        new GymPokemon('Whirlipede', 2464000, 58),
    ],
    BadgeTypes.Toxic,
    128000,
    'Sigh! What are you doing losing, Roxie?! Well…I guess that means you\'re strong! This stinks, but I gave it everything I had, and I feel revitalized and refreshed now! Here! Proof that you beat me!',
    [new GymBadgeRequirement(BadgeTypes.Basic)]
);
gymList['Castelia City'] = new Gym(
    'Burgh',
    'Castelia City',
    [
        new GymPokemon('Dwebble', 2458300, 58),
        new GymPokemon('Shelmet', 2462000, 58),
        new GymPokemon('Karrablast', 2464000, 58),
        new GymPokemon('Leavanny', 2464000, 58),
    ],
    BadgeTypes.Insect,
    128000,
    'Oh hoo… You are very strong indeed! I guess it\'s no surprise I lost. Here! Take this Insect Badge! I think it\'ll suit you!',
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Castelia Sewers'))]
);
gymList['Nimbasa City'] = new Gym(
    'Elesa',
    'Nimbasa City',
    [
        new GymPokemon('Emolga', 2458300, 58),
        new GymPokemon('Flaaffy', 2462000, 58),
        new GymPokemon('Joltik', 2464000, 58),
        new GymPokemon('Zebstrika', 2464000, 58),
    ],
    BadgeTypes.Bolt,
    128000,
    'Well… Now you… you\'re an even more wonderful Trainer than I expected. Your sweet fighting style swept me off my feet! Take this!',
    [new GymBadgeRequirement(BadgeTypes.Insect)]
);
gymList['Driftveil City'] = new Gym(
    'Clay',
    'Driftveil City',
    [
        new GymPokemon('Krokorok', 2458300, 58),
        new GymPokemon('Sandslash', 2462000, 58),
        new GymPokemon('Onix', 2464000, 58),
        new GymPokemon('Excadrill', 2464000, 58),
    ],
    BadgeTypes.Quake,
    128000,
    'Phew… You\'re really somethin\'! Li\'l whippersnapper Trainers who pack a real punch keep showin\' up one after another. Mrmph. Here! Take this!',
    [new GymBadgeRequirement(BadgeTypes.Bolt)]
);
gymList['Mistralton City'] = new Gym(
    'Skyla',
    'Mistralton City',
    [
        new GymPokemon('Swoobat', 2458300, 58),
        new GymPokemon('Skarmory', 2462000, 58),
        new GymPokemon('Sigilyph', 2464000, 58),
        new GymPokemon('Swanna', 2464000, 58),
    ],
    BadgeTypes.Jet,
    128000,
    'You\'re an amazing Pokémon Trainer. My Pokémon and I are happy because for the first time in quite a while--about two years, I\'d say--we could fight with our full strength. This is an official League Gym Badge. But this is just a stepping-stone.',
    [new GymBadgeRequirement(BadgeTypes.Quake)]
);
gymList['Opelucid City'] = new Gym(
    'Drayden',
    'Opelucid City',
    [
        new GymPokemon('Druddigon', 2458300, 58),
        new GymPokemon('Flygon', 2462000, 58),
        new GymPokemon('Altaria', 2464000, 58),
        new GymPokemon('Haxorus', 2464000, 58),
    ],
    BadgeTypes.Legend,
    128000,
    'Wonderful. I\'m grateful that we had a chance to meet and battle. It reminded me that Pokémon battles are about working with others to meet our challenges together.',
    [new GymBadgeRequirement(BadgeTypes.Jet)]
);
gymList['Humilau City'] = new Gym(
    'Marlon',
    'Humilau City',
    [
        new GymPokemon('Wailord', 2458300, 58),
        new GymPokemon('Mantine', 2462000, 58),
        new GymPokemon('Carracosta', 2464000, 58),
        new GymPokemon('Jellicent', 2464000, 58),
    ],
    BadgeTypes.Wave,
    128000,
    'You don\'t just look strong, you\'re strong fo\' reals! Eh, I was swept away, too! Oh yeah, yo. I was so surprised that I forgot! I gotta give this to you!',
    [new GymBadgeRequirement(BadgeTypes.Legend)]
);

//Unova Elite 4
//TODO: Balancing of elite Pokemon HP & rewards.
gymList['Elite Shauntal'] = new Gym(
    'Shauntal',
    'Elite Shauntal',
    [
        new GymPokemon('Cofagrigus', 1945330, 49),
        new GymPokemon('Gengar', 1948300, 49),
        new GymPokemon('Froslass', 1952000, 50),
        new GymPokemon('Drifblim', 1957000, 51),
        new GymPokemon('Golurk', 1960250, 53),
        new GymPokemon('Chandelure', 1960250, 53),
    ],
    BadgeTypes.Elite_Shauntal,
    64000,
    'My Pokémon and the challenger\'s Pokémon. Everyone battled even though they were hurt... Thank you.',
    [new GymBadgeRequirement(BadgeTypes.Wave)]
);
gymList['Elite Marshal'] = new Gym(
    'Marshal',
    'Elite Marshal',
    [
        new GymPokemon('Throh', 1945330, 49),
        new GymPokemon('Sawk', 1948300, 49),
        new GymPokemon('Lucario', 1952000, 50),
        new GymPokemon('Mienshao', 1957000, 51),
        new GymPokemon('Machamp', 1957000, 51),
        new GymPokemon('Conkeldurr', 1960250, 53),
    ],
    BadgeTypes.Elite_Marshal,
    64000,
    'Whew! Well done! As your battles continue, aim for even greater heights!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Shauntal)]
);
gymList['Elite Grimsley'] = new Gym(
    'Grimsley',
    'Elite Grimsley',
    [
        new GymPokemon('Honchkrow', 1945330, 49),
        new GymPokemon('Scrafty', 1948300, 49),
        new GymPokemon('Krookodile', 1952000, 50),
        new GymPokemon('Houndoom', 1957000, 51),
        new GymPokemon('Tyranitar', 1957000, 51),
        new GymPokemon('Bisharp', 1960250, 53),
    ],
    BadgeTypes.Elite_Grimsley,
    64000,
    'Whether or not you get to fight at full strength, whether or not luck smiles on you--none of that matters. Only results matter. And a loss is a loss. See, victory shines like a bright light. And right now, you and your Pokémon are shining brilliantly.',
    [new GymBadgeRequirement(BadgeTypes.Elite_Marshal)]
);
gymList['Elite Caitlin'] = new Gym(
    'Caitlin',
    'Elite Caitlin',
    [
        new GymPokemon('Musharna', 1945330, 49),
        new GymPokemon('Alakazam', 1948300, 49),
        new GymPokemon('Gothitelle', 1957000, 51),
        new GymPokemon('Gallade', 1957000, 51),
        new GymPokemon('Reuniclus', 1952000, 50),
        new GymPokemon('Metagross', 1960250, 53),
    ],
    BadgeTypes.Elite_Caitlin,
    64000,
    'You and your Pokémon are both excellent and elegant. To have been able to battle against such a splendid team... My Pokémon and I learned a lot! I offer you my thanks',
    [new GymBadgeRequirement(BadgeTypes.Elite_Grimsley)]
);
gymList['Champion Iris'] = new Gym(
    'Iris',
    'Champion Iris',
    [
        new GymPokemon('Hydreigon', 2458300, 58),
        new GymPokemon('Salamence', 2462000, 58),
        new GymPokemon('Aggron', 2464000, 58),
        new GymPokemon('Archeops', 2460250, 60),
        new GymPokemon('Lapras', 2470000, 58),
        new GymPokemon('Haxorus', 2570000, 62),
    ],
    BadgeTypes.Elite_UnovaChampion,
    128000,
    'I\'m upset I couldn\'t win! But you know what? More than that, I\'m happy! I mean, come on. By having a serious battle, you and your Pokémon, and me and my Pokémon, we all got to know one another better than before! Yep, we sure did! OK, let\'s go!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Caitlin)]
);

//Kalos Gyms
//TODO: Balancing of gym Pokemon HP & rewards.
gymList['Santalune City'] = new Gym(
    'Viola',
    'Santalune City',
    [
        new GymPokemon('Surskit', 2458300, 58),
        new GymPokemon('Vivillon', 2462000, 58),
    ],
    BadgeTypes.Bug,
    128000,
    'Young Trainer, you... No, it wasn\'t you alone. You and your <Pokémon> have shown me a whole new depth of field! Fantastic! Just fantastic!',
    [new RouteKillRequirement(10, 3)]
);
gymList['Cyllage City'] = new Gym(
    'Grant',
    'Cyllage City',
    [
        new GymPokemon('Amaura', 2458300, 58),
        new GymPokemon('Tyrunt', 2462000, 58),
    ],
    BadgeTypes.Cliff,
    128000,
    'There are some things that seem out of reach no matter how hard you try. However, it\'s important that you never give up--no matter the opponent or the odds. I could tell from our battle that you and your Pokémon understand that. To commemorate such an impressive show of teamwork, please accept the Cliff Badge!',
    [new GymBadgeRequirement(BadgeTypes.Bug)]
);
gymList['Shalour City'] = new Gym(
    'Korrina',
    'Shalour City',
    [
        new GymPokemon('Mienfoo', 2458300, 58),
        new GymPokemon('Machoke', 2462000, 58),
        new GymPokemon('Hawlucha', 2462000, 58),
    ],
    BadgeTypes.Rumble,
    128000,
    'Oh! I have been defeated! Alack, alay! Lady Korrina gave a terrible display! This is it. I must give up my title and admit that your strength far exceeds-- Just teasing! But here\'s your Badge. Boy, you\'ll be rolling in \'em soon!',
    [new GymBadgeRequirement(BadgeTypes.Cliff)]
);
gymList['Coumarine City'] = new Gym(
    'Ramos',
    'Coumarine City',
    [
        new GymPokemon('Jumpluff', 2458300, 58),
        new GymPokemon('Weepinbell', 2462000, 58),
        new GymPokemon('Gogoat', 2462000, 58),
    ],
    BadgeTypes.Plant,
    128000,
    'Yeh believe in yer Pokémon... And they believe in yeh, too... Mighty oaks from acorns grow. Go on, then. Yeh\'ve earned it. Here\'s yer own Plant Badge, sprout.',
    [new GymBadgeRequirement(BadgeTypes.Rumble)]
);
gymList['Lumiose City'] = new Gym(
    'Clemont',
    'Lumiose City',
    [
        new GymPokemon('Emolga', 2458300, 58),
        new GymPokemon('Magneton', 2462000, 58),
        new GymPokemon('Heliolisk', 2462000, 58),
    ],
    BadgeTypes.Voltage,
    128000,
    'Oh, Bonnie... When will you learn there\'s no shame in losing? I\'m glad whenever I get to learn something new thanks to strong challengers like you here.',
    [new RouteKillRequirement(10, 13), new GymBadgeRequirement(BadgeTypes.Plant)]
);
//Replace req with Kalos Power Plant dungeon if implemented.
gymList['Laverre City'] = new Gym(
    'Valerie',
    'Laverre City',
    [
        new GymPokemon('Mawile', 2458300, 58),
        new GymPokemon('Mr. Mime', 2462000, 58),
        new GymPokemon('Sylveon', 2462000, 58),
    ],
    BadgeTypes.Fairy,
    128000,
    'Yes... That was a fine battle. I shall reward you for this great victory. This is the Fairy Badge. It is yours now. Its beauty is captivating, is it not? ... ... ... ... ... ... Ah... Do forgive me. I was so captivated, I forgot for a moment that it is yours.',
    [new GymBadgeRequirement(BadgeTypes.Voltage)]
);
gymList['Anistar City'] = new Gym(
    'Olympia',
    'Anistar City',
    [
        new GymPokemon('Sigilyph', 2458300, 58),
        new GymPokemon('Slowking', 2462000, 58),
        new GymPokemon('Meowstic', 2462000, 58),
    ],
    BadgeTypes.Psychic,
    128000,
    'Now, the Psychic Badge. A testament to your skill. Proof of your power.',
    [new GymBadgeRequirement(BadgeTypes.Fairy)]
);
gymList['Snowbelle City'] = new Gym(
    'Wulfric',
    'Snowbelle City',
    [
        new GymPokemon('Abomasnow', 2458300, 58),
        new GymPokemon('Cryogonal', 2462000, 58),
        new GymPokemon('Avalugg', 2462000, 58),
    ],
    BadgeTypes.Iceberg,
    128000,
    'Impressive! Your Pokémon fought with great courage. I can tell that you\'ve trained your Pokémon well.',
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Pokémon Village'))]
);

//Kalos Elite 4
//TODO: Balancing of elite Pokemon HP & rewards.
gymList['Elite Malva'] = new Gym(
    'Malva',
    'Elite Malva',
    [
        new GymPokemon('Pyroar', 1945330, 49),
        new GymPokemon('Torkoal', 1948300, 49),
        new GymPokemon('Chandelure', 1952000, 50),
        new GymPokemon('Talonflame', 1957000, 51),
    ],
    BadgeTypes.Elite_Malva,
    64000,
    'What news... So a new challenger has defeated Malva of the Elite Four!',
    [new GymBadgeRequirement(BadgeTypes.Iceberg)]
);
gymList['Elite Siebold'] = new Gym(
    'Siebold',
    'Elite Siebold',
    [
        new GymPokemon('Clawitzer', 1945330, 49),
        new GymPokemon('Gyarados', 1948300, 49),
        new GymPokemon('Starmie', 1952000, 50),
        new GymPokemon('Barbaracle', 1957000, 51),
    ],
    BadgeTypes.Elite_Siebold,
    64000,
    'I shall store my memory of you and your Pokémon forever away within my heart.',
    [new GymBadgeRequirement(BadgeTypes.Elite_Malva)]
);
gymList['Elite Wikstrom'] = new Gym(
    'Wikstrom',
    'Elite Wikstrom',
    [
        new GymPokemon('Klefki', 1945330, 49),
        new GymPokemon('Probopass', 1948300, 49),
        new GymPokemon('Scizor', 1952000, 50),
        new GymPokemon('Aegislash', 1957000, 51),
    ],
    BadgeTypes.Elite_Wikstrom,
    64000,
    'Glorious! The trust that you share with your honorable Pokémon surpasses even mine!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Siebold)]
);
gymList['Elite Drasna'] = new Gym(
    'Drasna',
    'Elite Drasna',
    [
        new GymPokemon('Dragalge', 1945330, 49),
        new GymPokemon('Druddigon', 1948300, 49),
        new GymPokemon('Altaria', 1952000, 50),
        new GymPokemon('Noivern', 1957000, 51),
    ],
    BadgeTypes.Elite_Drasna,
    64000,
    'Oh, dear me. That sure was a quick battle... I do hope you\'ll come back again sometime!',
    [new GymBadgeRequirement(BadgeTypes.Elite_Wikstrom)]
);
gymList['Champion Diantha'] = new Gym(
    'Diantha',
    'Champion Diantha',
    [
        new GymPokemon('Hawlucha', 2458300, 58),
        new GymPokemon('Tyrantrum', 2462000, 58),
        new GymPokemon('Aurorus', 2464000, 58),
        new GymPokemon('Gourgeist', 2460250, 60),
        new GymPokemon('Goodra', 2470000, 58),
        new GymPokemon('Gardevoir', 2570000, 62),
    ],
    BadgeTypes.Elite_KalosChampion,
    128000,
    'Witnessing the noble spirits of you and your Pokémon in battle has really touched my heart...',
    [new GymBadgeRequirement(BadgeTypes.Elite_Drasna)]
);
