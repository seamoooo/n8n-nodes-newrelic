# New Relic Trigger 詳細解説: セキュリティとデータ整形

カスタムTriggerノードを作成することで得られる「セキュリティ（署名検証）」と「データ整形（パース）」のメリットについて詳しく解説します。

## 1. セキュリティ強化 (署名検証)

標準のWebhook URLは、URLさえ分かれば誰でもリクエストを送れてしまいます。これに対する防御策です。

### 仕組み
1.  **New Relic側**:
    Webhook設定画面で「Custom Header」を追加します。
    *   Key: `X-NewRelic-Signature` (または `X-Secret-Token` など)
    *   Value: `my-secret-password-12345` (複雑なランダム文字列)
    
2.  **Triggerノード側 (n8n)**:
    ノードの実装内で、リクエストを受け取った瞬間に以下をチェックします。
    ```typescript
    // 擬似コード
    const receivedToken = header['x-newrelic-signature'];
    const expectedToken = credentials.webhookSecret; // n8nのCredentialに保存したもの
    
    if (receivedToken !== expectedToken) {
        throw new Error('Invalid signature'); // 処理を即座に拒否
    }
    ```

### メリット
*   **なりすまし防止**: 正しいパスワードを知っているNew Relicからのアクセス以外はすべて遮断されるため、第三者が偽のアラートを送り込んでくるリスクを排除できます。
*   **設定の簡略化**: 標準Webhookノードでこれやる場合、「Webhookノード(Header受信)」→「Switchノード(Headerチェック)」というフローを毎回組む必要がありますが、カスタムノードなら**Credentialを選ぶだけ**で済みます。

---

## 2. データ整形 (JSONパース)

New Relicのアラートペイロードは非常に情報量が多く、ネストが深い場合があります。

### 標準Webhookの場合 (Before)
受け取るデータは「生のJSON」です。
```json
{
  "incident_id": 12345,
  "condition_name": "High CPU",
  "targets": [
    {
      "id": "9876",
      "name": "Web Server 01",
      "labels": { "env": "prod" }
    }
  ],
  "timestamp": 1700000000
}
```

n8nで「サーバー名」を使いたい場合、`{{ $json.body.targets[0].name }}` のように長い式を書く必要があります。また、`targets` が配列なので、複数台同時にアラートが出た場合のループ処理なども自分で組む必要があります。

### Custom Triggerノードの場合 (After)
ノード内のプログラムで、このJSONを「使いやすい形」に変換（正規化）してから出力できます。

**出力データのイメージ:**
```json
// 1つのアラートの中に複数のターゲットがいても、自動的に分割して出力可能
[
  {
    "alertId": 12345,
    "serverName": "Web Server 01",
    "environment": "prod",
    "severity": "CRITICAL",
    "url": "https://one.newrelic.com/..."
  }
]
```

### メリット
*   **直感的な利用**: 次のノード（Slack通知など）を設定する際、変数ピッカーから `serverName` を選ぶだけで済みます。`body.targets[0]...` といった深い階層を気にする必要がありません。
*   **表記揺れの吸収**: New RelicのAlert Policyにはいくつかの種類（Legacy, Workflows等）があり、JSONの構造が微妙に違うことがありますが、ノード側で吸収して**常に同じフォーマット**で出力するように実装できます。
