# セルフホスト環境でのテスト手順 (Self-Hosted Testing Guide)

npmに公開する前に、ご自身のサーバー（VPSやDocker環境など）で動作確認を行うための手順書です。
`npm pack` コマンドを使用して、インストール可能なパッケージファイルを作成してデプロイします。

## 1. パッケージの作成 (ローカル作業)

開発PC上で、npmパッケージファイル（`.tgz`）を作成します。

```bash
# プロジェクトディレクトリに移動
cd n8n-nodes-newrelic

# ビルドアンドパック
npm run build
npm pack
```

実行すると、ディレクトリ内に `n8n-nodes-newrelic-0.1.0.tgz` のようなファイルが生成されます。
これが「npmに公開されるはずのファイル一式」をまとめたものです。

## 2. サーバーへのアップロード

作成した `.tgz` ファイルを、n8nが動いているサーバーへ転送します。

```bash
# 例: scpコマンドを使う場合
scp n8n-nodes-newrelic-0.1.0.tgz user@your-server-ip:/tmp/
```

※ Docker環境の場合は、ホストマシンの、コンテナからアクセスできる場所（ボリュームマウントしている場所など）に置いてください。

## 3. サーバーへのインストール

サーバー（またはDockerコンテナ内）で、n8nのカスタムノードディレクトリに対してインストールを行います。

### Docker Compose (推奨) の場合

通常、n8nのデータはボリューム（例: `n8n_data` やホストのディレクトリ）に永続化されています。
カスタムノードは `/home/node/.n8n/custom` にインストールするのが一般的です。

1.  **コンテナに入る**:
    ```bash
    docker exec -it -u root n8n /bin/sh
    ```
    (コンテナ名は `n8n` や `n8n_main` など環境に合わせてください)

2.  **カスタムディレクトリへ移動**:
    ```bash
    cd /home/node/.n8n/custom
    ```
    ※ ディレクトリがない場合は `mkdir -p /home/node/.n8n/custom` で作成してください。

3.  **パッケージのインストール**:
    先ほどアップロードしたファイルを指定してインストールします。
    ```bash
    npm install /path/to/uploaded/n8n-nodes-newrelic-0.1.0.tgz
    ```
    (ファイルパスは、コンテナ内から見えるパスを指定してください)

4.  **n8nの再起動**:
    インストール完了後、変更を反映させるためにコンテナを再起動します。
    ```bash
    # (ホストマシン側で)
    docker restart n8n
    ```

### 直接インストール (Non-Docker) の場合

1.  **カスタムディレクトリへ移動**:
    ```bash
    cd ~/.n8n/custom
    ```

2.  **インストール**:
    ```bash
    npm install /path/to/n8n-nodes-newrelic-0.1.0.tgz
    ```

3.  **n8n再起動**:
    ```bash
    pm2 restart n8n
    # または systemctl restart n8n など
    ```

## 4. 確認

n8nの画面を開き、ノード追加メニューで「New Relic」と検索して表示されれば成功です！
