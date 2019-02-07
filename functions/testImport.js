import stampit from '@stamp/it';

let Paladin = stampit({
  props: {
    mana: 50,
    strength: 50,
    health: 100,
  },
});

const fred = Paladin();
console.log(fred.strength);
