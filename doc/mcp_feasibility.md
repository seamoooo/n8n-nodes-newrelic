# New Relic MCP 連携の実現要否

## 結論: **実現可能性「大」 (Highly Feasible)**

New Relicの Model Context Protocol (MCP) サーバーとn8nを連携させることは完全に可能です。
n8nは現在、MCPをネイティブにサポートしており、クライアント（ツールの利用）としてもサーバー（ツールの公開）としても機能します。

## このパッケージへの組み込みが必要か？
**結論: いいえ、不要です。**

n8n自体が標準機能として「MCP Client」を持っています。
したがって、開発中の `n8n-nodes-newrelic` パッケージにMCP関連のコードを追加する必要はありません。

**利用イメージ:**
1. n8nの標準ノード「AI Agent」を配置。
2. その中で「MCP Client」ツールを選択。
3. New RelicのMCPサーバーURLとAPIキーを設定。
4. これだけで連携が完了します。

## 連携アーキテクチャ

**New Relic MCP Server**（New Relic提供）を **n8n AI Agent ノード** に接続する構成になります。

1.  **New Relic 側**:
    *   "New Relic AI MCP Server" を有効化します（現在プレビュー版）。
    *   このサーバーは `query_nrql`, `get_alerts`, `analyze_errors` といったツールを公開しています。

2.  **n8n 側**:
    *   **AI Agent ノード** を使用します。
    *   "MCP Server" タイプの **Tool** を追加します。
    *   それを New Relic MCP Server のエンドポイントに接続します。

## メリット
*   **自然言語クエリ**: n8nのAIエージェントに「なぜCPU使用率が高いのか？」と尋ねるだけで、MCPツールを使用して関連データをクエリ・分析させることができます。
*   **トラブルシューティングの自動化**: アラートのコンテキストを元に、AIエージェントに「根本原因を診断して」と指示し、New Relicデータを活用して調査させるワークフローを作成できます。

## 要件
*   **New Relic**: APIアクセス権限があり、MCPの「Public Preview」が有効化されているアクティブなアカウント。
*   **n8n**: AI AgentおよびMCPサポートが有効な最新バージョン。

## セットアップ概要
1.  **New Relic User API Key** を取得します。
2.  n8nで、New RelicのMCPエンドポイントを指定して **MCP Client** ツールを設定します（通常、環境変数でのAPIキー設定が必要です）。
3.  このツールを AI Agent に追加します。
4.  エージェントにプロンプトを投げます：「アプリケーションXのエラー率を確認して」。

## 参考文献
*   [New Relic MCP Setup Guide](https://docs.newrelic.com/jp/docs/agentic-ai/mcp/setup/)
*   [n8n MCP Support Announcement](https://n8n.io/blog/mcp-integration/)
