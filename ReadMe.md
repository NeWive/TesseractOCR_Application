一个基于Tesseract.js和electron、react hooks的桌面应用

## 使用

1.   将中文训练数据放入module/中
2.   分别在根目录和ocr_app_client/中安装依赖
3.   在ocr_app_client/中运行 `yarn run build`
4.   如果不打包出可执行的程序可在根目录中运行 `yarn run dev-app`
5.   如果打包则在根目录执行 `yarn run dist`

## 备注

未填写针对Linux和Mac的打包配置