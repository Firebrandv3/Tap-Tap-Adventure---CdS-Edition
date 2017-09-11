/* global log */

var cls = require('../lib/class');

module.exports = Creator = cls.Class.extend({

    init: function(mysql) {
        var self = this;

        self.mysql = mysql;

    },

    createTables: function() {
        var self = this;

        self.mysql.connection.query('CREATE TABLE IF NOT EXISTS player_data (' +
            'username varchar(64),' +
            'email varchar(64),' +
            'x int,' +
            'y int,' +
            'experience int,' +
            'kind int,' +
            'rights int,' +
            'poisoned tinyint,' +
            'hitPoints int,' +
            'mana int,' +
            'pvpKills int,' +
            'pvpDeaths int,' +
            'rank int,' +
            'ban int(64),' +
            'mute int(64),' +
            'membership int(64),' +
            'lastLogin int(64),' +
            'guild varchar(64),' +
            'PRIMARY KEY(username))');

        self.mysql.connection.query('CREATE TABLE IF NOT EXISTS player_equipment (' +
            'username varchar(64),' +
            'armour varchar(64),' +
            'weapon varchar(64),' +
            'pendant varchar(64),' +
            'ring varchar(64),' +
            'boots varchar(64),' +
            'PRIMARY KEY(username))');

        self.mysql.connection.query('CREATE TABLE IF NOT EXISTS player_quests (' +
            'username varchar(64),' +
            'ids text COLLATE utf8_unicode_ci NOT NULL,' +
            'stages text COLLATE utf8_unicode_ci NOT NULL,' +
            'PRIMARY KEY(username))');

        self.mysql.connection.query('CREATE TABLE IF NOT EXISTS player_achievements (' +
            'username varchar(64),' +
            'ids text COLLATE utf8_unicode_ci NOT NULL,' +
            'progress text COLLATE utf8_unicode_ci NOT NULL,' +
            'PRIMARY KEY(username))');

        self.mysql.connection.query('CREATE TABLE IF NOT EXISTS player_bank (' +
            'username varchar(64),' +
            'ids text COLLATE utf8_unicode_ci NOT NULL,' +
            'counts text COLLATE utf8_unicode_ci NOT NULL,' +
            'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
            'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
            'PRIMARY KEY(username))');

        self.mysql.connection.query('CREATE TABLE IF NOT EXISTS player_abilities (' +
            'username varchar(64),' +
            'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
            'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
            'shortcuts text COLLATE utf8_unicode_ci NOT NULL,' +
            'PRIMARY KEY (username))');

        self.mysql.connection.query('CREATE TABLE IF NOT EXISTS player_inventory (' +
            'username varchar(64),' +
            'ids text COLLATE utf8_unicode_ci NOT NULL,' +
            'counts text COLLATE utf8_unicode_ci NOT NULL,' +
            'abilities text COLLATE utf8_unicode_ci NOT NULL,' +
            'abilityLevels text COLLATE utf8_unicode_ci NOT NULL,' +
            'PRIMARY KEY(username))');

        self.mysql.connection.query('CREATE TABLE IF NOT EXISTS ipbans (' +
            'ip varchar(64),' +
            'ipban int(64),' +
            'PRIMARY KEY(ip))', function(error) {
            if (!error) {
                log.info('[MySQL] Successfully created 7 tables.');
                self.mysql.connect(true, true);
            }
        });
    },

    save: function(player) {
        var self = this,
            queryKey = player.isNew ? 'INSERT INTO' : 'UPDATE IGNORE',
            playerData = self.formatData(self.getPlayerData(player), 'data'),
            equipmentData = self.formatData(self.getPlayerData(player), 'equipment');

        self.mysql.connection.query(queryKey + ' `player_data` SET ?', playerData);
        self.mysql.connection.query(queryKey + ' `player_equipment` SET ?', equipmentData);
        self.mysql.connection.query(queryKey + ' `player_inventory` SET ?', player.inventory.getArray());
        self.mysql.connection.query(queryKey + ' `player_abilities` SET ?', player.abilities.getArray());
        self.mysql.connection.query(queryKey + ' `player_bank` SET ?', player.bank.getArray());
        self.mysql.connection.query(queryKey + ' `player_quests` SET ?', player.quests.getQuests());
        self.mysql.connection.query(queryKey + ' `player_achievements` SET ?', player.quests.getAchievements());
    },

    formatData: function(data, type) {
        var formattedData;

        switch(type) {
            case 'data':
                formattedData = {
                    username: data.username,
                    email: data.email,
                    x: data.x,
                    y: data.y,
                    experience: data.experience,
                    kind: data.kind,
                    rights: data.rights,
                    poisoned: data.poisoned,
                    hitPoints: data.hitPoints.getHitPoints(),
                    mana: data.mana.getMana(),
                    pvpKills: data.pvpKills,
                    pvpDeaths: data.pvpDeaths,
                    rank: data.rank,
                    ban: data.ban,
                    mute: data.mute,
                    membership: data.membership,
                    lastLogin: data.lastLogin,
                    guild: data.guild
                };
                break;

            case 'equipment':

                formattedData = {
                    username: data.username,
                    armour: data.armour.toString(),
                    weapon: data.weapon.toString(),
                    pendant: data.pendant.toString(),
                    ring: data.ring.toString(),
                    boots: data.boots.toString()
                };

                break;
        }

        return formattedData;
    },

    getPlayerData: function(player) {
        return {
            username: player.username,
            email: player.email ? player.email : 'null',
            x: player.x ? player.x : -1,
            y: player.y ? player.y : -1,
            kind: player.kind ? player.kind : 0,
            rights: player.rights ? player.rights : 0,
            hitPoints: player.hitPoints ? player.hitPoints : 100,
            mana: player.mana ? player.mana : 20,
            poisoned: player.poisoned ? player.poisoned : 0,
            experience: player.experience ? player.experience : 0,
            ban: player.ban ? player.ban : 0,
            mute: player.mute ? player.mute : 0,
            rank: player.rank ? player.rank : 0,
            membership: player.membership ? player.membership : 0,
            lastLogin: player.lastLogin ? player.lastLogin : 0,
            guild: player.guild ? player.guild : '',
            pvpKills: player.pvpKills ? player.pvpKills : 0,
            pvpDeaths: player.pvpDeaths ? player.pvpDeaths : 0,
            armour: [player.armour ? player.armour.getId() : 114, player.armour ? player.armour.getCount() : 0, player.armour ? player.armour.getAbility() : 0, player.armour ? player.armour.getAbilityLevel() : 0],
            weapon: [player.weapon ? player.weapon.getId() : -1, player.weapon ? player.weapon.getCount() : 0, player.weapon ? player.weapon.getAbility() : 0, player.weapon ? player.weapon.getAbilityLevel() : 0],
            pendant: [player.pendant ? player.pendant.getId() : -1, player.pendant ? player.pendant.getCount() : 0, player.pendant ? player.pendant.getAbility() : 0, player.pendant ? player.pendant.getAbilityLevel() : 0],
            ring: [player.ring ? player.ring.getId() : -1, player.ring ? player.ring.getCount() : 0, player.ring ? player.ring.getAbility() : 0, player.ring ? player.ring.getAbilityLevel() : 0],
            boots: [player.boots ? player.boots.getId() : -1, player.boots ? player.boots.getCount() : 0, player.boots ? player.boots.getAbility() : 0, player.boots ? player.boots.getAbilityLevel() : 0]
        }
    }

});