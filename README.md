# JSConsoleLogger
![license](https://img.shields.io/github/license/Kyo-suke/JSConsoleLogger.svg) ![license](https://img.shields.io/github/release/Kyo-suke/JSConsoleLogger.svg)

## 概要
Javascriptでロギングを行う為のライブラリです。  

console.log等のconsoleメソッドにフックする事ができ、既存のコードを修正せずにロギングを行う事ができます。  

取得したログをダウンロードする機能もあり、Webアプリケーションのユーザーサポートなどに役立てる事ができます。

## 利用方法
[Releases](https://github.com/Kyo-suke/JSConsoleLogger/releases)からスクリプトをダウンロードし、ご自身のプロジェクトに配置して下さい。  
scriptタグで「js-console-logger.min.js」を読み込み利用します。

```html
<script type="text/javascript" src="js-console-logger.min.js">
```

開発・デバッグ用途に非圧縮版を利用する場合は「js-console-logger.js」をご利用下さい。

```html
<script type="text/javascript" src="js-console-logger.js">
```

## APIリファレンス
### JSConsoleLogger.log(obj1 [, obj2, ..., objN])
引数で渡した内容をログ種別「log」としてロギングします。  
任意のタイミングでロギングしたい場合に利用します。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| obj1 ... objN | any | ロギングするオブジェクト。 |

### JSConsoleLogger.info(obj1 [, obj2, ..., objN])
引数で渡した内容をログ種別「info」としてロギングします。  
任意のタイミングでロギングしたい場合に利用します。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| obj1 ... objN | any | ロギングするオブジェクト。 |

### JSConsoleLogger.debug(obj1 [, obj2, ..., objN])
引数で渡した内容をログ種別「debug」としてロギングします。  
任意のタイミングでロギングしたい場合に利用します。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| obj1 ... objN | any | ロギングするオブジェクト。 |

### JSConsoleLogger.warn(obj1 [, obj2, ..., objN])
引数で渡した内容をログ種別「warn」としてロギングします。  
任意のタイミングでロギングしたい場合に利用します。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| obj1 ... objN | any | ロギングするオブジェクト。 |

### JSConsoleLogger.error(obj1 [, obj2, ..., objN])
引数で渡した内容をログ種別「log」としてロギングします。  
任意のタイミングでロギングしたい場合に利用します。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| obj1 ... objN | any | ロギングするオブジェクト。 |

### JSConsoleLogger.clean()
保持しているログを消去します。

### JSConsoleLogger.getLogData()
現在保持しているログデータ配列の参照を取得します。

### JSConsoleLogger.getLogFileBlob([mimeType] [, withBOM] [, lineFeedCode])
ログファイルのBlobオブジェクトを取得します。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| mimeType | string | ログファイルのMIMEタイプを指定します。 <br> 未指定の場合は"text/plain"となります。 |
| withBOM | boolean | ログファイルにBOMを付けるかを指定します。 <br> true: BOMを付与する。false: BOMを付与しない。 <br> 未指定の場合はfalseとなります。 |
| lineFeedCode | string | ログファイルの改行コード("cr" \| "lf" \| "crlf")を指定します。 <br> 未指定の場合は"crlf"となります。 |

### JSConsoleLogger.save([filename] [, mimeType] [, withBOM] [, lineFeedCode])
ログファイルを生成し、ブラウザからダウンロードを行います。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| filename | string | ログファイルのファイル名を指定します。 <br> 以下の特殊文字を入れる事で特殊なパラメーターに置換されます。 <br> %d : 現在の日付。「YYYYmmDD」形式。 <br> %t : 現在の時間。「HHMMSS」形式。 |
| mimeType | string | ログファイルのMIMEタイプを指定します。 <br> 未指定の場合は"text/plain"となります。 |
| withBOM | boolean | ログファイルにBOMを付けるかを指定します。 <br> true: BOMを付与する。false: BOMを付与しない。 <br> 未指定の場合はfalseとなります。 |
| lineFeedCode | string | ログファイルの改行コード("cr" \| "lf" \| "crlf")を指定します。 <br> 未指定の場合は"crlf"となります。 |

### JSConsoleLogger.setLoggingTarget(logType1 [, logType2 ... , logTypeN])
ロギング対象にするログタイプを設定します。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| logType1 ... logTypeN | any | ロギング対象にするログタイプ。 <br> ("log" \| "info" \| "debug" \| "warn" \| "error") |

### JSConsoleLogger.setLogBufferSize(bufferSize)
保持するログの最大数を設定します。  

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| bufferSize | number | 保持するログの最大数。 |

- ログ最大数のデフォルト値は1000です。
- ログの最大数を超えた場合、古いログから削除されます。

### JSConsoleLogger.setStackTraceOnConsole(enabled)
コンソールメソッドをフックすると、開発者がブラウザコンソールから発生箇所が分かりにくくなるデメリットがあります。  
フックした各種コンソールメソッドが実行された際にスタックトレースを表示する事で、この問題を解決する事が出来ます。

| 引数 | 型 | 説明 |
|:---:|:---:|:---|
| enabled | boolean | true : スタックトレースを有効にする。 <br> false : スタックトーレスを無効にする。 |

- デフォルトは無効に設定されています。

## 対応ブラウザ
ECMAScript5以降に対応したモダンブラウザでご利用いただけます。

- Internet Explorerは10以降に対応。

## ライセンス
MIT License。
[LICENSE](LICENSE)ファイルを参照して下さい。

## 更新履歴
詳しい更新履歴は[CHANGELOG.md](CHANGELOG.md)を参照して下さい。
