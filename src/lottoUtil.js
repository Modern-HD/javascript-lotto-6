import Lotto from './Lotto.js';
import WinLotto from './WinLotto.js';
import { MissionUtils } from '@woowacourse/mission-utils';

const LOTTO_REWARD = {
    5: 5_000,
    4: 50_000,
    3: 1_500_000,
    2: 30_000_000,
    1: 2_000_000_000,
};

const RANK_DESCRIPTION = {
    5: '3개 일치',
    4: '4개 일치',
    3: '5개 일치',
    2: '5개 일치, 보너스 볼 일치',
    1: '6개 일치',
};

/**
 * @param {number} lottoPay
 */
export function validateLottoPay(lottoPay) {
    if (!(typeof lottoPay === 'number' && lottoPay)) {
        throw new Error('[ERROR] 숫자만 입력 가능합니다.');
    }
    if (lottoPay % 1000 !== 0) {
        throw new Error('[ERROR] 1000의 배수만 입력 가능합니다.');
    }
}

export async function inputLottoPay() {
    while (true) {
        try {
            const lottoPay = Number(await MissionUtils.Console.readLineAsync('구입금액을 입력해 주세요.\n'));
            validateLottoPay(lottoPay);
            return lottoPay;
        } catch (error) {
            MissionUtils.Console.print(error.message);
        }
    }
}

export async function inputWinNumber() {
    /** @type {string} */
    const winNumberStr = await MissionUtils.Console.readLineAsync('당첨 번호를 입력해 주세요.\n');
    MissionUtils.Console.print('');
    return winNumberStr.split(',').map(str => Number(str));
}

export async function inputBonusNumber() {
    const bonusNumberStr = await MissionUtils.Console.readLineAsync('보너스 번호를 입력해 주세요.\n');
    MissionUtils.Console.print('');
    return Number(bonusNumberStr);
}

export async function winLottoGenerate() {
    let lotto;
    while (true) {
        try {
            const winNumbers = await inputWinNumber();
            lotto = new Lotto(winNumbers);
            break;
        } catch (error) {
            MissionUtils.Console.print(error.message);
        }
    }
    while (true) {
        try {
            const bonusNumber = await inputBonusNumber();
            const winLotto = new WinLotto(lotto, bonusNumber);
            return winLotto;
        } catch (error) {
            MissionUtils.Console.print(error.message);
        }
    }
}

/**
 * @param {number} amount
 */
export function lottoGenerate(amount) {
    return [...Array(amount)].map(
        () => new Lotto(MissionUtils.Random.pickUniqueNumbersInRange(1, 45, 6).sort((a, b) => a - b))
    );
}

/**
 * @param {number[]} lottoNumbers
 * @param {Set<number>} winLottoSet
 * @returns {number}
 */
export function checkAnswerCnt(lottoNumbers, winLottoSet) {
    return lottoNumbers.reduce((acc, cur) => (acc += winLottoSet.has(cur) ? 1 : 0), 0);
}

/**
 * @param {number[]} lottoNumbers
 * @param {number} bonusNumber
 */
export function checkHasBonus(lottoNumbers, bonusNumber) {
    return lottoNumbers.includes(bonusNumber);
}

/**
 * @param {number} answerCnt
 * @param {boolean} hasBonusNumber
 * @return {number}
 */
export function lottoRank(answerCnt, hasBonusNumber) {
    if (answerCnt < 3) return -1;
    if (answerCnt === 3) return 5;
    if (answerCnt === 4) return 4;
    if (answerCnt === 5 && !hasBonusNumber) return 3;
    if (answerCnt === 5 && hasBonusNumber) return 2;
    if (answerCnt === 6) return 1;
    return -1;
}
