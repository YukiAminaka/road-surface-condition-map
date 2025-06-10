## 路面の粗さを可視化するアプリケーションです。
計測デバイスのリポジトリ
https://github.com/YukiAminaka/road-surface-recognition
機械学習モデルの構築はedge impulseで行いました。
https://studio.edgeimpulse.com/public/573911/live
## システム構成
![Image](https://github.com/user-attachments/assets/63505cef-a6c5-4cb4-9ab5-bc361e7436e1)

地図上に路面の粗さ(滑らかな路面・中間・荒れた路面)と、計測時の走行状態(停止・自転車を振って走った状態)を色別の点でプロットします。
右上の検索ボックスか地図を2点クリックすることで、ルートが検索されます。ルートはドラッグして動かして調整できます。
「save as GPX」を押すとgoogle map等の地図アプリで使用できるGPXファイルが保存され、地図アプリ上に作成したルートを表示できます。
![Image](https://github.com/user-attachments/assets/6007bcff-c26d-4131-b278-141241696736)
### ルート検索
ルート検索にはMaps Javascript APIを使用しています。
![Image](https://github.com/user-attachments/assets/0f4e9885-a28b-45ff-9c34-4e110cbd39d5)
