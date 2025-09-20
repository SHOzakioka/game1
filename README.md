# developブランチの運用ルール

本プロジェクトでは、開発の中心となる **developブランチ** を軸に運用を行います。

---

## Issueの活用

### 粒度
- 基本は **半日〜1日程度で完了できるタスク単位** とする
- 大きすぎるタスクは細分化し、逆に細かすぎる修正はコミットだけで済ませる

### ラベル（タグ）の種類
- `feature` : 新機能
- `bug` : バグ修正
- `refactor` : リファクタリング
- `chore` : 環境構築・設定
- `documentation` : ドキュメント改善
- `priority: high` : 優先度が高いタスク

### 運用サイクル
1. 思いついたタスク・改善点はすべてIssueとして起票する
2. 優先度の高いIssueから `feature` ブランチを作成する  
   - ブランチ名には **Issue番号を含める**  
   例: `f-develop_#12-add-score-ui`
3. PRを作成し、レビューや自己チェックを行う
4. レビュー通過後、`develop` にマージすると同時にIssueをクローズする

---

## mainブランチへのマージ条件
- ある程度の機能がまとまったタイミング
- 対応したIssueが十分に片付いていること
- 動作確認とテストが完了していること

---

## ブランチ戦略

本プロジェクトでは、以下のようにブランチを運用します。

- **main** : 本番リリース用ブランチ。安定版コードのみを保持
- **develop** : 開発の基盤となるブランチ。新機能や修正はここに統合
- **feature** : 機能追加や修正単位で作成するブランチ。作業完了後にdevelopへマージ

```mermaid
%%{init: {'theme':'dark','themeVariables': {
  'background':'#0b0f14',
  'primaryColor':'#111827',
  'primaryBorderColor':'#374151',
  'primaryTextColor':'#e5e7eb',
  'secondaryColor':'#0f172a',
  'secondaryBorderColor':'#475569',
  'tertiaryColor':'#111827',
  'tertiaryTextColor':'#cbd5e1',
  'lineColor':'#475569',
  'textColor':'#e5e7eb',
  'git0':'#60a5fa','git1':'#f472b6','git2':'#34d399','git3':'#fbbf24'
}}}%%

%% ブランチ戦略（gitGraph + Dark Theme）
gitGraph
   commit id: "init"
   branch develop
   commit id: "setup"

   %% feature #12
   branch "f-#12-add-score-ui"
   commit id: "ui-work"
   checkout develop
   merge "f-#12-add-score-ui"

   %% feature #15
   branch "f-#15-enemy-ai"
   commit id: "ai-work"
   checkout develop
   merge "f-#15-enemy-ai"

   %% リリース
   checkout main
   merge develop tag: "release"
```