# 今後の実装計画 (Phase 2)

本ドキュメントでは、New Relic n8nノードの機能拡張計画について概説します。

## 1. API機能の拡張 (NewRelic Node)

既存の `NewRelic` ノードに「Resource」と「Operation」を追加し、New Relicの管理・可観測性ツールとしての汎用性を高めます。

### 追加予定のリソース

*   **Entity (`entity`)**
    *   `get`: GUIDによる特定エンティティの詳細取得。
    *   `search`: 名前、ドメイン、タイプによるエンティティ検索。
    *   `tags`: エンティティのタグ取得・設定。

*   **Application (`application`)** (Entityのラッパー)
    *   `getAll`: 全てのAPMアプリケーションの一覧取得。
    *   `getHealth`: アプリケーションのヘルスステータス確認。

*   **Deployment (`deployment`)**
    *   `create`: アプリケーションへのデプロイメントマーカーの記録（CI/CDパイプラインで有用）。

### 実装戦略
これらの操作もすべて **NerdGraph API** (`https://api.newrelic.com/graphql`) を使用します。ユーザーの選択に基づいて、異なるGraphQLクエリを構築する形で実装します。

---

## 2. New Relic Trigger ノード (Webhook)

New Relicのアラートにリアルタイムで対応するため、**Trigger ノード**を作成します。

### 設計

*   **名前**: `NewRelicTrigger`
*   **タイプ**: Webhook インターフェース
*   **メカニズム**: "Push"（リアルタイム）。ポーリングではありません。

### 動作の仕組み
1.  **n8n側**: ユーザーが `NewRelicTrigger` ノードを追加すると、n8nがユニークなWebhook URLを発行します。
2.  **New Relic側**: ユーザーがそのURLに向けた **Webhook Destination** を作成します。
3.  **フロー**:
    *   `アラート発生` -> `New Relic Webhook` -> `n8n Trigger ノード` -> `ワークフロー実行`

### なぜWebhookなのか？
*   **低遅延**: アラート発生時に即座に動作します。
*   **効率性**: API枠を消費する繰り返しのポーリングリクエストが不要です。
*   **標準的**: New Relicのアラートシステムは、Webhook、Slack、PagerDutyなどへのプッシュ通知を前提に設計されています。

## 3. デプロイとリリース

*   **npmパッケージ**: `n8n-nodes-newrelic`
*   **バージョニング**: Phase 2リリース時に `0.2.0` へインクリメントします。
