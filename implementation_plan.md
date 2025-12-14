# LP Update Plan: VIBE CITY RECORD

現状の単一ファイル (`index.html`) で構成されたLPを、メンテナンス性とデザイン性を向上させるためにアップデートします。
「Premium Design」のガイドラインに従い、サイバーパンク/ネオンの美学を強化し、モダンなWeb標準に合わせます。

## User Review Required

> [!IMPORTANT]
> 既存の `index.html` はバックアップとして `index_backup.html` にリネームし、新しい構成で上書きします。
> 画像や音声ファイルはそのまま利用しますが、パスの変更が必要な場合は調整します。

## Proposed Changes

### Structure Refactoring
コードの可読性と管理性を高めるため、ファイルを分割します。

#### [NEW] `css/style.css`
- `index.html` 内の `<style>` ブロックを抽出。
- 変数 (`:root`) を整理し、カラーパレットを統一。
- グラスモーフィズム (Glassmorphism) 効果やネオン発光エフェクトのクラスを追加。

#### [NEW] `js/script.js`
- `index.html` 内の `<script>` ブロックを抽出。
- イベントリスナーの登録を整理。
- スクロールアニメーションやインタラクションのロジックを強化。

#### [MODIFY] `index.html`
- CSS/JSのリンク読み込みに変更。
- セマンティックなHTML構造への微修正。
- 各セクションのデザイン構造をCSSフレームワーク（自作）に合わせて調整。

### Design Enhancements
1.  **Hero Section**:
    - タイポグラフィのアニメーション強化。
    - 背景画像の切り替えをよりスムーズに。
2.  **Cards (Release, Artists, Blog)**:
    - グラスモーフィズム（半透明の背景ぼかし）の適用。
    - ホバー時のインタラクション（拡大、発光）を洗練させる。
3.  **Navigation**:
    - スクロール追従型のヘッダーデザインの改善。
    - モバイルメニューのアニメーション改善。
4.  **Footer**:
    - オーディオビジュライザー（CSSアニメーション）のデザイン調整。

## Verification Plan

### Automated Tests
- 現状、自動テスト環境はないため、ブラウザでの目視確認を主とします。

### Manual Verification
以下の項目をブラウザで確認します。
1.  **Layout & Design**:
    - PC (1920px, 1366px) での表示崩れがないか。
    - Mobile (iPhone SE, 12/13/14, Pixel) でのレスポンシブ挙動。
2.  **Interactions**:
    - ハンバーガーメニューの開閉。
    - 楽曲の再生・停止（プレビュー、グリッド内の再生ボタン）。
    - ヒーローセクションのカルーセル動作。
    - モーダルウィンドウ（POI, Blog）の開閉。
3.  **Console Errors**:
    - DevToolsでエラーが出ていないか確認。
