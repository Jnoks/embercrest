export const TITLE = "Embercrest";

export const TAGLINE = "One takes the road. One keeps the fire.";

export const HEROES = [
  {
    id: "mage",
    name: "Tansy",
    role: "Feeds the fire",
    portrait: "con2",
    description:
      "Apprentice mage of Embercrest. Throws fire. Wears the old mage's second-best hat. It is too big.",
  },
  {
    id: "knight",
    name: "Bram",
    role: "Guards the door",
    portrait: "con1",
    description:
      "Apprentice knight of Embercrest. Good with a sword. Wears the old knight's red scarf. It itches.",
  },
];

export const INTRO_PAGES = [
  "Come closer to the fire. This is how we almost lost it.",
  "Embercrest is a hall on a hill. Its fire is the Ember. The red banner over its door is the Crest.",
  "A mage feeds the fire. A knight guards the door. While the Ember burns on its hill, the land keeps its colors.",
  "Three winters ago the old mage took the fire down the road. The old knight took the banner and followed.",
  "They left one small coal. Back by spring, they said. They did not say which spring.",
  "Now the land is fading, like a shirt washed too often.",
  "Two apprentices are left. One stays with the coal. One takes the road. Tonight, that one is you.",
];

export const INTRO_PAGES_SHORT = [
  "Embercrest is a hall on a hill. Its fire is the Ember. The red banner over its door is the Crest.",
  "Three winters ago the old mage took the fire down the road. The old knight took the banner and followed. The land has gone pale.",
  "Two apprentices are left. One stays with the last coal. You take the road.",
];

export const WORLDS = [
  {
    id: "forest",
    name: "The Woodpile",
    chapter: "Through the Wood",
    arrival: [
      "The Woodpile. The hall has always cut its firewood here. The trees have not forgotten.",
    ],
    quest: {
      giver: "Latch",
      portrait: "con6",
      title: "A Lock on a Bush",
      item: "Cold Spark",
      amount: 5,
      objective: "Find 5 cold sparks for Latch",
      offer: [
        "Smoke. Onions. A fire that is almost out. You're from the hall on the hill. I'm Latch. I open locks.",
        "I buy cold sparks. Bits of your fire that fell on the road and turned hard. I have a buyer for them. Don't ask who.",
        "Four lie in this wood. Hob has the fifth on his torch and the thorn gate key on his belt. Who puts a lock on a bush?",
        "One alone stays cold. Five together wake up. Find five and I'll get you that key. You fight, I carry. Deal?",
      ],
      reminder: [
        "Not five yet. I'll wait here. Waiting is half of my job. The other half is running away.",
      ],
      complete: [
        "Five. Don't look around. You won't see me. That is the point of me. My buyer pays in spoons. Don't ask.",
        "While you two were busy, I checked his belt. One copper key. I call that teamwork.",
        "He turned hard out here, you know. Like the sparks. Too long, too far from home. Go on. The gate is yours.",
      ],
      rewardItem: "Copper Key",
      rewardText: "You got the Copper Key.",
    },
    gate: {
      name: "Thorn Gate",
      requires: "Copper Key",
      locked: [
        "It is black inside the thorn gate. A few steps in, your hand finds a cold lock. You need a key.",
      ],
      opened: [
        "The copper key turns in the dark. Click. Behind the thorns, a road climbs toward the mountains.",
      ],
    },
    boss: {
      name: "Hob",
      portrait: "con10",
      intro: [
        "Forty winters I held that hall. Fed the fire. Kept the door. Both jobs. Alone. Nobody said thank you.",
        "Now they send a child for my one spark? No. Go home. Tell them Hob says no.",
      ],
      heroLine: null,
      defeat: [
        "Enough. Take it. It was heavy, doing both. ...Is there still soup at the hall? There always was.",
      ],
    },
    cleared: [
      "One night, long before your time, Hob took a torch and a sword and walked into the wood.",
      "That is why the hall has two now: one for the fire, one for the door. Behind you, green runs back into the leaves.",
    ],
    ending: [
      "The road beyond the thorn gate is long. Too long for one day. You leave the gate open and walk home, up the hill.",
      "Your friend opens the door of Embercrest before you knock. Inside, the coal is a fire again. Five sparks glow in it.",
      "On the table lies a thief's bill with your friend's name on it. It was paid in spoons. All the spoons.",
      "Late that night Hob stands in the door for a long time. Then he asks if there is soup. There is. There are no spoons.",
      "The road goes on, over the pass. But it is late. The rest is for another night.",
    ],
  },
  {
    id: "mountain",
    name: "The Attic",
    chapter: "Over the Pass",
    arrival: [
      "We name our land like a house. Our hall is the fireplace. This is the Attic: high, dusty, full of things left behind.",
    ],
    quest: {
      giver: "Latch",
      portrait: "con6",
      title: "They Do Not Sink",
      item: "Cold Spark",
      amount: 5,
      objective: "Find 5 cold sparks for Latch",
      offer: [
        "Yes, me again. I took the short way. Hob is still sitting at the thorn gate, looking up the hill. Give him time.",
        "Two people from your hall came up here three winters ago. Ten steps apart. Not one word.",
        "The knight locked the cave behind them. The key went to the biggest thing he could find: the orc who builds bridges.",
        "Four sparks lie on his bridges. He tests each bridge with the fifth. Same deal as before. Oh, and never say 'sink.'",
      ],
      reminder: [
        "Still short. Four on the bridges, one with the orc. I'll be here, not crossing anything.",
      ],
      complete: [
        "Five. I'm under a bridge. I won't say which. It rests. So do I.",
        "The silver key? He used it to hold a board. I took it and left a nail. That is not helping. That is a trade.",
        "My buyer says thank you. Nobody thanks a thief. I have no pocket for that. Go on. The cave is yours.",
      ],
      rewardItem: "Silver Key",
      rewardText: "You got the Silver Key.",
    },
    gate: {
      name: "Tooth Gate",
      requires: "Silver Key",
      locked: [
        "A cave mouth with stone teeth, and dark inside. A few steps in, a lock. Someone did not want to be followed.",
      ],
      opened: [
        "The silver key turns in the dark. Click. Cold air comes out of the cave. It smells of iron.",
      ],
    },
    boss: {
      name: "The Bridge Orc",
      portrait: "con34",
      intro: [
        "You say nothing? Oh, I HEARD what you did not say. My bridges do not sink. They rest!",
      ],
      heroLine: null,
      defeat: [
        "Fine. They sink. A little. I will add a board. Here, take my test stone. I am done testing.",
      ],
    },
    cleared: [
      "The sun has been setting here for three winters. It is still not done. But now it is setting in color.",
    ],
    ending: [],
  },
  {
    id: "castle",
    name: "Safekeep",
    chapter: "Into the Castle",
    arrival: [
      "Safekeep. Every door has three locks. Nothing gets in. Nothing gets out. Nobody here is warm.",
    ],
    quest: {
      giver: "Latch",
      portrait: "con6",
      title: "Thirty Locks",
      item: "Cold Spark",
      amount: 5,
      objective: "Find 5 cold sparks for Latch",
      offer: [
        "Castles. So many locks. For a man like me it's a buffet.",
        "The lord here wears black iron with red edges. Red like the banner he hung over the cellar door. You call it the Crest.",
        "He has stood there for three winters. Ten doors, thirty locks. A man like that would put a lock on a bush.",
        "Four sparks lie between the spikes and the blades. He has the fifth, and the gold key. You fight, I carry.",
      ],
      reminder: [
        "That is not five. Four between the spikes, one under the iron. No hurry. I'm only on lock nine.",
      ],
      complete: [
        "Five. I'm behind door seven. Three locks, all shut. I've never felt safer.",
        "Under all that iron is your old knight. Yes, he locked the bush. He said sorry while I took his key.",
        "He wants soup. I am a thief, not a cook. But I know a hall on a hill.",
      ],
      rewardItem: "Gold Key",
      rewardText: "You got the Gold Key.",
    },
    gate: {
      name: "Cellar Door",
      requires: "Gold Key",
      locked: [
        "The cellar door has three locks. Above it hangs a red banner you know well. Without a key, nothing here moves.",
      ],
      opened: [
        "The gold key turns. Click. Click. Click. The cellar door swings open. Behind it, stairs lead down.",
      ],
    },
    boss: {
      name: "Sir Rufus",
      portrait: "con11",
      intro: [
        "HALT. The door stays shut. She said: wait here. So I wait. Nobody waits better.",
        "Ten doors. Thirty locks. I locked every one myself. Nobody gets through. Not thieves. Not the wind. Not you.",
      ],
      heroLine: {
        mage: "That hat. She had that hat. But you are not her. Go home, little hat.",
        knight:
          "A red scarf. I had one like it. It itched. Go home, little scarf.",
      },
      defeat: [
        "Wait. I know you. The child from the hill. You were this tall. Oh no. How long have I been standing here?",
        "Three winters? Truly? ...That explains my knees.",
      ],
    },
    cleared: [
      "Marigold, the old mage, took the fire down these stairs. 'It belongs at home,' said Sir Rufus. 'Wait here,' she said.",
      "Now he says he will carry the Crest home himself. But first he says sorry to the door. They were together a long time.",
    ],
    ending: [
      "You walk Sir Rufus home. He carries the Crest and says sorry to every tree on the way. There are a lot of trees.",
      "Your friend opens the door before you knock. Inside, the coal is a fire again. Fifteen sparks glow in it.",
      "On the table lies a thief's bill, paid in spoons. Latch's buyer lived here the whole time.",
      "The red banner hangs over the door again. From the wood and from the pass, people can see it. Some of them come up.",
      "Hob is the first to come. Tonight there are four at the coal. He and Sir Rufus drink their soup straight from the bowl.",
      "Marigold is still down below with the fire. The stairs go on, deeper down. But it is late. The rest will wait for another night.",
    ],
  },
  {
    id: "dungeon",
    name: "The Pickle Jar",
    chapter: "Down the Stairs",
    arrival: [
      "Under the castle lies the Pickle Jar. It is green, it is sour, and things are kept in it for a very long time.",
    ],
    quest: {
      giver: "Latch",
      portrait: "con6",
      title: "A Wish Is a Wish",
      item: "Cold Spark",
      amount: 5,
      objective: "Find 5 cold sparks for Latch",
      offer: [
        "Your old knight passed me on his way home. He said sorry four times. We only just met.",
        "There's a genie at the skull gate. He guards a wish. A lady in a violet hat left it with him.",
        "Four sparks lie above the acid. Do not swim. The fifth is in his turban. The ruby key is in his jar. I like jars.",
        "Same deal as always. Careful. He's very polite. Those are the worst.",
      ],
      reminder: [
        "Four is not five. The rest are over the acid and in a turban. And I mean it about the swimming.",
      ],
      complete: [
        "Five. I'm in his jar. He's not using it right now. A ruby key, a small pillow, one pickle. I took the key.",
        "'Let nobody follow me.' That was your old mage. The knight only got 'wait here.' Three winters for two words.",
        "My buyer asked how you look. I said: tired. Dirty. Not pale at all. That seemed to help. I got an extra spoon.",
      ],
      rewardItem: "Ruby Key",
      rewardText: "You got the Ruby Key.",
    },
    gate: {
      name: "Skull Gate",
      requires: "Ruby Key",
      locked: [
        "The bars of the skull gate are down. Behind them the stairs go on. The skull looks at you and waits for a key.",
      ],
      opened: [
        "The ruby key turns. The bars go up. Warm air comes up from below. It smells of smoke. You know that smell.",
      ],
    },
    boss: {
      name: "The Doorman",
      portrait: "con39",
      intro: [
        "Good evening. I am the Doorman. Please state your wish. ...No wish? A quiet one. How nice.",
        "Sadly, an older wish comes first: 'Let nobody follow me.' Three winters old. Still valid. I do apologize in advance.",
      ],
      heroLine: null,
      defeat: [
        "You did not follow her. You went through me. I see no problem. Wish complete. Watch your step.",
      ],
    },
    cleared: [
      "The stairs go on down. The green stays behind you. Far below, something glows. It is not small.",
    ],
    ending: [],
  },
  {
    id: "dungeon2",
    name: "The Coal Cellar",
    chapter: "Where Fire Comes From",
    arrival: [
      "The Coal Cellar. Long ago somebody carried one ember up from here and built a hall around it.",
    ],
    quest: {
      giver: "Latch",
      portrait: "con6",
      title: "Who Is With the Coal?",
      item: "Cold Spark",
      amount: 5,
      objective: "Find 5 cold sparks for Latch",
      offer: [
        "Nothing lies deeper than this. I looked for a back door. I found a crack going up. It's blocked. It smells of onions.",
        "Your old mage brought the fire down here to feed it. Three winters now. It is very big. She is very tired.",
        "Four sparks lie by the lava. Down here they are almost awake. The fifth is the light on her staff.",
        "No key this time. That crack has no lock. For five I have something better. Don't ask. I promised.",
      ],
      reminder: [
        "Not five yet. Four by the lava, one on her staff. I'll wait. For once it's warm where I wait.",
      ],
      complete: [
        "Five. That's the last of them. And this is for you. From my buyer. No charge. A first for me.",
        "Yes, the buyer. Lives on a hill. Fed every spark you found to one small coal. Paid me in spoons. All of them.",
        "I was told not to tell you. 'The one on the road will say: I need no help.' Well? Read it at the crack.",
      ],
      rewardItem: "Letter from Home",
      rewardText: "You got the Letter from Home.",
    },
    gate: {
      name: "The Way Up",
      requires: "Letter from Home",
      locked: [
        "A crack in the rock leads up. Something heavy blocks it from the other side. It smells of onions.",
      ],
      opened: [
        "The letter says: 'You are right under our fireplace. I moved the coal and the soup pot. Come up.'",
      ],
    },
    boss: {
      name: "Marigold",
      portrait: "con12",
      intro: [
        "Stay back! Look how big the fire is. It fills the whole cave. One more winter, and I will find a way to carry it home.",
        "But you... you came all this way? Then who is with the coal? Go home. Go home at once!",
      ],
      heroLine: {
        mage: "And in my second-best hat! Who gave you my hat? Home. Now. You and the hat.",
        knight:
          "And in his old scarf! He always said it itched. Home. Now. You and the scarf.",
      },
      defeat: [
        "You still have your colors. So the coal still burns. So someone stayed with it.",
        "We never did that. We both left. ...I would like to go home now.",
      ],
    },
    cleared: [
      "You climb. The rock turns into brick. The brick turns into a chimney you know.",
    ],
    ending: [
      "You climb out of your own fireplace, black with ash. The Coal Cellar is right under Embercrest. The road was a circle.",
      "Your friend stands there with the pot in both hands. Every spark you found went up this hill in a thief's pocket. The coal never went out. Not once.",
      "Marigold comes up after you with the Ember in her hat: one piece, no bigger than an apple. It is enough.",
      "The Crest hangs over the door again. Sir Rufus put it up himself. It is a little crooked. Nobody says 'I was right.'",
      "The fire takes a deep breath. Outside, the colors run back over the land, all the way to the mountains.",
      "Hob comes last. He stands in the door for a long time. Then he asks if there is soup. There is. There are no spoons.",
      "That is how we almost lost it. Now, somebody put a log on.",
    ],
  },
];

export const UI_TEXT = {
  pressStart: "Press any key",
  newGame: "New game",
  loading: "Loading...",
  skipIntro: "Skip intro",
  nextPage: "Next",
  closePage: "Close",
  chooseHero: "Who takes the road?",
  chooseHeroHint: "Your friend stays with the coal.",
  confirmHero: "Take the road",
  back: "Back",
  controls: "Controls",
  move: "Move",
  jump: "Jump",
  attack: "Attack",
  talk: "Talk",
  acceptQuest: "Deal.",
  questNew: "New quest",
  questDone: "Quest complete",
  questLabel: "Quest",
  chapterLabel: "Chapter",
  worldCleared: "The colors are back",
  paused: "Paused",
  resume: "Continue",
  restart: "Restart",
  quit: "Quit",
  fullscreen: "Fullscreen",
  heroDown: "You are down. The road waits.",
  tryAgain: "Try again",
  endTitle: "Home Again",
  thanks: "Thank you for taking the road.",
  playAgain: "Play again",
  soundOn: "Sound: on",
  soundOff: "Sound: off",
};
