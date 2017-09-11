/* global module */

var Modules = {

    Orientation: {
        Up: 0,
        Down: 1,
        Left: 2,
        Right: 3
    },

    Equipment: {
        Armour: 0,
        Weapon: 1,
        Pendant: 2,
        Ring: 3,
        Boots: 4
    },

    Hits: {
        Damage: 0,
        Poison: 1,
        Heal: 2,
        Mana: 3,
        Experience: 4,
        LevelUp: 5
    },

    Projectiles: {
        Arrow: 0,
        Boulder: 1,
        FireBall: 2,
        IceBall: 3,
        Terror: 4,
        Tornado: 5
    },

    Abilities: {
        Freeze: 0,
        Curse: 1,
        Smash: 2,
        Tornado: 3,
        Run: 4,
        Call: 5
    },

    Enchantment: {
        Bloodsucking: 0,
        Critical: 1,
        Evasion: 2,
        Spike: 3,
        Explosive: 4,
        Stun: 5
    },

    Trade: {
        Started: 0,
        Accepted: 1,
        Finished: 2
    },

    Quests: {
        Introduction: 0
    },

    Checkpoints: {
        Home: 0
    }

};

module.exports = Modules;