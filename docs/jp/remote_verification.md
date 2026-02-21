# リモートサーバーでの動作確認手順

リモートサーバー（VPSやクラウドなど）で稼働している n8n で、このカスタムノードを動作確認するための手順です。

## 前提条件

*   ローカル環境に `node` と `npm` がインストールされていること。
*   リモートサーバーへ SSH 接続が可能であること。
*   リモートサーバー上で n8n が稼働していること（npm版 または Docker版）。

## 方法1: `npm pack` を使用してインストール（推奨）

この方法は、ローカルでビルドしたパッケージを `.tgz` ファイルとしてリモートサーバーに転送し、n8n にインストールする方法です。

### 1. ローカルでパッケージを作成

プロジェクトのルートディレクトリ（`n8n-nodes-newrelic` ディレクトリ内）で以下のコマンドを実行し、ビルドとパッケージ化を行います。

```bash
cd n8n-nodes-newrelic
npm install
npm run build
npm pack
```

これにより、`n8n-nodes-newrelic-0.1.0.tgz`（バージョンにより数字は異なります）というファイルが生成されます。

### 2. パッケージをリモートサーバーへ転送

`scp` コマンドなどを使って、生成された `.tgz` ファイルをリモートサーバーへ転送します。

```bash
scp n8n-nodes-newrelic-0.1.0.tgz user@remote-server:/path/to/upload/
```

### 3. リモートサーバーでインストール

#### npm版 n8n の場合

n8n がインストールされているディレクトリ（またはグローバル）でパッケージをインストールします。通常は `~/.n8n` ディレクトリ直下に `custom` ディレクトリを作成して管理するか、n8nを実行しているユーザーのグローバル環境にインストールします。

最も確実なのは、n8n のカスタムノード用ディレクトリ（`~/.n8n/custom`）を作成し、そこでインストールすることです。

```bash
# リモートサーバー上での操作
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm install /path/to/upload/n8n-nodes-newrelic-0.1.0.tgz
```

#### Docker版 n8n の場合

Dockerコンテナ内の n8n にカスタムノードを認識させるには、カスタムイメージを作成するか、ボリュームマウントを使用します。

**ボリュームマウント・インストール手順:**

1.  ホスト側の適当なディレクトリ（例: `~/n8n-custom-nodes`）を用意します。
2.  そのディレクトリ内で `npm install /path/to/upload/n8n-nodes-newrelic-0.1.0.tgz` を実行します。
3.  Dockerコンテナ起動時に、このディレクトリを `/home/node/.n8n/custom` にマウントします。

```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/n8n-custom-nodes:/home/node/.n8n/custom \
  n8nio/n8n
```
※ 注意: コンテナ内のユーザー権限の問題が発生する場合があるため、適宜 `chown` などを行ってください。

### 4. n8n を再起動

ノードを読み込ませるために、n8n を再起動します。

```bash
# npm版 (pm2を使用している場合)
pm2 restart n8n

# Docker版
docker restart n8n
```

### 5. 動作確認

1.  n8n のエディタ（`http://your-server:5678`）を開きます。
2.  ワークフロー作成画面で `New Relic` ノードを検索します。
3.  ノードが表示されればインストール成功です。
4.  認証情報（Credentials）を設定し、実際にクエリが実行できるか確認します。
