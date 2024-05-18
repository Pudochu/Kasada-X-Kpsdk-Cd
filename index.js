const crypto = require('crypto');

function makeId() {
    let id = "";
    const chars = "0123456789abcdef";
    for (let i = 0; i < 32; i++) {
        id += chars[Math.floor(Math.random() * 16)];
    }
    return id;
}

function getHashDifficulty(hash) {
    return 0x10000000000000 / (parseInt(hash.slice(0, 13), 16) + 1);
}

function findAnswers(startTime, idHash) {
    let answers = [];
    let initialHash = crypto.createHash('sha256').update(`tp-v2-input, ${startTime}, ${idHash}`).digest('hex');
    for (let i = 0; i < 2; i++) {
        let nonce = 1;
        while (true) {
            let currentHash = crypto.createHash('sha256').update(`${nonce}, ${initialHash}`).digest('hex');
            if (getHashDifficulty(currentHash) >= 5) {
                answers.push(nonce);
                initialHash = currentHash;
                break;
            }
            nonce += 1;
        }
    }
    return [answers, initialHash];
}

function generateServerOffset() {
    let initialTimestamp = Date.now();
    let randomOffset = Math.floor(Math.random() * (2700 - 1400 + 1)) + 1400;
    let finalTimestamp = initialTimestamp + randomOffset;
    return [finalTimestamp - initialTimestamp, initialTimestamp, finalTimestamp];
}

function solve() {
    let [offset, startTime, endTime] = generateServerOffset();
    let currentTimestamp = Date.now();
    let runtime = Math.random() * (10525.5 - 5325.5) + 5325.5;
    let workTime = currentTimestamp - offset;
    let id = makeId();
    let [answers, finalHash] = findAnswers(workTime, id);
    let extendedRuntime = Math.random() * (runtime * 1.5 - runtime * 1.1) + runtime * 1.1;
    let duration = Math.round((extendedRuntime - runtime));
    
    return JSON.stringify({
        workTime: workTime,
        id: id,
        answers: answers,
        duration: duration,
        offset: offset,
        startTime: startTime,
        endTime: endTime
    });
}

console.log(solve());
