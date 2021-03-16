const { exec } = require('node:child_process');
let path = require('path'),
    fs = require('fs'),
    nodecmd = require('node-cmd'),
    uuid = require('uuid');
    uuid4 = uuid.v4,
    { exec, spawn } = require('child_process'),
    killp = require('kill-port'),
    { Rcon } = require('rcon-client'),
    AWS = require('aws-sdk'),
    extractzip = require('extract-zip'),
    xapi = require("./xapi.js");

AWS.config.update({accessKeyId: "AKIAYAOA2FXEAXESJ2VM", secretAccessKey: "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"});
let s3 = new AWS.S3({apiVersion: '2006-03-01'});

let loglist = [];
let curids = [];
let obj = [];

let make = async function(port, type, preset = 0) {
    killp(port, "tcp");
    killp(port + 1, "tcp");
    let ogtype = type;
    type = path.join(__dirname, "/resources/", type.toLowerCase() + ".jar");
    let iid = uuid4();
    obj[iid] = {
        id: iid,
        port: port,
        jar: type,
        type: ogtype,
        lines: [],
    }
    let box = path.join(__dirname, "/resources/boxes/", obj[iid].id);

    fs.mkdirSync(box);
    fs.chmodSync(box, 0775);

    if(preset !== 0) {
        await new Promise(async(resolve, reject) => {
            let lf = path.join(box, "keyup-" + iid + ".zip");
            var params = {
                Bucket: "zeperiumpresets",
                Key: preset + ".zip",
            };
            var file = fs.createWriteStream(lf);
            let st = s3.getObject(params).createReadStream();
            st.pipe(file);
            st.on("end", async() => {
                await extractzip(lf, { dir: box });
                fs.unlinkSync(lf);
                resolve();
            });
        });
    }

    fs.writeFileSync(path.join(box, "eula.txt"), "eula=true");
    fs.writeFileSync(path.join(box, "server.properties"), "enable-jmx-monitoring=false\nrcon.port=25566\nlevel-seed=0\ngamemode=survival\nenable-command-block=false\nenable-query=true\ngenerator-settings=\nlevel-name=world\nmotd=A Minecraft Server\nquery.port=25565\npvp=true\ngenerate-structures=true\ndifficulty=peaceful\nnetwork-compression-threshold=256\nmax-tick-time=60000\nuse-native-transport=true\nmax-players=50\nonline-mode=false\nenable-status=true\nallow-flight=false\nbroadcast-rcon-to-ops=true\nview-distance=10\nmax-build-height=256\nserver-ip=127.0.0.1\nallow-nether=true\nserver-port=25565\nenable-rcon=true\nsync-chunk-writes=true\nop-permission-level=4\nprevent-proxy-connections=false\nresource-pack=\nentity-broadcast-range-percentage=100\nrcon.password=hobilitymorkin\nplayer-idle-timeout=0\ndebug=false\nforce-gamemode=false\nrate-limit=0\nhardcore=false\nwhite-list=false\nbroadcast-console-to-ops=true\nspawn-npcs=true\nspawn-animals=false\nsnooper-enabled=true\nfunction-permission-level=2\nlevel-type=default\ntext-filtering-config=\nspawn-monsters=true\nenforce-whitelist=false\nresource-pack-sha1=\nspawn-protection=0\nmax-world-size=29999984");
    fs.writeFileSync(path.join(box, "spigot.yml"), "config-version: 12\nsettings:\n  debug: false\n  bungeecord: true\n  sample-count: 12\n  player-shuffle: 0\n  user-cache-size: 1000\n  save-user-cache-on-stop-only: false\n  moved-wrongly-threshold: 0.0625\n  moved-too-quickly-multiplier: 10.0\n  log-villager-deaths: true\n  timeout-time: 60\n  restart-on-crash: true\n  restart-script: ./start.sh\n  netty-threads: 4\n  attribute:\n    maxHealth:\n      max: 2048.0\n    movementSpeed:\n      max: 2048.0\n    attackDamage:\n      max: 2048.0\nmessages:\n  whitelist: This Zeperium node is undergoing maintenance!\n  unknown-command: Zeperium couldn't find that command!\n  server-full: Zeperium's currently overloaded, try again later!\n  outdated-client: Zeperium support clients from 1.8 to 1.16 only!\n  outdated-server: Zeperium support clients from 1.8 to 1.16 only!\n  restart: This Zeperium node will be right back!\ncommands:\n  log: true\n  tab-complete: 0\n  send-namespaced: true\n  spam-exclusions: []\n  silent-commandblock-console: true\n  replace-commands: []\nadvancements:\n  disable-saving: false\n  disabled:\n  - minecraft:story/disabled\nplayers:\n  disable-saving: false\nstats:\n  disable-saving: false\n  forced-stats: {}\nworld-settings:\n  default:\n    verbose: true\n    enable-zombie-pigmen-portal-spawns: true\n    item-despawn-rate: 6000\n    end-portal-sound-radius: 0\n    view-distance: default\n    wither-spawn-sound-radius: 0\n    hanging-tick-frequency: 100\n    arrow-despawn-rate: 1200\n    trident-despawn-rate: 1200\n    zombie-aggressive-towards-villager: true\n    nerf-spawner-mobs: false\n    mob-spawn-range: 6\n    hopper-amount: 1\n    dragon-death-sound-radius: 0\n    seed-village: 10387312\n    seed-desert: 14357617\n    seed-igloo: 14357618\n    seed-jungle: 14357619\n    seed-swamp: 14357620\n    seed-monument: 10387313\n    seed-shipwreck: 165745295\n    seed-ocean: 14357621\n    seed-outpost: 165745296\n    seed-endcity: 10387313\n    seed-slime: 987234911\n    seed-bastion: 30084232\n    seed-fortress: 30084232\n    seed-mansion: 10387319\n    seed-fossil: 14357921\n    seed-portal: 34222645\n    max-tnt-per-tick: 100\n    entity-tracking-range:\n      players: 48\n      animals: 48\n      monsters: 48\n      misc: 32\n      other: 64\n    merge-radius:\n      item: 2.5\n      exp: 3.0\n    growth:\n      cactus-modifier: 100\n      cane-modifier: 100\n      melon-modifier: 100\n      mushroom-modifier: 100\n      pumpkin-modifier: 100\n      sapling-modifier: 100\n      beetroot-modifier: 100\n      carrot-modifier: 100\n      potato-modifier: 100\n      wheat-modifier: 100\n      netherwart-modifier: 100\n      vine-modifier: 100\n      cocoa-modifier: 100\n      bamboo-modifier: 100\n      sweetberry-modifier: 100\n      kelp-modifier: 100\n    entity-activation-range:\n      animals: 32\n      monsters: 32\n      raiders: 48\n      misc: 16\n      tick-inactive-villagers: true\n    ticks-per:\n      hopper-transfer: 8\n      hopper-check: 1\n    hunger:\n      jump-walk-exhaustion: 0.05\n      jump-sprint-exhaustion: 0.2\n      combat-exhaustion: 0.1\n      regen-exhaustion: 6.0\n      swim-multiplier: 0.01\n      sprint-multiplier: 0.1\n      other-multiplier: 0.0\n    max-tick-time:\n      tile: 50\n      entity: 50\n    squid-spawn-range:\n      min: 45.0\n");
    fs.writeFileSync(path.join(box, "bukkit.yml"), "settings:\n  allow-end: false\n  warn-on-overload: false\n  permissions-file: permissions.yml\n  update-folder: update\n  plugin-profiling: false\n  connection-throttle: 4000\n  query-plugins: true\n  deprecated-verbose: default\n  shutdown-message: Zeperium node now offline!\n  minimum-api: none\nspawn-limits:\n  monsters: 0\n  animals: 10\n  water-animals: 15\n  water-ambient: 20\n  ambient: 15\nchunk-gc:\n  period-in-ticks: 600\nticks-per:\n  animal-spawns: 400\n  monster-spawns: 1\n  water-spawns: 1\n  water-ambient-spawns: 1\n  ambient-spawns: 1\n  autosave: 6000");
    fs.writeFileSync(path.join(box, "commands.yml"), "command-block-overrides: []\nignore-vanilla-permissions: true\naliases:\n  icanhasbukkit:\n  - version $1-");
    let jarx = spawn("cd " + box + " && java -Xmx1G -jar " + type + " --online-mode false --max-players 50 --port " + port + " --nogui", {shell: true});

    exec("sudo iptables -I INPUT -p tcp --dport 25565 --syn -j ACCEPT || sudo service iptables save");
    
    await new Promise(async(resolve, reject) => {
        jarx.stdout.on('data', function (data) {
            let data2 = data.toString();
            console.log(data2);
            obj[iid].lines.push(data2);
            if(data2.includes("RCON running on ")) {
                resolve();
            }
        });

        jarx.on('exit', function (code) {
            obj[iid].lines.push("[ZSYS] Exited with code " + code + "!");
        });
    }).then(async() => {
        obj[iid].rcon = new Rcon({ host: "127.0.0.1", "port": (port + 1), password: "hobilitymorkin" });
        await obj[iid].rcon.connect();
    });
}

let stop = async function(id) {

}

let kill = async function(id) {

}

let start = async function(id) {

}

let logs = {
    getLogs: async function(id) {

    },
    getLastLog: async function(id) {

    },
    runCommand: async function(id, command, op = true, player = "console") {

    }
}

let getRcon = async function(id) {
    return sid[id].rcon;
}

module.exports = { make, stop, kill, start, logs, getRcon };