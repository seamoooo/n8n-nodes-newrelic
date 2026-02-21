# n8n カスタムノード開発ガイド

TypeScriptは読めるが、n8nのカスタムノードやnpmパッケージ作成は初めてという方に向けた、アーキテクチャと開発フローの解説です。

## 1. 全体像

n8nのカスタムノードは、本質的には **「n8nが定めたインターフェースを実装したTypeScriptのクラス」** を含むnpmパッケージです。

```mermaid
graph TD
    User[ユーザー] -->|ドラッグ&ドロップ| n8nUI[n8n エディタ]
    n8nUI -->|Node定義を読み込み| NodeClass[NewRelic.node.ts]
    NodeClass -->|実行時に呼ばれる| Execute[execute() メソッド]
    Execute -->|HTTPリクエスト| NewRelicAPI[New Relic API]
```

## 2. ディレクトリ構造の役割

このリポジトリ（`n8n-nodes-newrelic`）の標準的な構成要素です。

| パス | 役割 | 解説 |
| :--- | :--- | :--- |
| `package.json` | **登録簿兼定義書** | n8nに「ここにノードがあるよ」と教える場所。`n8n` プロパティが重要です。 |
| `nodes/` | **ノードのロジック** | 実際の処理を書く場所。1つのディレクトリに1つのノード定義 (`.node.ts`) を置きます。 |
| `credentials/` | **認証情報の定義** | APIキーなどをどう入力させるかを定義する場所。 (`.credentials.ts`) |
| `dist/` | **成果物** | TypeScriptをビルドして生成されたJavaScriptファイル。n8nはここを読み込みます。 |

### `package.json` の秘密

n8nは起動時に `package.json` 内の `n8n` プロパティを見に行きます。

```json
"n8n": {
  "nodes": [
    "dist/nodes/NewRelic/NewRelic.node.js",        // 通常ノード
    "dist/nodes/NewRelic/NewRelicTrigger.node.js"  // Triggerノード
  ],
  "credentials": [
    "dist/credentials/NewRelicApi.credentials.js" // 認証定義
  ]
}
```
ここにコンパイル後のJSファイルのパスを書いておかないと、n8nはノードを認識しません。

## 3. ノードの実装 (Class Structure)

全てのノードは `INodeType` インターフェースを実装したクラスです。

### 基本ノード (`NewRelic.node.ts`)

主に2つの部分で構成されます。

1.  **`description` (定義)**:
    *   ノードの名前、アイコン、入力/出力の設定。
    *   **UI定義**: ユーザーが設定画面で見るフォーム（プロパティ）を定義します（例: `resource`, `operation`）。
2.  **`execute()` (実行ロジック)**:
    *   ワークフローがこのノードに到達した時に呼ばれる関数。
    *   `this.getInputData()` で前のノードからのデータを受け取り。
    *   `this.getNodeParameter()` でユーザーが設定した値（クエリなど）を取得。
    *   APIを叩いて、結果を `return` します。

### Triggerノード (`NewRelicTrigger.node.ts`)

基本ノードと違い、**`webhook()`** メソッドを持ちます。

1.  **`webhook()`**:
    *   外部からHTTPリクエストが来た瞬間に呼ばれます。
    *   `this.getRequestObject()` でリクエスト内容（Headers, Body）を取得。
    *   ここで署名検証（Security check）を行い、OKならデータをワークフローに流します。

## 4. npmパッケージの仕組み

「npmパッケージを作る」とは、乱暴に言えば **「`package.json` を含めたディレクトリをtarボール（.tgz）にまとめること」** です。

### ビルドとパッケージ化の流れ

1.  **TypeScriptコンパイル**:
    ```bash
    npm run build
    ```
    `src` (またはルート) にある `.ts` ファイルを読み、`dist` ディレクトリに `.js` ファイルを生成します。

2.  **パッケージ化 (Pack)**:
    ```bash
    npm pack
    ```
    `package.json` の `files` フィールドで指定されたディレクトリ（今回は `dist`）と、`README.md` `package.json` などをまとめて、1つのファイル (`n8n-nodes-newrelic-0.1.0.tgz`) に圧縮します。

3.  **インストール**:
    n8n側でこの `.tgz` を解凍・配置し、`node_modules` のように振る舞わせることで、n8nが起動時に読み込めるようになります。

## 5. 開発のヒント

*   **型定義**: `n8n-workflow` パッケージが強力な型定義を提供しています。VS Codeなどで補完が効くので、`INodeType` などをCtrl+クリックして中身を見ると勉強になります。
*   **アイコン**: SVGファイルを使います。`package.json` 等ではなく、ノード定義の中で `icon: 'file:newrelic.svg'` のように指定します。
*   **デバッグ**: `console.log` は n8n のサーバーログに出力されます。Docker logs 等で確認できます。
