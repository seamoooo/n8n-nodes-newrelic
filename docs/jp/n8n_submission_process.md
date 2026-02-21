# n8n コミュニティノード申請・承認フロー

作成したノードを世界中のn8nユーザー（Cloud版含む）が使えるようにするための、公式な申請・承認プロセスです。

## 1. 準備 (Prerequisites)

申請前に以下の条件を満たしているか確認してください。

*   **npmパッケージ名**: `n8n-nodes-` で始まっていること（本プロジェクトはOK: `n8n-nodes-newrelic`）。
*   **キーワード**: `package.json` の `keywords` に `n8n-community-node-package` が含まれていること。
*   **ライセンス**: MITライセンスであること。
*   **リポジトリ**: GitHubリポジトリがPublicで、npm上のリンクと一致していること。
*   **ドキュメント**: READMEに使い方が明記されていること。

## 2. npmへの公開 (Publish to npm)

n8nの審査チームは、npm上のパッケージを確認します。まずはnpmに公開する必要があります。

```bash
# バージョンを確定
npm version 0.1.0

# npmにログイン (まだの場合)
npm login

# 公開
npm publish --access public
```

## 3. n8nへの申請 (Submit to n8n)

npm公開後、n8n公式のポータルから申請を行います。

1.  **n8n Creator Portal** にアクセスします。
    *   URL: [https://n8n.io/creators/](https://n8n.io/creators/) (または `integrations` ページ下のリンク)
2.  **Submit a Node** (または類似のボタン) をクリックします。
3.  npmパッケージのURLや、GitHubリポジトリの情報を入力します。
4.  送信します。

## 4. 審査と承認 (Review & Approval)

*   **期間**: 通常、数週間〜数ヶ月かかる場合があります（人気具合による）。
*   **チェック項目**:
    *   セキュリティ（環境変数を勝手に読み取っていないか等）
    *   品質（エラーハンドリング、Lintエラーがないか）
    *   依存関係（重すぎるライブラリを使っていないか）
*   **フィードバック**: 問題があれば連絡が来ます。修正して再Publish (`npm version patch` -> `npm publish`) しましょう。

## 5. 承認後 (After Verification)

承認されると…
*   **n8n Cloud**: 標準のノード検索画面に「Community Node」として表示されるようになります。
*   **Verified Badge**: 信頼できるノードとしてバッジが付与されます。

---
**補足**: 承認前でも、Self-hosted版のn8nユーザーは `npm install n8n-nodes-newrelic` コマンド等を使って手動インストールすることで利用可能です。
