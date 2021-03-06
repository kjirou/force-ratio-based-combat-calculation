// @flow

//
// ## round と moment
//
// 10 moment = 1 round
//
// 戦闘は 1 round からはじまる。
// 開始の際にどちらかもしくは両方に 0 moment 以上のイニシアチブ(initiative) が与えられる。
//
// 接敵しての刀剣ベースの乱戦を CQC (Close Quarters Combat: 近接格闘) と定義して、
// その戦いを CQC に参加する戦闘参加者(battler)の戦力比によって結果を算出する。
//
// その CQC は round の終了に発生し、解決する。
//
//
// ## CQC 以外の行動の解決（能動フェーズ）
//
// round の最後に CQC を解決するが、それ以外の部分は、いわゆるアクティブバトル式である。
//
// initiative の多い battler から手番が周り（同値の場合は何らかの他のステータスで順番を解決する）、
// 全 battler の initiative がが 0 になるまで手番を回し続ける。
// その状態になったら round の能動フェーズは終了し、CQC フェーズへと移行する。
//
//
// ## CQC フェーズ
//
// 敵味方 2 パーティそれぞれで CQC 参加 battler の戦力(force) を合算し、その戦力比(force ratio)を出す。
// force ratio は低い側を高い側で割った割合になる。
// 例えば、A=200 vs B=100 なら、A:1.0 vs B:0.5、A=10 vs B=100 なら、A:0.1 vs B:1.0 になる。
//
// battler は、各人 force の他に損害(damage) のパラメータもある。
// それぞれが敵パーティのいずれかの相手に対し、damage / force-ratio の損害を与える。
// 各人が誰にというのは、基本的にはランダムをベースに自動的に決まる。
//
// 各人の耐久値(hit-points) から damage を差し引き、CQC フェーズは終了する。
//
//
// ## force 算出に影響を与える事項
// ### 10 moment の確保
//
// CQC に参加する battler は、1 round に 10 moment を確保しないと、本来の force を生み出せない。
// つまり、基本的な設計として CQC に参加する battler は能動フェーズでは何も行動しないようになる。
// 10 moment に足りなかった場合のペナルティは、基本的には足りなかった割合分の force を差し引かれる。
//
// 何らかの理由で余分に moment 与えられた場合に 10 moment を超えた場合のボーナスや、
// 割合ぶんのペナルティについては、職業やスキルなどでバリエーションを持たせることができるだろう。
//
// ### ポジション
//
// CQC は接敵しての乱戦をイメージしているので、その主な参加者は前衛(forward)に所属する。
// 他にも、後衛(back)、中衛(middle) がある。
//
// middle では、近接武器でも CQC に参加して force に貢献できるが、その割合は forward よりは低くなる。
// back から CQC に参加するには、遠隔武器が必要になる。
//
// middle の battler は、forward よりは damage の対象になりにくい。
// back の battler は、damage の対象になりにくい上に、遠隔武器以外では届かない。
//
//
// ## その他
// ### 戦闘開始時の initiative の算出イメージ
//
// initiative の付与は、主に個人の反応力か戦術的な優勢性によってもたらされる。
// そして、敵パーティとの物理的な距離によって、両者増減される。
//
// 例えば、ひらけた場所で優れたレンジャーによって敵パーティを認識して、十分な準備ができるなら、
// パーティメンバー全体に対してほぼ 10 moment に近い値が与えられるべきである。
// 一方で、ダンジョンの曲がり角などで突然敵パーティと相対したのなら、相互の反応力の優れたものに対し、
// その能力に応じた initiative が与えらえるべきである。
//

const icepick = require('icepick');

/*::
import type {
  MomentNumber,
} from './types';
 */

/**
 * Progress a moment
 */
const proceed = (battle) => {
  let newBattle = Object.assign({}, battle);

  newBattle = icepick.assocIn(newBattle, ['MomentNumber'], newBattle.momentNumber + 1);

  return newBattle;
};
