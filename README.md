

# p5.js Sketch Demo

このリポジトリは、p5.js を使ったシンプルなスケッチサンプルプロジェクトです。  
ブラウザ上で簡単に動作を確認できるよう、最小限の構成で作成しています。

---

## プロジェクト概要

- **目的**  
  p5.js を使ったインタラクティブな描画やアニメーションのサンプルを通じて、  
  Web 上でのビジュアル表現手法を学ぶことを目的としています。

- **特徴**  
  - 最小限の HTML＋JavaScript で動作  
  - CSS でキャンバス表示設定を管理  
  - p5.js 本体を CDN から読み込み  

---

## 必要環境

- Web ブラウザ（Chrome, Firefox, Safari など）  
- ローカルでサーバを立てたい場合
  - Node.js ＋ npm もしくは Python 等の簡易 HTTP サーバ

---

## セットアップ

1. リポジトリをクローン・ダウンロード  
   ```bash
   git clone https://github.com/your-username/p5js-sketch-demo.git
   cd p5js-sketch-demo
   ```

2. ローカルサーバを起動  
   - **Node.js** をお使いの場合  
     ```bash
     npx http-server . -p 8000
     ```
   - **Python** をお使いの場合
     ```bash
     # Python 3.x
     python -m http.server 8000
     ```

3. Docker Compose を使う場合  
   - プロジェクトルートにある `docker-compose.yml` を使ってコンテナを起動します。  
     ```bash
     docker-compose up
     ```
   - 起動後、ブラウザで `http://localhost:8000` にアクセスしてください。  

---

## 実行方法

1. ブラウザで以下の URL にアクセス  
   ```
   http://localhost:8000/index.html
   ```
2. `sketch.js` を編集すると、ブラウザをリロードしたときに変更が反映されます。  

---

## ファイル構成

```
p5js-sketch-demo/
├── index.html      # エントリーポイント
├── style.css       # キャンバス表示のスタイル設定
├── sketch.js       # p5.js のスケッチ本体
└── README.md       # 本ドキュメント
```

- **index.html**  
  p5.js ライブラリを読み込み，`sketch.js` を呼び出す最小限の HTML  
- **style.css**  
  `html, body` の余白リセットと，`canvas` をフルスクリーンで表示する設定  
- **sketch.js**  
  `setup()`／`draw()` を実装して，インタラクティブな表現を行う JavaScript  

---

## カスタマイズ方法

- **スケッチの編集**  
  - `sketch.js` の `setup()`／`draw()` 内に任意のコードを追加してください。  
- **キャンバスサイズ変更**  
  ```js
  function setup() {
    createCanvas(windowWidth, windowHeight);
  }
  ```
- **スタイル調整**  
  - `style.css` で `canvas` の表示設定（マージンやボーダー）をカスタマイズ可能です。  

---

## 参考リンク

- [p5.js 公式リファレンス](https://p5js.org/reference/)  
- [p5.js Getting Started](https://p5js.org/get-started/)  

---

## ライセンス

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

このプロジェクトは [MIT License](LICENSE) の下で公開しています。  
詳細は `LICENSE` ファイルをご覧ください。

---

1. 上記の `sketch.js` にお好きなコードを追加して，自由にアニメーションやインタラクションをお試しください。  
2. ご不明点やフィードバックがあれば，Issue または Pull Request にてお知らせいただければ幸いです。  