# learn-react

react.dev の Learn を全章通す。章ごとに PR を立て、学びを本文に残す。

## 環境

- Vite + React + TypeScript（`npm create vite@latest -- --template react-ts`）
- `<StrictMode>` は外さない（純粋性の違反とクリーンアップ漏れを検出するため）
- `eslint-plugin-react-hooks` の警告は潰さない（特に `exhaustive-deps`）
- React Compiler は当面オフ（再レンダリングの素の挙動を観察するため）

```bash
npm install
npm run dev
```

## 進め方

- 章ごとにブランチを切る：`learn/<通し番号>-<スラッグ>`
- 番号は react.dev の目次順の通し番号。読むだけで終わった章も欠番として残す
- 1 章 1 PR。コミットは「アプリが動く状態か」で区切る
- リファクタと機能追加は同じコミットに混ぜない
- PR 本文に「何が腑に落ちたか」「間違って理解していたこと」を書く

### コミットメッセージ

prefix は英語（`feat` / `refactor` / `fix` / `chore` / `docs`）、本文は日本語。

- 文末は「〜する」で統一する
- 主語は書かない（どこを触ったかは diff で分かる）
- 「何をしたか」ではなく「何ができるようになったか」を書く

```
feat: XとOを交互に入力できるようにする
refactor: xIsNextをcurrentMoveから導出する
fix: マスの縦位置のずれを修正する
```

## 進捗

| #   | 章                    | PR  | メモ                                          |
| --- | --------------------- | --- | --------------------------------------------- |
| 01  | Quick Start           | —   | 読むのみ                                      |
| 02  | Tutorial: Tic-Tac-Toe | #1  | 7 コミット                                    |
| 03  | Thinking in React     | #2  | 3 コミット                                    |
| 04  | Installation          | —   | 読むのみ（環境は構築済み、DevTools 導入済み） |
| —   | Rules of React        | —   | 読むのみ。詰まったら戻る                      |
| 05  | Describing the UI     | —   | 全 9 ページ。クイズで確認のみ                 |
| 06  | Adding Interactivity  | —   | 全 7 ページ。サンドボックスで課題のみ         |
| 07  | Managing State        |     | 未着手（7 ページ）                            |
| 08  | Escape Hatches        |     | 未着手（8 ページ）                            |

## 学びのログ

詳細は各 PR の本文に残す。特に引っかかった点のみ抜粋。

### 02 Tutorial: Tic-Tac-Toe

- **state は最小限にする。** `xIsNext` を boolean の state で持つと、`jumpTo` のたびに `currentMove` と整合を取る必要がある。`currentMove % 2 === 0` で導出した時点で、そのバグが書けなくなった
- **イミュータブルな更新はタイムトラベルを成立させている仕組みそのもの。** 作法の問題ではない
- **state はコンポーネントではなくツリー上の位置に紐づく。** 同じ位置・同じ型・同じ key なら保持、いずれかが変わると破棄。`key` はリスト描画の最適化ではなく「React に同一性を教える識別子」
- 型が違う場合は `key` を付けても state は維持されない。維持したいなら親に持ち上げる

### 03 Thinking in React

- **state かどうかの判断基準。** 時間で変わらない → 定数、親から渡る → props、他から計算できる → 導出値。残ったものだけが state
- **map が使えないケースがある。** 1 対 N の変換（カテゴリ見出しの挿入）は `forEach` + `push` か `flatMap` か、グループ化してから二重ループ
- 教材の `lastCategory` 方式は「products がカテゴリ順に並んでいる」前提が隠れている。実務なら `Object.groupBy`

### 05 Describing the UI

- `className` は `class` が JavaScript の予約語で、DOM のプロパティ名が `className` だから。`htmlFor` も同じ理由
- **`&&` が返すのは左辺の値そのもの。** falsy の集合と「描画されない」の集合はズレる。`0` と `''` は描画される。`items.length && <List />` は空配列で「0」が出る
- **純粋性は 2 条件。** 呼び出し前から存在するものを変更しない（外に手を出さない）／ 同じ入力なら同じ出力（結果がブレない）
- レンダリング中に書き換えてよいのは、そのレンダリング中に作ったローカル変数だけ
- 副作用はイベントハンドラが第一選択肢。`useEffect` は適切なイベントがないときの最後の手段
- `<Fragment key={id}>` が必要なのは、1 つのデータから複数要素を返すとき（`<table>` や `<dl>` の中など、`div` で包めない場所）
- レンダーツリーはコンポーネントだけで構成される。HTML タグは含まない

### 06 Adding Interactivity

- **レンダリング = React がコンポーネント関数を呼ぶこと。** 画面に出ることではない。DOM 反映はコミット、画面の塗り直しはブラウザのペイント
- **stale closure。** `handleClick` はレンダリングのたびに新しく作られ、その時点の値を閉じ込める。あとで実行されようと見える値は生まれたときのもの。「レンダリングの外で実行されるから古い」のではなく「古いレンダリングで作られた関数だから古い」
- **スナップショットの制約は「読み」にかかるもので、「書き」を無効にしない。** `setNumber(number + 1)` を 3 回呼ぶと結果は 1（0 ではない）
- **値を渡す = 前の値を捨てる。関数を渡す = 前の値を使う。** 更新関数形式を使うのは「次の値が前の値に依存するとき」。外から来た値を入れるだけなら不要
- 更新関数形式でも、実行中のコードから新しい値は読めない。その場で使いたければローカル変数に受ける
- `slice` はコピーを返す（安全）、`splice` は元を破壊する（危険）。1 文字違い
- `filter` で削除を表現するのは、残すものを選び直した結果として削除になるから

#### state キューの自作（Queueing の課題）

React が更新キューをどう処理しているかを実装した。値なら上書き、関数なら累積。

```js
export function getFinalState(baseState, queue) {
  let nextState = baseState;
  for (let i = 0; i < queue.length; i++) {
    if (typeof queue[i] === 'function') {
      nextState = queue[i](nextState);
    } else {
      nextState = queue[i];
    }
  }
  return nextState;
}
```

`[5, increment, 42]` が `42` になる理由（上書き → 累積 → 上書き）を説明できれば、この章は理解できている。
