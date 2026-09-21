# 日下武紀 — 公開プロフィール

公開プロフィールと、外部チャネルへの入口。
GitHub Pages: https://takenori-kusaka.github.io/digital-garden/

気になることやまとめは [publishing-hub](https://github.com/Takenori-Kusaka/publishing-hub) と [Zenn](https://zenn.dev/takenori_kusaka) で発信しています。

## 構成

| パス | 役割 |
|---|---|
| `/` | 自己定義・できること・外部への入口 |
| `/about/` | 人となり・原則 |
| `/career/` | キャリアビジョン |
| `/career/system/` | キャリア開発計画 |
| `/resume/` | 職務経歴書 |
| `/feeds/` | 購読している情報源（アンテナ） |

## 開発

```sh
npm install
npm run dev      # localhost:4321/digital-garden/
npm run build
npm run preview
```

CI（GitHub Actions）でビルドし、GitHub Pages へデプロイします。
private リポジトリ `personal` の完全データは読みません。公開してよいサブセットだけをこのリポジトリに置きます。
