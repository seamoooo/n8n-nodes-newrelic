# リポジトリ概要: n8n-nodes-newrelic

このリポジトリは、n8n用の **New Relic カスタムノード** のソースコードを含んでいます。
New RelicのAPI（特にNerdGraph GraphQL API）と統合し、n8nの機能を拡張するために設計されています。

## ディレクトリ構成

root
├── doc/                        # ドキュメントおよび調査メモ
├── n8n-nodes-newrelic/         # n8nノードのメインnpmパッケージ
│   ├── dist/                   # コンパイル済みJavaScriptファイル（ビルドにより生成）
│   ├── nodes/                  # ノードの定義とロジック
│   │   └── NewRelic/           # "New Relic" ノードの実装
│   │       ├── NewRelic.node.ts # メインロジック（入力定義、実行処理、APIコール）
│   │       └── newrelic.svg    # ノードアイコン
│   ├── credentials/            # 認証情報の定義
│   │   ├── NewRelicApi.credentials.ts # User API Key 定義
│   │   └── newrelic.svg        # 認証アイコン
│   ├── package.json            # プロジェクト設定と依存関係
│   └── tsconfig.json           # TypeScript設定
└── README.md                   # リポジトリのREADME（簡易版）

## 主要コンポーネント

### 1. `n8n-nodes-newrelic/nodes/NewRelic/NewRelic.node.ts`
統合の核心部分です。以下を定義しています：
*   **Operations（操作）**: ノードができること（現在は `NRQL -> Query`）。
*   **Inputs（入力）**: ユーザーに表示されるフィールド（例：クエリ文字列）。
*   **Execution Logic（実行ロジック）**: `https://api.newrelic.com/graphql` へリクエストを送る関数。

### 2. `n8n-nodes-newrelic/credentials/NewRelicApi.credentials.ts`
ユーザー認証の方法を定義します。
*   **User API Key** (`NRAK-...`) が必要です。
*   **Region（リージョン）** 選択（US/EU）を含み、APIエンドポイントを切り替えます。

## 開発ワークフロー
詳細な開発手順については、`n8n-nodes-newrelic/README.md` または `development_guide.md` アーティファクト（もしあれば）を参照してください。
